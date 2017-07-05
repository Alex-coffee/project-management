import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStaticComponent } from './product-static.component';

describe('ProductStaticComponent', () => {
  let component: ProductStaticComponent;
  let fixture: ComponentFixture<ProductStaticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductStaticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
