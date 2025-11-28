import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ApiService } from '../../services/api-service';
import { NavbarRecepcion } from '../../navbar/navbar-recepcion/navbar-recepcion';
import Swal from 'sweetalert2';
import { couldStartTrivia } from 'typescript';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reparaciones',
  imports: [NgxDatatableModule, NavbarRecepcion, CommonModule],
  templateUrl: './reparaciones.html',
  styleUrl: './reparaciones.css'
})
export class Reparaciones implements OnInit {

  rows: any[] = [];
  filteredRows: any[] = [];
  loading = true;
  filterValue = '';
  vehiculos: { Name: string, Id: string, Id_Cliente: string }[] = [];
  clientes: { Name: string, Id: string }[] = [];

  constructor(private http: HttpClient, private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.getReparaciones();
    this.getVehiculos();
    this.getClientes();
  }

  getVehiculos() {
    const id = localStorage.getItem("Id_Taller")

    this.api.get("vehiculos/" + id).subscribe({
      next: (data) => {
        this.vehiculos = data.vehiculos.map((item: any) => ({ Name: item.Car_Plate, Id: item.Id, Id_Cliente: item.Id_Cliente }));
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  getClientes() {
    const id = localStorage.getItem("Id_Taller")

    this.api.get("clientes/" + id).subscribe({
      next: (data) => {
        this.clientes = data.clientes.map((item: any) => ({ Name: item.DNI, Id: item.Id }));
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }


  getReparaciones() {
    const id = localStorage.getItem("Id_Taller")

    this.api.get("reparaciones/" + id).subscribe({
      next: (data) => {
        this.rows = data.reparaciones;
        this.filteredRows = data.reparaciones;
        this.loading = false;
        console.log(data)

      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }


  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    this.filteredRows = this.rows.filter(d =>
      d.DNI?.toLowerCase().includes(val) ||
      d.Car_Plate?.toLowerCase().includes(val) ||
      d.Repair_Request?.toLowerCase().includes(val) ||
      d.State?.toLowerCase().includes(val) ||
      d.Date?.toLowerCase().includes(val)
    );

    this.filterValue = val;
  }


  factura(id: any) {
    this.router.navigate(['/factura', id]);
  }

  async addReparacion() {
    const opcionesCliente = this.clientes
      .map((item: any) => `<option value="${item.Id}">${item.Name}</option>`)
      .join('');

    const opcionesVehiculo = this.vehiculos
      .map((item: any) => `<option value="${item.Id}" data-cliente="${item.Id_Cliente}">${item.Name}</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: 'Nueva orden de reparación',
      html: `
      <input id="swal-input-repair" class="swal2-input" placeholder="Introduce la reparación">
      <select id="swal-input-idcliente" class="swal2-input" style="width:260px; margin-top:15px">
        <option value="" disabled selected>Selecciona el cliente</option>
        ${opcionesCliente}
      </select>
      <select id="swal-input-idvehiculo" class="swal2-input" style="width:260px; margin-top:15px">
        <option value="" disabled selected>Selecciona el vehículo</option>
        ${opcionesVehiculo}
      </select>
    `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',

      didOpen: () => {
        const clienteSelect = document.getElementById('swal-input-idcliente') as HTMLSelectElement;
        const vehiculoSelect = document.getElementById('swal-input-idvehiculo') as HTMLSelectElement;

        clienteSelect.addEventListener('change', (event) => {
          const idCliente = (event.target as HTMLSelectElement).value;
          const vehiculosFiltrados = this.vehiculos.filter(v => v.Id_Cliente === idCliente);

          // actualizar opciones del select de vehículo
          vehiculoSelect.innerHTML = `
          <option value="" disabled selected>Selecciona el vehículo</option>
          ${vehiculosFiltrados.map(v => `<option value="${v.Id}">${v.Name}</option>`).join('')}
        `;
        });
      },

      preConfirm: () => {
        const repair = (document.getElementById('swal-input-repair') as HTMLInputElement).value.trim();
        const idvehiculo = (document.getElementById('swal-input-idvehiculo') as HTMLSelectElement).value.trim();
        const idcliente = (document.getElementById('swal-input-idcliente') as HTMLSelectElement).value.trim();
        const state = "Pendiente";
        const date = new Date().toISOString().split('T')[0];

        if (!repair || !idvehiculo || !idcliente) {
          Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
          return null;
        }

        return {
          Id_Vehiculo: idvehiculo,
          Repair_Request: repair,
          Id_Cliente: idcliente,
          Id_Taller: localStorage.getItem("Id_Taller"),
          State: state,
          Date: date
        };
      }
    });

    if (formValues) {
      const body = {
        Id_Vehiculo: formValues.Id_Vehiculo,
        Repair_Request: formValues.Repair_Request,
        Id_Cliente: formValues.Id_Cliente,
        Id_Taller: formValues.Id_Taller,
        State: formValues.State,
        Date: formValues.Date
      };
      this.api.post("reparaciones", body).subscribe({

        next: (response) => {
          this.getReparaciones();
          Swal.fire({
            icon: 'success',
            title: 'Reparación creada',
            text: `Se registró correctamente`,
          });

        },
        error: (err) => {
          console.error('Error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear la reparación'
          });
        }
      });

    }
  }

  async editReparacion(reparacion: any) {
    const opcionesCliente = this.clientes
      .map(
        (item: any) =>
          `<option value="${item.Id}" ${item.Id === reparacion.Id_Cliente ? 'selected' : ''}>${item.Name}</option>`
      )
      .join('');

    const opcionesVehiculo = this.vehiculos
      .filter(v => v.Id_Cliente === reparacion.Id_Cliente)
      .map(
        (item: any) =>
          `<option value="${item.Id}" ${item.Id === reparacion.Id_Vehiculo ? 'selected' : ''}>${item.Name}</option>`
      )
      .join('');

    const { value: formValues } = await Swal.fire({
      title: '✏️ Editar reparación',
      html: `
      <input id="swal-input-repair" class="swal2-input" placeholder="Introduce la reparación" value="${reparacion.Repair_Request}">
      <select id="swal-input-idcliente" class="swal2-input" style="width:260px; margin-top:15px">
        <option value="" disabled>Selecciona el cliente</option>
        ${opcionesCliente}
      </select>
      <select id="swal-input-idvehiculo" class="swal2-input" style="width:260px; margin-top:15px">
        <option value="" disabled>Selecciona el vehículo</option>
        ${opcionesVehiculo}
      </select>
      <select id="swal-input-state" class="swal2-input" style="width:260px; margin-top:15px">
        <option value="Pendiente" ${reparacion.State === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
        <option value="En Proceso" ${reparacion.State === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
        <option value="Completado" ${reparacion.State === 'Completado' ? 'selected' : ''}>Completado</option>
      </select>
    `,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',

      didOpen: () => {
        const clienteSelect = document.getElementById('swal-input-idcliente') as HTMLSelectElement;
        const vehiculoSelect = document.getElementById('swal-input-idvehiculo') as HTMLSelectElement;

        clienteSelect.addEventListener('change', (event) => {
          const idCliente = (event.target as HTMLSelectElement).value;
          const vehiculosFiltrados = this.vehiculos.filter(v => v.Id_Cliente === idCliente);
          vehiculoSelect.innerHTML = `
          <option value="" disabled selected>Selecciona el vehículo</option>
          ${vehiculosFiltrados.map(v => `<option value="${v.Id}">${v.Name}</option>`).join('')}
        `;
        });
      },

      preConfirm: () => {
        const repair = (document.getElementById('swal-input-repair') as HTMLInputElement).value.trim();
        const idvehiculo = (document.getElementById('swal-input-idvehiculo') as HTMLSelectElement).value.trim();
        const idcliente = (document.getElementById('swal-input-idcliente') as HTMLSelectElement).value.trim();
        const state = (document.getElementById('swal-input-state') as HTMLSelectElement).value.trim();

        if (!repair || !idvehiculo || !idcliente) {
          Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
          return null;
        }

        return {
          Id: reparacion.Id,
          Id_Vehiculo: idvehiculo,
          Repair_Request: repair,
          Id_Cliente: idcliente,
          Id_Taller: localStorage.getItem("Id_Taller"),
          State: state,
          Date: reparacion.Date
        };
      }
    });

    if (formValues) {
      const body = {
        Id: formValues.Id,
        Id_Vehiculo: formValues.Id_Vehiculo,
        Repair_Request: formValues.Repair_Request,
        Id_Cliente: formValues.Id_Cliente,
        Id_Taller: formValues.Id_Taller ,
        State: formValues.State,
        Date: formValues.Date
      };
      this.api.put(`reparaciones`, body).subscribe({
        
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Reparación actualizada',
            text: 'Los cambios se guardaron correctamente'
          });
          this.getReparaciones();
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
        // Acción confirmada

        this.api.delete("reparacion/" + id).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Reparación Borrada',
            });
            this.getReparaciones();
          },
          error: (err) => {
            console.error('Error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo borrar la reparación'
            });
          }
        });
      } else {
        Swal.fire('Cancelado', 'No se hizo ningún cambio.', 'info');
      }
    });
  }


}