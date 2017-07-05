import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRawMaterialsComponent } from './order-raw-materials.component';

describe('OrderRawMaterialsComponent', () => {
  let component: OrderRawMaterialsComponent;
  let fixture: ComponentFixture<OrderRawMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRawMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRawMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
