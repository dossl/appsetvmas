import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreAccountPage } from './restore-account.page';

describe('RestoreAccountPage', () => {
  let component: RestoreAccountPage;
  let fixture: ComponentFixture<RestoreAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoreAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
