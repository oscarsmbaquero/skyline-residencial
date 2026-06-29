import { Component, ElementRef, ViewChild, AfterViewChecked, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  private http       = inject(HttpClient);
  private isBrowser  = isPlatformBrowser(inject(PLATFORM_ID));

  isOpen    = false;
  loading   = false;
  input     = '';
  messages: Message[] = [
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy el asistente de Skyline Residencial. Estoy aquí para resolver tus dudas sobre viviendas VPO y la promoción La Mazuela en Plasencia. ¿En qué puedo ayudarte?',
    },
  ];

  quickQuestions = [
    '¿Qué es una vivienda VPO?',
    '¿Qué requisitos necesito?',
    '¿Puedo vender mi VPO?',
    '¿Qué incluye el garaje?',
    '¿Cuándo se entrega la promoción?',
  ];

  private shouldScrollToBottom = false;

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.shouldScrollToBottom = true;
  }

  closeChat(): void {
    this.isOpen = false;
  }

  askQuick(question: string): void {
    this.input = question;
    this.send();
  }

  send(): void {
    const text = this.input.trim();
    if (!text || this.loading) return;

    this.messages.push({ role: 'user', content: text });
    this.input = '';
    this.loading = true;
    this.shouldScrollToBottom = true;

    // Build messages array for the API (exclude the initial greeting)
    const apiMessages: Message[] = this.messages
      .filter(m => !(m.role === 'assistant' && this.messages.indexOf(m) === 0))
      .map(m => ({ role: m.role, content: m.content }));

    this.http.post<{ content: string; error?: string }>('/api/chat', { messages: apiMessages })
      .subscribe({
        next: (res) => {
          this.messages.push({ role: 'assistant', content: res.content });
          this.loading = false;
          this.shouldScrollToBottom = true;
        },
        error: () => {
          this.messages.push({
            role: 'assistant',
            content: 'Lo siento, hubo un error al procesar tu consulta. Por favor contacta con nosotros en info@skylineresidencial.es o llámanos al +34 927 000 000.',
          });
          this.loading = false;
          this.shouldScrollToBottom = true;
        },
      });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    if (!this.isBrowser) return;
    try {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }
}
