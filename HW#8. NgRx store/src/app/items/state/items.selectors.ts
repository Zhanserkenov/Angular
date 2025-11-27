import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsState } from './items.reducer';

export const selectItemsState = createFeatureSelector<ItemsState>('items');

export const selectItemsList = createSelector(
  selectItemsState,
  (s) => s.items
);

export const selectListTotal = createSelector(
  selectItemsState,
  (s) => s.total
);

export const selectListPage = createSelector(
  selectItemsState,
  (s) => s.page
);

export const selectListLoading = createSelector(
  selectItemsState,
  (s) => s.listLoading
);

export const selectListError = createSelector(
  selectItemsState,
  (s) => s.listError
);

export const selectSelectedItem = createSelector(
  selectItemsState,
  (s) => s.selectedItem
);

export const selectDetailsLoading = createSelector(
  selectItemsState,
  (s) => s.detailsLoading
);

export const selectDetailsError = createSelector(
  selectItemsState,
  (s) => s.detailsError
);
