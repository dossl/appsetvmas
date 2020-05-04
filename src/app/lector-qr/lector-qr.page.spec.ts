import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorQrPage } from './lector-qr.page';

describe('LectorQrPage', () => {
  let component: LectorQrPage;
  let fixture: ComponentFixture<LectorQrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectorQrPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectorQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
