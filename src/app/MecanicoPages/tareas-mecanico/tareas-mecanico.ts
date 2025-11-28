import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ApiService } from '../../services/api-service';
import { NavbarMecanico } from '../../navbar/navbar-mecanico/navbar-mecanico';
import Swal from 'sweetalert2';
import { couldStartTrivia } from 'typescript';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth-service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-tareas-mecanico',
  imports: [NgxDatatableModule, NavbarMecanico, CommonModule],
  templateUrl: './tareas-mecanico.html',
  styleUrl: './tareas-mecanico.css'
})
export class TareasMecanico {


  rows: any[] = [];
  filteredRows: any[] = [];
  loading = true;
  filterValue = '';
  reparaciones:any[]= [];
  vehiculos:any[]= [];

  constructor(private http: HttpClient, private api: ApiService, private auth: AuthService) { }

 async ngOnInit() {
  await this.getTareas();  
}


 

async getTareas() {
  const id = this.auth.getUserId();
  this.loading = true;

  try {
    const data: any = await lastValueFrom(this.api.get("tareas-mecanico/" + id));
    this.rows = data.tasks;

    // Obtenemos todas las reparaciones asociadas
    const reparaciones = await Promise.all(
      this.rows.map(t => lastValueFrom(this.api.get("reparacion/" + t.Id_Reparacion)))
    );

    // Obtenemos los vehículos asociados a esas reparaciones
    const vehiculos = await Promise.all(
      reparaciones.map(r => lastValueFrom(this.api.get("vehiculo/" + r.data.Id_Vehiculo)))
    );

    // Enlazamos toda la información
    this.rows = this.rows.map((task, index) => ({
      ...task,
      Repair_Request: reparaciones[index]?.data?.Repair_Request || '—',
      Car_Plate: vehiculos[index]?.data?.Car_Plate || '—'
    }));

    this.filteredRows = [...this.rows];
    console.log(this.filteredRows)
  } catch (err) {
    console.error('Error al cargar tareas:', err);
  } finally {
    this.loading = false;
  }
}
  

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // Filtra por cualquiera de los campos
    this.filteredRows = this.rows.filter(d =>
      d.Car_Plate?.toLowerCase().includes(val) ||
      d.Repair_Request?.toLowerCase().includes(val)
    );

    this.filterValue = val;
  }


  async editTarea(data: any) {


    const { value: formValues } = await Swal.fire({
      title: 'Editar Tarea',
      html: `
            <input id="swal-input-hours" class="swal2-input" placeholder="Nombre completo" value="${data.Hours}">
             <select id="swal-input-state" class="swal2-input" style="width:260px; margin-top:15px">
                <option value="Activa" ${data.State === 'Activa' ? 'selected' : ''}>Activa</option>
                <option value="Completada" ${data.State === 'Completada' ? 'selected' : ''}>Completada</option>
              </select>
           `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const hours = (document.getElementById('swal-input-hours') as HTMLInputElement).value.trim();
        const state = (document.getElementById('swal-input-state') as HTMLInputElement).value.trim();

        if (!hours || !state) {
          Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
          return null;
        }
        
        console.log(data)
        return {Id: data.Id, Id_Reparacion: data.Id_Reparacion, Id_Mecanico: data.Id_Mecanico, Hours: hours, State: state };
      }
    });

    if (formValues) {
      this.api.put(`tareas`, formValues).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Reparación actualizada',
            text: 'Los cambios se guardaron correctamente'
          });
          this.getTareas();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la reparación'
          });
        }
      });
    }
  }

  






}
