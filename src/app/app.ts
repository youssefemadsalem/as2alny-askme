import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  isLoading: boolean = true;
  isFading: boolean = false;

  ngOnInit() {
    setTimeout(() => {
      this._changeDetectorRef.detectChanges();
      this.isFading = true;
    }, 3000);

    setTimeout(() => {
      this._changeDetectorRef.detectChanges();
      this.isLoading = false;
    }, 3500);
  }
}
