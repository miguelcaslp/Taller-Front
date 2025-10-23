import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpladosAdmin } from './emplados-admin';

describe('EmpladosAdmin', () => {
  let component: EmpladosAdmin;
  let fixture: ComponentFixture<EmpladosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpladosAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpladosAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
