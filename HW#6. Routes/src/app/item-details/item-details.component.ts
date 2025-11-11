import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ItemsService, Item } from '../items.service';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  item: Item | null = null;
  loading = false;
  error: string | null = null;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadItem(id);
      }
    });
  }

  loadItem(id: string) {
    this.loading = true;
    this.error = null;
    this.notFound = false;

    this.itemsService.getItemById(id).subscribe({
      next: (item) => {
        this.item = item;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.notFound = true;
        } else {
          this.error = 'Failed to load item details. Please try again later.';
        }
        console.error('Error loading item:', err);
      }
    });
  }

  goBack() {
    this.location.back();
  }
}


