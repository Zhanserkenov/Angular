// src/app/items/state/items.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ItemsActions from './items.actions';
import { ItemsService } from '../services/items';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class ItemsEffects {
  // объявляем без жёсткой типизации — это предотвращает ошибки типов при AOT
  // и позволяет инициализировать эффекты в конструкторе, где DI уже готов.
  loadItems$: any;
  loadItem$: any;

  constructor(
    private actions$: Actions,
    private itemsService: ItemsService
  ) {
    // Эффекты инициализируем тут — гарантированно this.actions$ определён
    this.loadItems$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ItemsActions.loadItems),
        switchMap(({ query, page }) =>
          // Подстраховка: если ваш сервис возвращает массив или объект – подберите map ниже.
          this.itemsService.getItems(query, page ?? 0).pipe(
            map((res: any) =>
              ItemsActions.loadItemsSuccess({
                items: res?.products ?? res ?? [],
                total: res?.total ?? 0,
                page: page ?? 0
              })
            ),
            catchError((error: any) =>
              of(
                ItemsActions.loadItemsFailure({
                  error:
                    error?.error?.message ??
                    error?.message ??
                    (typeof error === 'string' ? error : JSON.stringify(error))
                })
              )
            )
          )
        )
      )
    );

    this.loadItem$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ItemsActions.loadItem),
        switchMap(({ id }) =>
          this.itemsService.getItemById(id).pipe(
            map((item) => ItemsActions.loadItemSuccess({ item })),
            catchError((error: any) =>
              of(
                ItemsActions.loadItemFailure({
                  error:
                    error?.error?.message ??
                    error?.message ??
                    (typeof error === 'string' ? error : JSON.stringify(error))
                })
              )
            )
          )
        )
      )
    );
  }
}
