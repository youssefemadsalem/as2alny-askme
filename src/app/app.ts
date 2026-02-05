import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './pages/nav-bar/nav-bar';
import { Footer } from './pages/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar, Footer],
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
