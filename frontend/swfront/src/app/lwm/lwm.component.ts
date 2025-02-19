import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent, MenuItem } from '../shared/menu-item/menu-item.component';

@Component({
  selector: 'app-lwm',
  templateUrl: './lwm.component.html',
  styleUrls: ['./lwm.component.css'],
  standalone: true,
  imports: [CommonModule, MenuItemComponent]
})
export class LwmComponent {
  /**
   * Root-level menu items, each can have children for nesting.
   * placeholderContent is used for leaf nodes that display final content.
   */
  menu: MenuItem[] = [
    {
      title: 'Computer Science',
      children: [
        {
          title: 'Introduction',
          children: [
            {
              title: 'Subtopic 1',
              placeholderContent: 'Intro subtopic 1 content...'
            },
            {
              title: 'Subtopic 2',
              placeholderContent: 'Intro subtopic 2 content...'
            }
          ]
        },
        {
          title: 'Data Structures',
          placeholderContent: 'Stacks, queues, trees, graphs...'
        },
        {
          title: 'Algorithms',
          placeholderContent: 'Sorting, searching, complexity...'
        }
      ]
    },
    {
      title: 'Drawing',
      children: [
        {
          title: 'Sketching Basics',
          placeholderContent: 'Shapes, lines, gesture...'
        },
        {
          title: 'Shading & Perspective',
          placeholderContent: 'Light sources, perspective drawing...'
        }
      ]
    },
    {
      title: 'Writing',
      children: [
        {
          title: 'Fiction Fundamentals',
          placeholderContent: 'Story arcs, characters, dialogue...'
        },
        {
          title: 'Non-Fiction & Essays',
          placeholderContent: 'Research, structuring arguments...'
        },
        {
          title: 'Poetry',
          placeholderContent: 'Meter, rhyme, free verse...'
        }
      ]
    }
  ];

  // The currently selected leaf item
  selectedItem: MenuItem | null = null;

  /**
   * Called when a leaf node is chosen in MenuItemComponent,
   * so we show the 'placeholderContent' in the main area.
   */
  onItemSelected(item: MenuItem) {
    this.selectedItem = item;
  }
}
