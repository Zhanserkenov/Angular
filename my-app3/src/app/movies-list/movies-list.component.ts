import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})
export class MoviesListComponent {
  movies: any[] = [];
  isLoaded = false;

  constructor(private moviesService: MoviesService) {}

  loadMovies() {
    this.moviesService.getMovies().subscribe((data: any) => {
      this.movies = data;
      this.isLoaded = true;
    });
  }
}
