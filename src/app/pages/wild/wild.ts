import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wild',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './wild.html',
  styleUrl: './wild.css',
})
export class Wild {}
