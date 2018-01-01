import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDataImportComponent } from './company-data-import.component';

describe('CompanyDataImportComponent', () => {
  let component: CompanyDataImportComponent;
  let fixture: ComponentFixture<CompanyDataImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDataImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDataImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
