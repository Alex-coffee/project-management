import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStaticImportComponent } from './product-static-import.component';

describe('ProductStaticImportComponent', () => {
  let component: ProductStaticImportComponent;
  let fixture: ComponentFixture<ProductStaticImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductStaticImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStaticImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
