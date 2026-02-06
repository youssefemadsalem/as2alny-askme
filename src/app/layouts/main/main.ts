import { Component } from '@angular/core';
import { NavBar } from '../../pages/nav-bar/nav-bar';

import { Footer } from '../../pages/footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [NavBar, RouterOutlet, Footer],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}
