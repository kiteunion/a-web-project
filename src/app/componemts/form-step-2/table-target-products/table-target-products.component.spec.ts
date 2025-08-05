import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTargetProductsComponent } from './table-target-products.component';

describe('TableTargetProductsComponent', () => {
  let component: TableTargetProductsComponent;
  let fixture: ComponentFixture<TableTargetProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableTargetProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableTargetProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
