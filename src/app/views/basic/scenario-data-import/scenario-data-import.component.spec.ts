import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioDataImportComponent } from './scenario-data-import.component';

describe('ScenarioDataImportComponent', () => {
  let component: ScenarioDataImportComponent;
  let fixture: ComponentFixture<ScenarioDataImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioDataImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioDataImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
