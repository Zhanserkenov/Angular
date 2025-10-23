import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();

  genres: any[] = [];
  selectedGenre: number | null = null;
  minRating: number = 0;
  sortBy: string = 'default';

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getGenres().subscribe(response => {
      this.genres = response.genres || [];
    });
    this.emitFilterChange();
  }

  onGenreChange(): void { this.emitFilterChange(); }
  onRatingChange(): void { this.emitFilterChange(); }
  onSortChange(): void { this.emitFilterChange(); }

  onResetFilters(): void {
    this.selectedGenre = null;
    this.minRating = 0;
    this.sortBy = 'default';
    this.emitFilterChange();
  }

  private emitFilterChange(): void {
    const filters = {
      selectedGenre: this.selectedGenre,
      minRating: this.minRating,
      sortBy: this.sortBy
    };
    this.filterChange.emit(filters);
  }
}
