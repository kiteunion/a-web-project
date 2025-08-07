import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnershipContactsComponent } from './partnership-contacts.component';

describe('PartnershipContactsComponent', () => {
  let component: PartnershipContactsComponent;
  let fixture: ComponentFixture<PartnershipContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnershipContactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnershipContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
