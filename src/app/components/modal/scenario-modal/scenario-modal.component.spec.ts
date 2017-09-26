import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioModalComponent } from './scenario-modal.component';

describe('ScenarioModalComponent', () => {
  let component: ScenarioModalComponent;
  let fixture: ComponentFixture<ScenarioModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
