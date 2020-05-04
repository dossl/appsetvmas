import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnnouncePage } from './add-announce.page';

describe('AddAnnouncePage', () => {
  let component: AddAnnouncePage;
  let fixture: ComponentFixture<AddAnnouncePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAnnouncePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnnouncePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
