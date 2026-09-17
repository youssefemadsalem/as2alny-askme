import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
  OnInit,
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
export class App implements OnInit {
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
      }, 500);

      setTimeout(() => {
        this.isLoading = false;
        this._changeDetectorRef.detectChanges();
      }, 800);
    }
  }
}
