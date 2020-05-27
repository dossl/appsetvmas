import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasSellPointPage } from './mas-sell-point.page';

describe('MasSellPointPage', () => {
  let component: MasSellPointPage;
  let fixture: ComponentFixture<MasSellPointPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasSellPointPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasSellPointPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
