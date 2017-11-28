import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandsMeetViewComponent } from './demands-meet-view.component';

describe('DemandsMeetViewComponent', () => {
  let component: DemandsMeetViewComponent;
  let fixture: ComponentFixture<DemandsMeetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandsMeetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandsMeetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
