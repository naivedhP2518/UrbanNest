import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  activeConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage = '';
  currentUser: any;
  searchQuery = '';
  isTyping = false;
  typingUser = '';
  private subscriptions = new Subscription();

  constructor(
    private chatService: ChatService,
    private agentService: AgentService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
    if (!this.currentUser) return;

    const token = this.authService.getToken();
    if (token) {
      this.chatService.connect(token);
      this.chatService.loadConversations();
    }

    this.subscriptions.add(
      this.chatService.conversations$.subscribe((conversations) => {
        this.conversations = conversations;

        // Check for agentId query param after conversations load
        const agentId = this.route.snapshot.queryParamMap.get('agentId');
        if (agentId && !this.activeConversation) {
          this.handleAgentIdParam(agentId);
        }
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

  private handleAgentIdParam(agentId: string) {
    // Check if we already have a conversation with this agent
    const existingConv = this.conversations.find(c =>
      c.participants.some(p => p._id === agentId)
    );

    if (existingConv) {
      this.selectConversation(existingConv);
    } else {
      // Fetch agent details and start a new chat
      this.agentService.getAgent(agentId).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.startAgentChat(res.data);
          }
        }
      });
    }
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
    // Check if we already have an active conversation with this agent
    const existingConv = this.conversations.find(c => 
      c.participants.some(p => p._id === agent._id)
    );

    if (existingConv) {
      this.selectConversation(existingConv);
    } else {
      // Prepare a "New Chat" placeholder
      const mockConv: any = {
        _id: 'new_' + agent._id,
        participants: [
          { _id: this.currentUser.id, name: this.currentUser.name },
          { _id: agent._id, name: agent.name, avatar: agent.avatar }
        ]
      };
      this.activeConversation = mockConv;
      this.messages = [];
    }
  }

  sendMessage() {
    if (this.newMessage.trim() && this.activeConversation) {
      const content = this.newMessage;
      this.newMessage = '';

      if (this.activeConversation._id.startsWith('new_')) {
        const participantId = this.activeConversation._id.split('_')[1];
        
        // Actual creation in DB
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
