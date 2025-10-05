import { Component } from '@angular/core';
import { AboutUsComponent } from './about-us/about-us.component';
import { MoviesListComponent } from './movies-list/movies-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AboutUsComponent, MoviesListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
}
