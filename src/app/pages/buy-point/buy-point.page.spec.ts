import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPointPage } from './buy-point.page';

describe('BuyPointPage', () => {
  let component: BuyPointPage;
  let fixture: ComponentFixture<BuyPointPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyPointPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyPointPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
