import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStep5Component } from './form-step-5.component';

describe('FormStep5Component', () => {
  let component: FormStep5Component;
  let fixture: ComponentFixture<FormStep5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStep5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
