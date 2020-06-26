import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeskMdfComponent } from './help-desk-mdf.component';

describe('HelpDeskMdfComponent', () => {
  let component: HelpDeskMdfComponent;
  let fixture: ComponentFixture<HelpDeskMdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpDeskMdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDeskMdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
