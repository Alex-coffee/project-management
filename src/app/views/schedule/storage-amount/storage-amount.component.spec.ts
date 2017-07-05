import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageAmountComponent } from './storage-amount.component';

describe('StorageAmountComponent', () => {
  let component: StorageAmountComponent;
  let fixture: ComponentFixture<StorageAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
