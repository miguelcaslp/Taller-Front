import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarRecepcion } from './navbar-recepcion';

describe('NavbarRecepcion', () => {
  let component: NavbarRecepcion;
  let fixture: ComponentFixture<NavbarRecepcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarRecepcion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarRecepcion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
