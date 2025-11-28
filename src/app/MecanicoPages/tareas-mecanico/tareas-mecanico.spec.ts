import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasMecanico } from './tareas-mecanico';

describe('TareasMecanico', () => {
  let component: TareasMecanico;
  let fixture: ComponentFixture<TareasMecanico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareasMecanico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TareasMecanico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
