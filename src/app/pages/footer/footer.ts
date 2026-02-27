import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule,RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {


currentYear = new Date().getFullYear();

  quickLinks = [
    { name: 'حجز موعد', link: '/appointments' },
    { name: 'استعلامات', link: '/inquiries' },
    { name: 'تجديد أوراق', link: '/renewals' },
    { name: 'مركز المساعدة', link: '/support' }
  ];

  services = [
    { name: 'خدمات حكومية', link: '/gov-services' },
    { name: 'خدمات مالية', link: '/financial' },
    { name: 'خدمات المرور', link: '/traffic' },
    { name: 'خدمات رقمية', link: '/digital' }
  ];

  socials = [
    { icon: 'fa-facebook-f', link: '#', color: 'hover:bg-[#1877f2]' },
    { icon: 'fa-twitter', link: '#', color: 'hover:bg-[#1da1f2]' },
    { icon: 'fa-instagram', link: '#', color: 'hover:bg-[#c32aa3]' },
    { icon: 'fa-youtube', link: '#', color: 'hover:bg-[#ff0000]' },
  ];



}
