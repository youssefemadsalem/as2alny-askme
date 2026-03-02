import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AI } from '../../core/services/AI/ai';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, Location, NgClass } from '@angular/common';
import { UserDataService } from '../../core/services/user-api/user-data';
import { ServiceApi } from '../../core/services/service-api/service-api';
import { Daum } from '../../core/interfaces/service/iservice';

interface ChatMessage {
  text: string;
  isUser: boolean;
  time: Date;
}
@Component({
  selector: 'app-chat-bot',
  imports: [FormsModule, DatePipe, NgClass, CommonModule],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.css',
})
export class ChatBot {
  private route = inject(ActivatedRoute);
  private aiService = inject(AI);
  _userDataService = inject(UserDataService);
  private _location = inject(Location);
  private readonly _serviceApi = inject(ServiceApi);

  // State
  imageUrl = signal<string | null>(null);
  isChatLoading = signal<boolean>(false);
  userMessage = signal<string>('');
  messages = signal<ChatMessage[]>([]);
  serviceId: string | null = null;
  serviceName: string = 'جاري التحميل...';
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  service = signal<Daum | null>(null);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.serviceId = params.get('id');

      // Initial greeting
      this.messages.set([
        {
          text: 'مرحباً بك! أنا مساعدك الذكي المخصص لهذه الخدمة. كيف يمكنني مساعدتك اليوم؟',
          isUser: false,
          time: new Date(),
        },
      ]);
    });

    this._userDataService.getUserData().subscribe({
      next: (res) => {
        this.imageUrl.set(res.data.profileImage?.url || null);
      },
    });

    if (this.serviceId) {
      this.fetchServiceDetails(this.serviceId);
    }
  }

  sendMessage() {
    const text = this.userMessage().trim();
    if (!text || !this.serviceId || this.isChatLoading()) return;

    // 1. Add User Message
    this.messages.update((msgs) => [...msgs, { text, isUser: true, time: new Date() }]);
    this.userMessage.set('');
    this.isChatLoading.set(true);
    this.scrollToBottom();

    // 2. Call API
    this.aiService.chat(this.serviceId, text).subscribe({
      next: (res) => {
        if (res.success) {
          this.messages.update((msgs) => [
            ...msgs,
            {
              text: res.data.answer,
              isUser: false,
              time: new Date(),
            },
          ]);
        }
        this.isChatLoading.set(false);
        this.scrollToBottom();
      },
      error: (err) => {
        console.error(err);
        this.messages.update((msgs) => [
          ...msgs,
          {
            text: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة لاحقاً.',
            isUser: false,
            time: new Date(),
          },
        ]);
        this.isChatLoading.set(false);
        this.scrollToBottom();
      },
    });
  }

  fetchServiceDetails(id: string) {
    this.isLoading.set(true);
    this._serviceApi.getSerivceById(id).subscribe({
      next: (res) => {
        this.service.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('فشل في تحميل بيانات الخدمة');
        this.isLoading.set(false);
      },
    });
  }

  goBack() {
    this._location.back();
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTo({
          top: this.scrollContainer.nativeElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }
}
