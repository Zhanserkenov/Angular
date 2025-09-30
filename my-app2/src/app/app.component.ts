import { Component } from '@angular/core';
import { AboutUsComponent } from './about-us/about-us.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [AboutUsComponent]
})
export class AppComponent {
  title = 'my-app';
}
