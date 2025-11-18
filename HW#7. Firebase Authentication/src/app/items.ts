import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ItemsResponse {
  products: Item[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getItems(query?: string, page: number = 0): Observable<ItemsResponse> {
    let params = new HttpParams();
    const limit = 20;
    const skip = page * limit;

    if (query && query.trim()) {
      params = params.set('q', query.trim());
      return this.http.get<ItemsResponse>(`${this.apiUrl}/search`, { params });
    }

    params = params.set('limit', limit.toString()).set('skip', skip.toString());
    return this.http.get<ItemsResponse>(this.apiUrl, { params });
  }

  getItemById(id: string | number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }
}
