import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly API_KEY = '734a50061e29c8c48ca136465a0156ab';
  private readonly BASE_URL = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  getMovies(searchTerm: string = 'movie'): Observable<any> {
    const url = searchTerm.trim()
      ? `${this.BASE_URL}/search/movie?api_key=${this.API_KEY}&query=${encodeURIComponent(searchTerm)}&page=1`
      : `${this.BASE_URL}/movie/popular?api_key=${this.API_KEY}&page=1`;

    return this.http.get<any>(url);
  }

  getMovieById(id: string): Observable<any> {
    const url = `${this.BASE_URL}/movie/${id}?api_key=${this.API_KEY}&append_to_response=credits`;
    return this.http.get<any>(url);
  }

  getGenres(): Observable<any> {
    const url = `${this.BASE_URL}/genre/movie/list?api_key=${this.API_KEY}`;
    return this.http.get<any>(url);
  }
}
