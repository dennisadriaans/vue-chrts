import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Lib } from 'lib';

@Component({
  selector: 'app-root',
  imports: [Lib],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('example-app');
}
