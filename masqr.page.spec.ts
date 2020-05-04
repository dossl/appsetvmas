import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasqrPage } from './masqr.page';

describe('MasqrPage', () => {
  let component: MasqrPage;
  let fixture: ComponentFixture<MasqrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasqrPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasqrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
