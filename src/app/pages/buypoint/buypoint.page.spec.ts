import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuypointPage } from './buypoint.page';

describe('BuypointPage', () => {
  let component: BuypointPage;
  let fixture: ComponentFixture<BuypointPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuypointPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuypointPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
