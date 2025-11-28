import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ApiService } from '../../services/api-service';
import { NavbarRecepcion } from '../../navbar/navbar-recepcion/navbar-recepcion';
import Swal from 'sweetalert2';
import { couldStartTrivia } from 'typescript';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tareas',
  imports: [NgxDatatableModule, NavbarRecepcion, CommonModule],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css'
})
export class Tareas {

  rows: any[] = [];
  filteredRows: any[] = [];
  loading = true;
  filterValue = '';
  mecanicos: { Name: string, Id: string }[] = [];
  reparaciones: { Name: string, Id: string }[] = [];

  constructor(private http: HttpClient, private api: ApiService) { }

  ngOnInit() {
    this.getTareas();
    this.getReparaciones();
    this.getMecanicos();

  }

  getTareas() {
    const id = localStorage.getItem("Id_Taller")

    this.api.get("tareas/" + id).subscribe({
      next: (data) => {
        console.log("tareas", data)
        this.rows = data.tasks;
        this.filteredRows = data.tasks;
        this.loading = false;

      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  getMecanicos() {

    const id = localStorage.getItem("Id_Taller")

    this.api.get("mecanicos/" + id).subscribe({
      next: (data) => {
        this.mecanicos = data.mecanicos
          .map((item: any) => ({
            Name: item.Name,
            Id: item.Id
          }));

      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  getReparaciones() {
    const id = localStorage.getItem("Id_Taller");

    this.api.get("reparaciones/" + id).subscribe({
      next: (data) => {
        this.reparaciones = data.reparaciones
          .filter((item: any) => item.State === "En Proceso")
          .map((item: any) => ({
            Name: item.Repair_Request,
            Id: item.Id
          }));
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    this.filteredRows = this.rows.filter(d =>
      d.Reparacion.Repair_Request?.toLowerCase().includes(val) ||
      d.Empleado.Name?.toLowerCase().includes(val) ||
      d.State?.toLowerCase().includes(val)
    );

    this.filterValue = val;
  }

  async addTarea() {

    const opcionesMecanico = this.mecanicos
      .map((item: any) => `<option value="${item.Id}">${item.Name}</option>`)
      .join('');

    const opcionesReparacion = this.reparaciones
      .map((item: any) => `<option value="${item.Id}">${item.Name}</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: 'Registrar nueva tarea',
      html: `
             <select id="swal-input-idmecanico" class="swal2-input" style="width: 260px; margin-top: 15px">
                <option value="" disabled selected>Selecciona el mecanico</option>
                ${opcionesMecanico}
              </select>
             <select id="swal-input-idreparacion" class="swal2-input" style="width: 260px; margin-top: 15px">
                <option value="" disabled selected>Selecciona orden de reparación</option>
                ${opcionesReparacion}
              </select>
           `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const Id_Mecanico = (document.getElementById('swal-input-idmecanico') as HTMLInputElement).value.trim();
        const Id_Reparacion = (document.getElementById('swal-input-idreparacion') as HTMLInputElement).value.trim();

        if (!Id_Reparacion || !Id_Mecanico) {
          Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
          return null;
        }

        return { Id_Reparacion: Id_Reparacion, Id_Mecanico: Id_Mecanico, Hours: 0, State: "Activa" };
      }
    });

    if (formValues) {
      this.api.post(`tareas`, formValues).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Tarea creada',
            text: 'La tarea se creo correctamente'
          });
          this.getTareas();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear la tarea'
          });
        }
      });
    }
  }

  async editTarea(tarea: any) {

    const opcionesMecanico = this.mecanicos
      .map((item: any) => `<option value="${item.Id}" ${item.Id === tarea.Id_Mecanico ? 'selected' : ''}>${item.Name}</option>`)
      .join('');

    const opcionesReparacion = this.reparaciones
      .map((item: any) => `<option value="${item.Id}"  ${item.Id === tarea.Id_Reparacion ? 'selected' : ''}>${item.Name}</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: '✏️ Editar tarea',
      html: `
             <select id="swal-input-idmecanico" class="swal2-input" style="width: 260px; margin-top: 15px">
                <option value="" disabled selected>Selecciona el mecanico</option>
                ${opcionesMecanico}
              </select>
             <select id="swal-input-idreparacion" class="swal2-input" style="width: 260px; margin-top: 15px">
                <option value="" disabled selected>Selecciona orden de reparación</option>
                ${opcionesReparacion}
              </select>
               <select id="swal-input-state" class="swal2-input" style="width:260px; margin-top:15px">
                <option value="Activa" ${tarea.State === 'Activa' ? 'selected' : ''}>Activa</option>
                <option value="Completada" ${tarea.State === 'Completada' ? 'selected' : ''}>Completada</option>
              </select>
           `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const Id_Mecanico = (document.getElementById('swal-input-idmecanico') as HTMLInputElement).value.trim();
        const Id_Reparacion = (document.getElementById('swal-input-idreparacion') as HTMLInputElement).value.trim();
        const state = (document.getElementById('swal-input-state') as HTMLInputElement).value.trim();

        if (!Id_Reparacion || !Id_Mecanico) {
          Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
          return null;
        }
        
        console.log(tarea)
        return {Id: tarea.Id, Id_Reparacion: Id_Reparacion, Id_Mecanico: Id_Mecanico, Hours: tarea.Hours, State: state };
      }
    });

    if (formValues) {
      this.api.put(`tareas`, formValues).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Tarea actualizada',
            text: 'Los cambios se guardaron correctamente'
          });
          this.getTareas();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la tarea'
          });
        }
      });
    }
  }

    delete(id: string) {
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción no se puede deshacer.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, continuar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {

             this.api.delete("tarea/" + id).subscribe({
            next: (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Tarea Borrada',
              });
              this.getTareas();
            },
            error: (err) => {
              console.error('Error:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo borrar la tarea'
              });
            }
          });
          } else {
            Swal.fire('Cancelado', 'No se hizo ningún cambio.', 'info');
          }
        });
      }




}
