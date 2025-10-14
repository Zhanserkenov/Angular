import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private apiUrl = 'https://ghibliapi.vercel.app/films';

  constructor(private http: HttpClient) {}

  getMovies(searchTerm: string = ''): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(movies => {
        if (!searchTerm.trim()) return movies;
        return movies.filter(movie =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }
}
