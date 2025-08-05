import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSourceProductsComponent } from './table-source-products.component';

describe('TableSourceProductsComponent', () => {
  let component: TableSourceProductsComponent;
  let fixture: ComponentFixture<TableSourceProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSourceProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSourceProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
