import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LwmManagerComponent } from './lwm-manager.component';

describe('LwmManagerComponent', () => {
  let component: LwmManagerComponent;
  let fixture: ComponentFixture<LwmManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LwmManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LwmManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
