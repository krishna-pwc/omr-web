import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevconReportsComponent } from './devcon-reports.component';

describe('DevconReportsComponent', () => {
  let component: DevconReportsComponent;
  let fixture: ComponentFixture<DevconReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevconReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevconReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
