import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  @Input() movie: any;
  @Output() movieSelected = new EventEmitter<any>();

  onMovieClick(): void {
    this.movieSelected.emit(this.movie);
  }

  getStarRating(rating: number): string {
    const n = this.toNumber(rating);        // ожидаем 0..10
    const clamped = Math.max(0, Math.min(10, n));
    const stars = Math.round(clamped / 2); // 0..5
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  }

  toNumber(value: any): number {
    const n = parseFloat(String(value ?? '0'));
    return Number.isFinite(n) ? n : 0;
  }
}
