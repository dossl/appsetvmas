import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAnunciosPage } from './editar-anuncios.page';

describe('EditarAnunciosPage', () => {
  let component: EditarAnunciosPage;
  let fixture: ComponentFixture<EditarAnunciosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarAnunciosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarAnunciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
