import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialsComponent } from './raw-materials.component';

describe('RawMaterialsComponent', () => {
  let component: RawMaterialsComponent;
  let fixture: ComponentFixture<RawMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
