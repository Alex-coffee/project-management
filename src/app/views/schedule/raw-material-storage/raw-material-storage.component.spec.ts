import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialStorageComponent } from './raw-material-storage.component';

describe('RawMaterialStorageComponent', () => {
  let component: RawMaterialStorageComponent;
  let fixture: ComponentFixture<RawMaterialStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawMaterialStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
