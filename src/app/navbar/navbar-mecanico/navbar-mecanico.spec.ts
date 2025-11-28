import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarMecanico } from './navbar-mecanico';

describe('NavbarMecanico', () => {
  let component: NavbarMecanico;
  let fixture: ComponentFixture<NavbarMecanico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarMecanico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarMecanico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
