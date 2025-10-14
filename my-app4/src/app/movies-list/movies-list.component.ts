import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService } from '../movies.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})
export class MoviesListComponent implements OnDestroy {
  movies: any[] = [];
  isLoaded = false;

  private searchTerm$ = new Subject<string>();
  private sub!: Subscription;

  constructor(private moviesService: MoviesService) {
    this.sub = this.searchTerm$
      .pipe(
        debounceTime(300), // задержка 300 мс
        switchMap(term => this.moviesService.getMovies(term)) // fetch с searchTerm
      )
      .subscribe((data: any[]) => {
        this.movies = data;
        this.isLoaded = true;
      });
  }

  loadMovies() {
    this.moviesService.getMovies('').subscribe((data: any[]) => {
      this.movies = data;
      this.isLoaded = true;
    });
  }

  onSearch(term: string) {
    this.searchTerm$.next(term);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
