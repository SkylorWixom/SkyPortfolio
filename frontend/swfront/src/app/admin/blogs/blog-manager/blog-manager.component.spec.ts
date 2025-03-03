import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogManagerComponent } from './blog-manager.component';

describe('BlogManagerComponent', () => {
  let component: BlogManagerComponent;
  let fixture: ComponentFixture<BlogManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
