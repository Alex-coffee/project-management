import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UncoveredDemandsComponent } from './uncovered-demands.component';

describe('UncoveredDemandsComponent', () => {
  let component: UncoveredDemandsComponent;
  let fixture: ComponentFixture<UncoveredDemandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UncoveredDemandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UncoveredDemandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
