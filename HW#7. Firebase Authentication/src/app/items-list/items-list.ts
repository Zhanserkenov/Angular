import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemsService, Item } from '../items';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemCardComponent } from '../item-card/item-card';
import {AppComponent} from '../app';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ItemCardComponent],
  templateUrl: './items-list.html',
  styleUrls: ['./items-list.css']
})
export class ItemsListComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    this.searchQuery = params['q'] || '';
    this.loadItems();

    this.route.queryParams.subscribe(params => {
      const urlQuery = params['q'] || '';
      if (urlQuery !== this.searchQuery) {
        this.searchQuery = urlQuery;
        this.loadItems();
      }
    });

    const searchSub = this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(query => {
        if (query) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { q: query },
            queryParamsHandling: 'merge'
          });
        } else {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { q: null },
            queryParamsHandling: 'merge'
          });
        }
      });
    this.subscriptions.add(searchSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }


  loadItems() {
    this.loading = true;
    this.error = null;
    const query = this.searchQuery.trim() || undefined;

    this.itemsService.getItems(query).subscribe({
      next: (response) => {
        this.items = response.products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load items. Please try again later.';
        this.loading = false;
        console.error('Error loading items:', err);
      }
    });
  }
}
