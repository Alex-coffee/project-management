import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineImportComponent } from './line-import.component';

describe('LineImportComponent', () => {
  let component: LineImportComponent;
  let fixture: ComponentFixture<LineImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
