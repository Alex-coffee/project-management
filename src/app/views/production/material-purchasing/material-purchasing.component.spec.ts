import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialPurchasingComponent } from './material-purchasing.component';

describe('MaterialPurchasingComponent', () => {
  let component: MaterialPurchasingComponent;
  let fixture: ComponentFixture<MaterialPurchasingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialPurchasingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialPurchasingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
