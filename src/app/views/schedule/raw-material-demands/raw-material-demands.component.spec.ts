import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialDemandsComponent } from './raw-material-demands.component';

describe('RawMaterialDemandsComponent', () => {
  let component: RawMaterialDemandsComponent;
  let fixture: ComponentFixture<RawMaterialDemandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawMaterialDemandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialDemandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
