import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LwmComponent } from './lwm.component';

describe('LwmComponent', () => {
  let component: LwmComponent;
  let fixture: ComponentFixture<LwmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LwmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LwmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
