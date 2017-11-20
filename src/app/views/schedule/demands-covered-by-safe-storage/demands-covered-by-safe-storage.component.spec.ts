import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandsCoveredBySafeStorageComponent } from './demands-covered-by-safe-storage.component';

describe('DemandsCoveredBySafeStorageComponent', () => {
  let component: DemandsCoveredBySafeStorageComponent;
  let fixture: ComponentFixture<DemandsCoveredBySafeStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandsCoveredBySafeStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandsCoveredBySafeStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
