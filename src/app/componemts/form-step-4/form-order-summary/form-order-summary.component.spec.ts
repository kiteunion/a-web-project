import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOrderSummaryComponent } from './form-order-summary.component';

describe('FormOrderSummaryComponent', () => {
  let component: FormOrderSummaryComponent;
  let fixture: ComponentFixture<FormOrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormOrderSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
