import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BdPage } from './bd.page';

describe('BdPage', () => {
  let component: BdPage;
  let fixture: ComponentFixture<BdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BdPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
