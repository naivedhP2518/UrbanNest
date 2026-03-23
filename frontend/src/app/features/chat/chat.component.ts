import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, Message } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() propertyId!: string;
  @Input() agentId!: string;
  @Input() agentName!: string;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  messages: Message[] = [];
  newMessage = '';
  currentUser: any;
  private subscription: Subscription = new Subscription();

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
    if (this.currentUser && this.propertyId) {
      this.chatService.joinRoom(this.currentUser.id, this.propertyId);
      this.subscription.add(
        this.chatService.messages$.subscribe(msgs => {
          this.messages = msgs;
          this.scrollToBottom();
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.chatService.disconnect();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim() && this.currentUser) {
      const messageData = {
        sender: this.currentUser.id,
        receiver: this.agentId,
        property: this.propertyId,
        content: this.newMessage
      };

      this.chatService.sendMessage(messageData);
      this.newMessage = '';
    }
  }

  closeChat() {
    this.isOpen = false;
    this.close.emit();
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
