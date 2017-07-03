import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineStaticComponent } from './line-static.component';

describe('LineStaticComponent', () => {
  let component: LineStaticComponent;
  let fixture: ComponentFixture<LineStaticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineStaticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
