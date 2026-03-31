import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, Conversation, Message } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { AgentService, Agent } from '../../core/services/agent.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class ChatPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  conversations: Conversation[] = [];
  agents: Agent[] = [];
  activeConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage = '';
  currentUser: any;
  searchQuery = '';
  activeTab: 'chats' | 'agents' = 'chats';
  isTyping = false;
  typingUser = '';
  loadingAgents = false;
  private subscriptions = new Subscription();

  constructor(
    private chatService: ChatService,
    private agentService: AgentService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
    if (!this.currentUser) return;

    const token = this.authService.getToken();
    if (token) {
      this.chatService.connect(token);
      this.chatService.loadConversations();
    }

    this.loadAgents();

    this.subscriptions.add(
      this.chatService.conversations$.subscribe((conversations) => {
        this.conversations = conversations;
      })
    );

    this.subscriptions.add(
      this.chatService.messages$.subscribe((messages) => {
        this.messages = messages;
      })
    );

    this.subscriptions.add(
      this.chatService.typing$.subscribe(({ userId, conversationId }) => {
        if (
          this.activeConversation?._id === conversationId &&
          userId !== this.currentUser.id &&
          userId !== ''
        ) {
          this.isTyping = true;
          const participant = this.activeConversation?.participants.find(
            (p: any) => p._id === userId
          );
          this.typingUser = participant?.name || 'Someone';
          setTimeout(() => (this.isTyping = false), 5000);
        } else {
          this.isTyping = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.chatService.disconnect();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadAgents() {
    this.loadingAgents = true;
    this.agentService.getAgents().subscribe({
      next: (res) => {
        // Filter out current user from agents list
        this.agents = res.data.filter(a => a._id !== this.currentUser?.id);
        this.loadingAgents = false;
      },
      error: () => {
        this.loadingAgents = false;
      }
    });
  }

  selectConversation(conversation: Conversation) {
    if (this.activeConversation && !this.activeConversation._id.startsWith('new_')) {
      this.chatService.leaveConversation(this.activeConversation._id);
    }

    this.activeConversation = conversation;
    this.chatService.clearMessages();
    this.chatService.joinConversation(conversation._id);
    this.chatService.loadMessages(conversation._id);
  }

  startAgentChat(agent: Agent) {
    // 1. Check if we already have an active conversation with this agent
    const existingConv = this.conversations.find(c => 
      c.participants.some(p => p._id === agent._id)
    );

    if (existingConv) {
      this.selectConversation(existingConv);
      this.activeTab = 'chats';
    } else {
      // 2. Prepare a "New Chat" placeholder
      const mockConv: any = {
        _id: 'new_' + agent._id,
        participants: [
          { _id: this.currentUser.id, name: this.currentUser.name },
          { _id: agent._id, name: agent.name, avatar: agent.avatar }
        ]
      };
      this.activeConversation = mockConv;
      this.messages = [];
      this.activeTab = 'chats';
    }
  }

  sendMessage() {
    if (this.newMessage.trim() && this.activeConversation) {
      const content = this.newMessage;
      this.newMessage = '';

      if (this.activeConversation._id.startsWith('new_')) {
        const participantId = this.activeConversation._id.split('_')[1];
        
        // 1. Actual creation in DB
        this.chatService.createConversation(participantId).subscribe({
          next: (res) => {
            if (res.success) {
              const newConv = res.data;
              this.activeConversation = newConv;
              this.chatService.joinConversation(newConv._id);
              this.chatService.sendMessage(newConv._id, this.currentUser.id, content);
              this.chatService.loadConversations();
            }
          }
        });
      } else {
        // Normal conversation
        this.chatService.sendMessage(
          this.activeConversation._id,
          this.currentUser.id,
          content
        );
        this.chatService.emitStopTyping(this.activeConversation._id);
      }
    }
  }

  onTyping() {
    if (this.activeConversation && !this.activeConversation._id.startsWith('new_')) {
      this.chatService.emitTyping(this.activeConversation._id, this.currentUser.id);
    }
  }

  getOtherParticipant(conversation: Conversation) {
    return conversation.participants.find(
      (p) => p._id !== this.currentUser?.id
    );
  }

  getFilteredConversations(): Conversation[] {
    if (!this.searchQuery.trim()) return this.conversations;
    const query = this.searchQuery.toLowerCase();
    return this.conversations.filter((c) => {
      const other = this.getOtherParticipant(c);
      return (
        other?.name.toLowerCase().includes(query) ||
        c.property?.title?.toLowerCase().includes(query)
      );
    });
  }

  getFilteredAgents(): Agent[] {
    if (!this.searchQuery.trim()) return this.agents;
    const query = this.searchQuery.toLowerCase();
    return this.agents.filter(a => 
      a.name.toLowerCase().includes(query) || 
      a.email.toLowerCase().includes(query)
    );
  }

  formatTime(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  getAvatarUrl(avatar?: string): string {
    return this.authService.getAvatarUrl(avatar);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.messagesContainer) {
          this.messagesContainer.nativeElement.scrollTop =
            this.messagesContainer.nativeElement.scrollHeight;
        }
      } catch (err) {}
    }, 100);
  }
}
