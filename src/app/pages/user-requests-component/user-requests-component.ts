import { UserRequests } from './../../core/services/user-requests';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Request } from '../../core/interfaces/request';

@Component({
  selector: 'app-user-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-requests-component.html',
  styleUrl: './user-requests-component.css',
})
export class UserRequestsComponent implements OnInit {
  // Injections
  userRequests = inject(UserRequests);// userRequests Service


  // Variables
  requestList:Request[] = []; // list of user requests of type request

  // Class Functions
  ngOnInit(): void {
    this.userRequests.getUserRequests().subscribe({
      next: (requests) => {
        console.log(requests.data);
        this.requestList = requests.data;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Mission Completed');
      },
    });
  }

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
