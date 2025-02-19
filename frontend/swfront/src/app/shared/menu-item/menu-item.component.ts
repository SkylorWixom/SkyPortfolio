import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * MenuItem interface:
 * - title: displayed text
 * - placeholderContent?: optional text if it's a leaf node
 * - children?: an array of more MenuItems (infinite nesting)
 */
export interface MenuItem {
  title: string;
  placeholderContent?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  standalone: true,
  imports: [CommonModule] // so *ngIf, *ngFor, etc. work
})
export class MenuItemComponent {
  @Input() item!: MenuItem;   // The data node for this item
  @Input() level = 0;         // Depth level if you want indentation

  /** If expanded is true, we show the children (if any) */
  expanded = false;

  /**
   * itemSelected emits when a leaf node is chosen (no children),
   * or if a child node is chosen deeper down. 
   * The parent can then display it in main content.
   */
  @Output() itemSelected = new EventEmitter<MenuItem>();

  toggle() {
    // If the item has children, we expand/collapse
    if (this.item.children && this.item.children.length > 0) {
      this.expanded = !this.expanded;
    } else {
      // It's a leaf node: we emit selection
      this.itemSelected.emit(this.item);
    }
  }

  /**
   * Called when a child node deeper in the tree is selected.
   * We bubble that up to the parent so it can display the leaf’s content.
   */
  onChildSelected(child: MenuItem) {
    this.itemSelected.emit(child);
  }
}
