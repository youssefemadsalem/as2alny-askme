import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserImageService {
  private imageSource = new BehaviorSubject<string | null>(null);
  image$ = this.imageSource.asObservable();

  setImage(imageUrl: string) {
    this.imageSource.next(imageUrl);
  }
}
