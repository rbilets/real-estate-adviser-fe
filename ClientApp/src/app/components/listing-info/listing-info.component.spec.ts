import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingInfoComponent } from './listing-info.component';

describe('ListingInfoComponent', () => {
  let component: ListingInfoComponent;
  let fixture: ComponentFixture<ListingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
