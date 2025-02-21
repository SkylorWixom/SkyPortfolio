import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// 1) Import our service & the data interfaces from it
import { LwmService, LwmDoc, MenuItem } from '../services/lwm/lwm.service';

// 2) Import your child <app-menu-item> for the nested collapsible menu
import { MenuItemComponent } from '../shared/menu-item/menu-item.component';

@Component({
  selector: 'app-lwm',
  standalone: true,
  imports: [CommonModule, MenuItemComponent],
  templateUrl: './lwm.component.html',
  styleUrls: ['./lwm.component.css']
})
export class LwmComponent implements OnInit {
  
  // The array of docs from the DB (e.g. each doc may have items, etc.)
  docs: LwmDoc[] = [];

  // We'll flatten out the "items" from the first doc to pass to <app-menu-item>
  rootItems: MenuItem[] = [];

  // The selected leaf node for the main content area
  selectedItem: MenuItem | null = null;

  constructor(private lwmService: LwmService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.lwmService.getAllLwm().subscribe({
      next: (data) => {
        this.docs = data; 
        console.log('Retrieved LWM docs:', this.docs);

        // If there's at least one doc, we take the first doc's "items" array
        if (this.docs.length > 0) {
          this.rootItems = this.docs[0].items;
        }
      },
      error: (err) => {
        console.error('Error fetching LWM data:', err);
      }
    });
  }

  // Called by <app-menu-item> when a leaf node is chosen
  onItemSelected(item: MenuItem) {
    this.selectedItem = item;
  }
}
