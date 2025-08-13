import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSuccessComponent } from './page-success.component';

describe('PageSuccessComponent', () => {
  let component: PageSuccessComponent;
  let fixture: ComponentFixture<PageSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
