import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallerAdmin } from './taller-admin';

describe('TallerAdmin', () => {
  let component: TallerAdmin;
  let fixture: ComponentFixture<TallerAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TallerAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TallerAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
