import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOrderTotalComponent } from './form-order-total.component';

describe('FormOrderTotalComponent', () => {
  let component: FormOrderTotalComponent;
  let fixture: ComponentFixture<FormOrderTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormOrderTotalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormOrderTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
