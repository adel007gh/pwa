import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-install-pwa',
  imports: [CommonModule, HttpClientModule, NgIf],
  templateUrl: './install-pwa.component.html',
  styleUrls: ['./install-pwa.component.scss'],
  standalone: true
})
export class InstallPwaComponent {
  deferredPrompt: any;
  isOnline = navigator.onLine;
  isMobile = /Mobi|Android/i.test(navigator.userAgent);
  data: string | null = null;

  showStatus = true;
  toastMsg = '';

  constructor(private http: HttpClient) {

    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });


    window.addEventListener('online', () => this.updateNetworkStatus(true));
    window.addEventListener('offline', () => this.updateNetworkStatus(false));
  }

  private updateNetworkStatus(status: boolean) {
    this.isOnline = status;
    this.toastMsg = status
      ? 'اتصال برقرار شد — شما آنلاین هستید'
      : 'شما اکنون آفلاین هستید';
    setTimeout(() => (this.toastMsg = ''), 3000);
    this.showStatus = true;
  }

  installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then(() => (this.deferredPrompt = null));
    } else if (!this.isMobile) {
      alert(
        'امکان نصب مستقیم PWA روی دسکتاپ محدود است.\nلطفاً با مرورگر موبایل یا Chrome/Edge جدید تست کنید.'
      );
    }
  }

  getData() {
    this.http.get<{ message: string }>('/api/data').subscribe({
      next: async (res) => {
        this.data = res.message;
        const cache = await caches.open('api-cache');
        cache.put('/api/data', new Response(JSON.stringify(res)));
      },
      error: async () => {
        const cache = await caches.open('api-cache');
        const cachedRes = await cache.match('/api/data');
        if (cachedRes) {
          const json = await cachedRes.json();
          this.data = json.message + ' (از کش)';
        } else {
          this.data = 'هیچ داده‌ای موجود نیست';
        }
      }
    });
  }
}
