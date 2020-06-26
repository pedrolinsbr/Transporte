import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeskCteComponent } from './help-desk-cte.component';

describe('HelpDeskMdfComponent', () => {
  let component: HelpDeskCteComponent;
  let fixture: ComponentFixture<HelpDeskCteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpDeskCteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDeskCteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
