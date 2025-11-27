import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemCardComponent } from '../item-card/item-card';

import { Subscription, Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as ItemsActions from '../items/state/items.actions';
import {
  selectItemsList,
  selectListLoading,
  selectListError
} from '../items/state/items.selectors';
import { Item } from '../items/services/items';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ItemCardComponent],
  templateUrl: './items-list.html',
  styleUrls: ['./items-list.css']
})
export class ItemsListComponent implements OnInit, OnDestroy {
  items$!: Observable<Item[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  searchQuery = '';
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.items$ = this.store.select(selectItemsList);
    this.loading$ = this.store.select(selectListLoading);
    this.error$ = this.store.select(selectListError);

    const params = this.route.snapshot.queryParams;
    this.searchQuery = params['q'] || '';

    this.loadItems();

    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        const urlQuery = params['q'] || '';
        if (urlQuery !== this.searchQuery) {
          this.searchQuery = urlQuery;
          this.loadItems();
        }
      })
    );

    const searchSub = this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
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
    const query = this.searchQuery.trim() || undefined;
    this.store.dispatch(ItemsActions.loadItems({ query, page: 0 }));
  }
}
