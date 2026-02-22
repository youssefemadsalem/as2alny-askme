import { UserRequests } from './../../core/services/user-requests';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Request } from '../../core/interfaces/request';

// interface Request {
//   iconBg: string;
//   name: string;
//   id: string;
//   date: string;
//   status: 'completed' | 'pending' | 'rejected';
// }

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {
  user = {
    fullName: 'يوسف محمد أحمد',
    email: 'yousef@example.com',
    nationalId: '1234567890',
    phone: '0123456789',
  };

  // requests: Request[] = [
  //   {
  //     iconBg: 'bg-blue-100',
  //     name: 'تجديد رخصة القيادة',
  //     id: '#REQ-2023-884',
  //     date: '15 أكتوبر 2023',
  //     status: 'completed',
  //   },
  //   {
  //     iconBg: 'bg-orange-100',
  //     name: 'استخراج بطاقة تموين',
  //     id: '#REQ-2023-912',
  //     date: '20 أكتوبر 2023',
  //     status: 'pending',
  //   },
  //   {
  //     iconBg: 'bg-red-100',
  //     name: 'شهادة ميلاد مميكنة',
  //     id: '#REQ-2023-750',
  //     date: '01 سبتمبر 2023',
  //     status: 'rejected',
  //   },
  // ];
  requestList : Request[] = [];

  userRequests = inject(UserRequests);

  ngOnInit() {
    this.userRequests.getUserRequests().subscribe({
      next: (requests) => {
        console.log(requests);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Mission Completed');
      },
    });
  }

  // function that edit t
  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border border-green-200 text-green-700';
      case 'pending':
        return 'bg-yellow-100 border border-yellow-200 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 border border-red-200 text-red-700';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد المراجعة';
      case 'rejected':
        return 'مرفوض';
      default:
        return '';
    }
  }
}
