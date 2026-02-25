import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRequests } from '../../core/services/user-api/user-requests';
import { Request } from '../../core/interfaces/request';

@Component({
  selector: 'app-user-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-requests-component.html',
  styleUrl: './user-requests-component.css',
})
export class UserRequestsComponent implements OnInit {
  private readonly _userRequests = inject(UserRequests);

  requestList = signal<Request[]>([]);
  isLoading = signal<boolean>(true);

  skeletonRows = Array(5).fill(0);

  ngOnInit(): void {
    this.isLoading.set(true);

    this._userRequests.getUserRequests().subscribe({
      next: (res) => {
        this.requestList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      completed: 'bg-green-100 border border-green-200 text-green-700',
      pending: 'bg-yellow-100 border border-yellow-200 text-yellow-700',
      rejected: 'bg-red-100 border border-red-200 text-red-700',
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      completed: 'مكتمل',
      pending: 'قيد المراجعة',
      rejected: 'مرفوض',
    };
    return labels[status] || '';
  }
}
