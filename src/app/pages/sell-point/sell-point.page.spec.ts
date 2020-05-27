import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellPointPage } from './sell-point.page';

describe('SellPointPage', () => {
  let component: SellPointPage;
  let fixture: ComponentFixture<SellPointPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellPointPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellPointPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
