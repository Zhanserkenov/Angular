import { createReducer, on } from '@ngrx/store';
import * as ItemsActions from './items.actions';
import { Item } from '../services/items';

export interface ItemsState {
  items: Item[];
  total: number;
  page: number;
  listLoading: boolean;
  listError: string | null;

  selectedItem: Item | null;
  detailsLoading: boolean;
  detailsError: string | null;
}

export const initialState: ItemsState = {
  items: [],
  total: 0,
  page: 0,
  listLoading: false,
  listError: null,

  selectedItem: null,
  detailsLoading: false,
  detailsError: null,
};

export const itemsReducer = createReducer(
  initialState,

  on(ItemsActions.loadItems, (state, { page }) => ({
    ...state,
    listLoading: true,
    listError: null,
    page: typeof page === 'number' ? page : state.page,
  })),

  on(ItemsActions.loadItemsSuccess, (state, { items, total, page }) => ({
    ...state,
    items,
    total,
    page,
    listLoading: false
  })),

  on(ItemsActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    listLoading: false,
    listError: error
  })),

  on(ItemsActions.loadItem, (state) => ({
    ...state,
    detailsLoading: true,
    detailsError: null,
    selectedItem: null
  })),

  on(ItemsActions.loadItemSuccess, (state, { item }) => ({
    ...state,
    selectedItem: item,
    detailsLoading: false
  })),

  on(ItemsActions.loadItemFailure, (state, { error }) => ({
    ...state,
    detailsLoading: false,
    detailsError: error
  }))
);
