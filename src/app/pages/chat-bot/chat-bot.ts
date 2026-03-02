import { Component, ElementRef, inject, signal, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AI, LocationResponse } from '../../core/services/AI/ai';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, Location, NgClass } from '@angular/common';
import { UserDataService } from '../../core/services/user-api/user-data';
import { ServiceApi } from '../../core/services/service-api/service-api';
import { Daum } from '../../core/interfaces/service/iservice';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface ChatMessage {
  text: string;
  isUser: boolean;
  time: Date;
  locationData?: LocationResponse['data']['nearestLocation'];
  safeMapUrl?: SafeResourceUrl; // New field for the iframe URL
}

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [FormsModule, DatePipe, NgClass, CommonModule],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.css',
})
export class ChatBot implements OnInit {
  private route = inject(ActivatedRoute);
  private aiService = inject(AI);
  _userDataService = inject(UserDataService);
  private _location = inject(Location);
  private readonly _serviceApi = inject(ServiceApi);
  private sanitizer = inject(DomSanitizer);

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

    // 1. Push User Message
    this.messages.update((msgs) => [...msgs, { text, isUser: true, time: new Date() }]);
    this.userMessage.set('');
    this.isChatLoading.set(true);
    this.scrollToBottom();

    const locationKeywords = /أقرب|مكان|عنوان|موقع|خريطة|nearest|location|map/i;

    if (locationKeywords.test(text)) {
      this.handleLocationRequest();
    } else {
      this.handleNormalChat(text);
    }
  }

  private handleNormalChat(text: string) {
    this.aiService.chat(this.serviceId!, text).subscribe({
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
        this.finalizeChat();
      },
      error: (err) => this.handleError(err),
    });
  }

  private handleLocationRequest() {
    if (!navigator.geolocation) {
      this.addSystemMessage('عذراً، المتصفح لا يدعم تحديد الموقع.');
      this.isChatLoading.set(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const lastAiMessage = [...this.messages()]
          .reverse()
          .find((m) => !m.isUser && !m.locationData);
        const chatContext = lastAiMessage ? lastAiMessage.text : 'General Context';

        this.aiService.getNearestLocation({ latitude, longitude, chatContext }).subscribe({
          next: (res) => {
            if (res.success) {
              const loc = res.data.nearestLocation;

              const origin = `${latitude},${longitude}`;

              const destination = encodeURIComponent(loc.address);

              const embedUrl = `https://maps.google.com/maps?saddr=${origin}&daddr=${destination}&hl=ar&t=m&z=12&output=embed`;

              const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);

              this.messages.update((msgs) => [
                ...msgs,
                {
                  text: 'إليك المسار والوقت المتوقع للوصول إلى أقرب فرع:',
                  isUser: false,
                  time: new Date(),
                  locationData: loc,
                  safeMapUrl: safeUrl,
                },
              ]);
            }
            this.finalizeChat();
          },
          error: (err) => this.handleError(err),
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        this.addSystemMessage('يرجى السماح بتحديد الموقع للوصول إلى أقرب فرع.');
        this.isChatLoading.set(false);
      },
    );
  }

  private addSystemMessage(text: string) {
    this.messages.update((msgs) => [...msgs, { text, isUser: false, time: new Date() }]);
  }

  private handleError(err: any) {
    console.error(err);
    this.addSystemMessage('عذراً، حدث خطأ في الاتصال. يرجى المحاولة لاحقاً.');
    this.finalizeChat();
  }

  private finalizeChat() {
    this.isChatLoading.set(false);
    this.scrollToBottom();
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
