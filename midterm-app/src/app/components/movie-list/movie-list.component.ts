import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, from, mergeMap, toArray } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { SearchComponent } from '../search/search.component';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SearchComponent, FilterComponent],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit, OnDestroy {
  allMovies: any[] = [];
  movies: any[] = [];
  genres: any[] = [];

  loading = false;
  selectedMovie: any = null;
  loadingDetails = false;
  private loadingDetailsForId: string | null = null;
  private destroy$ = new Subject<void>();

  currentFilters: any = { selectedGenre: null, minRating: 0, sortBy: 'default' };

  constructor(public movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getGenres().pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.genres = response.genres || [];
      this.loadMovies(); // Load movies after genres are loaded
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  onSearchTermChange(searchTerm: string): void { this.loadMovies(searchTerm); }
  onFilterChange(filters: any): void { this.currentFilters = { ...this.currentFilters, ...filters }; this.applyFilters(); }

  onMovieSelected(movie: any): void {
    this.selectedMovie = { ...movie };
    if (movie?.Director && movie.Director !== 'N/A') return;
    if (!movie?.imdbID) return;
    if (this.loadingDetails && this.loadingDetailsForId === movie.imdbID) return;

    this.loadingDetails = true;
    this.loadingDetailsForId = movie.imdbID;

    this.movieService.getMovieById(movie.imdbID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(tmdbDetails => {
        const details = this.mapTMDBDetails(tmdbDetails);
        this.selectedMovie = { ...this.selectedMovie, ...details };
        this.mergeDetailsIntoLists(movie.imdbID, details);
        this.loadingDetails = false;
        this.loadingDetailsForId = null;
      });
  }

  onCloseDetails(): void { this.selectedMovie = null; this.loadingDetails = false; this.loadingDetailsForId = null; }

  private mergeDetailsIntoLists(imdbID: string, details: any) {
    this.allMovies = this.allMovies.map(m => m.imdbID === imdbID ? { ...m, ...details } : m);
    this.movies = this.movies.map(m => m.imdbID === imdbID ? { ...m, ...details } : m);
  }

  trackByMovieId(_: number, movie: any): string { return movie?.imdbID ?? String(_); }

  private toNumber(v: any): number {
    const n = parseFloat(String(v ?? '0'));
    return Number.isFinite(n) ? n : 0;
  }

  normalizeRatingToFive(value: any): number {
    let n = this.toNumber(value);
    if (n > 5) n = n / 2;
    n = Math.max(0, Math.min(5, n));
    return Math.round(n * 10) / 10;
  }

  getStarRating(rating: any): string {
    const norm = this.normalizeRatingToFive(rating);
    const stars = Math.max(0, Math.min(5, Math.round(norm)));
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  }

  loadMovies(searchTerm: string = 'movie'): void {
    this.loading = true;
    this.allMovies = [];
    this.movies = [];

    this.movieService.getMovies(searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        const tmdbMovies = response.results || [];
        this.allMovies = tmdbMovies.map((movie: any) => this.mapTMDBMovie(movie));
        this.applyFilters();
        this.loading = false;
      });
  }

  private applyFilters(): void {
    let list = [...this.allMovies];
    const { selectedGenre, minRating, sortBy } = this.currentFilters;

    if (selectedGenre) {
      const genreName = this.genres.find((g: any) => g.id === selectedGenre)?.name;
      if (genreName) {
        list = list.filter(m => {
          const field = String(m.Genre ?? '');
          const names = field.split(',').map((s: string) => s.trim()).filter(Boolean);
          return names.includes(genreName);
        });
      }
    }

    const minR = this.toNumber(minRating);
    if (minR > 0) {
      list = list.filter(m => this.toNumber(m.imdbRating) >= minR);
    }

    if (sortBy === 'release_date') {
      list.sort((a, b) => Number(b.Year) - Number(a.Year));
    } else if (sortBy === 'vote_average') {
      list.sort((a, b) => this.toNumber(b.imdbRating) - this.toNumber(a.imdbRating));
    }

    this.movies = list;
  }

  private mapTMDBMovie(tmdb: any): any {
    // Map genre IDs to genre names
    const genreNames = tmdb.genre_ids?.map((id: number) => {
      const genre = this.genres.find((g: any) => g.id === id);
      return genre ? genre.name : 'Unknown';
    }).join(', ') || 'Unknown';

    return {
      imdbID: String(tmdb.id),
      Title: tmdb.title,
      Year: tmdb.release_date ? tmdb.release_date.split('-')[0] : 'N/A',
      imdbRating: Number((tmdb.vote_average ?? 0).toFixed(1)),
      Plot: tmdb.overview || 'No description available',
      Poster: tmdb.poster_path ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}` : 'N/A',
      Genre: genreNames,
      Type: 'movie',
      Runtime: 'N/A',
      Director: 'N/A',
      Actors: 'N/A',
      Language: 'N/A'
    };
  }

  private mapTMDBDetails(tmdb: any): any {
    const director = tmdb.credits?.crew?.find((p: any) => p.job === 'Director')?.name || 'N/A';
    const actors = (tmdb.credits?.cast || []).slice(0, 5).map((a: any) => a.name).join(', ') || 'N/A';
    const genres = (tmdb.genres || []).map((g: any) => g.name).join(', ') || 'N/A';
    const languages = (tmdb.spoken_languages || []).map((l: any) => l.name).join(', ') || 'N/A';

    return {
      imdbID: String(tmdb.id),
      Title: tmdb.title,
      Year: tmdb.release_date ? tmdb.release_date.split('-')[0] : 'N/A',
      imdbRating: Number((tmdb.vote_average ?? 0).toFixed(1)),
      Plot: tmdb.overview || 'No description available',
      Poster: tmdb.poster_path ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}` : 'N/A',
      Genre: genres,
      Type: 'movie',
      Runtime: tmdb.runtime ? `${tmdb.runtime} min` : 'N/A',
      Director: director,
      Actors: actors,
      Language: languages
    };
  }
}
