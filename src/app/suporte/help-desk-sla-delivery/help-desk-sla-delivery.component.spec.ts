import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeskSlaDeliveryComponent } from './help-desk-cte.component';

describe('HelpDeskMdfComponent', () => {
  let component: HelpDeskSlaDeliveryComponent;
  let fixture: ComponentFixture<HelpDeskSlaDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpDeskSlaDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDeskSlaDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
