import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualOfficePage } from './virtual-office.page';

describe('VirtualOfficePage', () => {
  let component: VirtualOfficePage;
  let fixture: ComponentFixture<VirtualOfficePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualOfficePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualOfficePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
