import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as ItemsActions from '../items/state/items.actions';
import {
  selectSelectedItem,
  selectDetailsLoading,
  selectDetailsError
} from '../items/state/items.selectors';
import { Item } from '../items/services/items';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-details.html',
  styleUrls: ['./item-details.css']
})
export class ItemDetailsComponent implements OnInit, OnDestroy {
  item$: Observable<Item | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  notFound = false;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private location: Location
  ) {
    // селекторы безопасно брать в конструкторе (DI уже настроен)
    this.item$ = this.store.select(selectSelectedItem);
    this.loading$ = this.store.select(selectDetailsLoading);
    this.error$ = this.store.select(selectDetailsError);
  }

  ngOnInit() {
    // слушаем id параметр и диспатчим загрузку
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.notFound = false;
          this.store.dispatch(ItemsActions.loadItem({ id }));
        }
      });

    // подписываемся на ошибки чтобы вычислить notFound (эвристика)
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(err => {
        if (!err) {
          this.notFound = false;
        } else {
          const text = String(err).toLowerCase();
          this.notFound = text.includes('404') || text.includes('not found');
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    this.location.back();
  }
}
