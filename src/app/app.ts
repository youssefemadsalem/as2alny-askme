import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    ngSkipHydration: 'true',
  },
})
export class App implements OnInit, AfterViewInit {
  @ViewChild('splashVideo') videoElement!: ElementRef<HTMLVideoElement>;
  isLoading = true;
  isFading = false;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.isFading = true;
        this._changeDetectorRef.detectChanges();
      }, 3000);

      setTimeout(() => {
        this.isLoading = false;
        this._changeDetectorRef.detectChanges();
      }, 3500);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.videoElement) {
        const video = this.videoElement.nativeElement;
        video.muted = true;
        video.play().catch(() => {
          setTimeout(() => video.play(), 100);
        });
      }
    }
  }
}
