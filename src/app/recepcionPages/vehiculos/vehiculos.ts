import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ApiService } from '../../services/api-service';
import { NavbarRecepcion } from '../../navbar/navbar-recepcion/navbar-recepcion';
import Swal from 'sweetalert2';
import { couldStartTrivia } from 'typescript';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehiculos',
  imports: [NgxDatatableModule, NavbarRecepcion, CommonModule],
  templateUrl: './vehiculos.html',
  styleUrl: './vehiculos.css'
})
export class Vehiculos implements OnInit {

  rows: any[] = [];
  filteredRows: any[] = [];
  loading = true;
  filterValue = '';
  clientes: { Name: string, Id: string }[] = [];

  constructor(private http: HttpClient, private api: ApiService) { }

  ngOnInit() {
    this.getVehiculos();
    this.getClientes();
  }


  getVehiculos() {
    const id = localStorage.getItem("Id_Taller")

    this.api.get("vehiculos/" + id).subscribe({
      next: (data) => {
        console.log(data)
        this.rows = data.vehiculos;
        this.filteredRows = data.vehiculos;
        this.loading = false;

      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
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

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // Filtra por cualquiera de los campos
    this.filteredRows = this.rows.filter(d =>
      d.Car_Plate?.toString().toLowerCase().includes(val) ||
      d.Model?.toLowerCase().includes(val) ||
      d.Maker?.toLowerCase().includes(val)
    );

    this.filterValue = val;
  }





  async addVehiculo() {

    const opcionesCliente = this.clientes
      .map((item: any) => `<option value="${item.Id}">${item.Name}</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: 'Registrar nuevo vehiculo',
      html: `
         <input id="swal-input-car-plate" class="swal2-input" placeholder="Matricula">
         <input id="swal-input-maker" class="swal2-input" placeholder="Marca">
         <input id="swal-input-model" class="swal2-input" placeholder="Modelo">
         <select id="swal-input-idcliente" class="swal2-input" style="width: 260px; margin-top: 15px">
            <option value="" disabled selected>Selecciona el cliente</option>
            ${opcionesCliente}
          </select>
       `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const car_plate = (document.getElementById('swal-input-car-plate') as HTMLInputElement).value.trim();
        const maker = (document.getElementById('swal-input-maker') as HTMLInputElement).value.trim();
        const model = (document.getElementById('swal-input-model') as HTMLInputElement).value.trim();
        const idcliente = (document.getElementById('swal-input-idcliente') as HTMLInputElement).value.trim();

        if (!car_plate || !maker || !model) {
          Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
          return null;
        }

        return { Car_Plate: car_plate, Model: model, Maker: maker, Id_Taller: localStorage.getItem("Id_Taller"), Id_Cliente: idcliente };
      }
    });

    if (formValues) {
      this.api.post("vehiculos", formValues).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Vehiculo registrado',
            text: `Vehiculo: ${formValues.Car_Plate}`,
            confirmButtonText: 'Aceptar'
          });
          this.getVehiculos();

        },
        error: (err) => {
          console.error('Error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el vehiculo'
          });
        }
      });

    }
  }

  async editVehiculo(data: any) {

    const opcionesCliente = this.clientes
      .map((item: any) => {
        const selected = item.Id === data.Id_Cliente ? 'selected' : '';
        return `<option value="${item.Id}" ${selected}>${item.Name}</option>`;
      })
      .join('');

    const { value: formValues } = await Swal.fire({
      title: '✏️ Editar vehiculo',
      html: `
         <input id="swal-input-car-plate" class="swal2-input" placeholder="Matricula" value="${data.Car_Plate}">
         <input id="swal-input-maker" class="swal2-input" placeholder="Marca" value="${data.Maker}">
         <input id="swal-input-model" class="swal2-input" placeholder="Modelo" value="${data.Model}">
         <select id="swal-input-idcliente" class="swal2-input" style="width: 260px; margin-top: 15px">
            <option value="" disabled selected>Selecciona el cliente</option>
            ${opcionesCliente}
          </select>
       `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const car_plate = (document.getElementById('swal-input-car-plate') as HTMLInputElement).value.trim();
        const maker = (document.getElementById('swal-input-maker') as HTMLInputElement).value.trim();
        const model = (document.getElementById('swal-input-model') as HTMLInputElement).value.trim();
        const idcliente = (document.getElementById('swal-input-idcliente') as HTMLInputElement).value.trim();

        if (!car_plate || !maker || !model) {
          Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
          return null;
        }

        return { Id: data.Id, Car_Plate: car_plate, Model: model, Maker: maker, Id_Taller: localStorage.getItem("Id_Taller"), Id_Cliente: idcliente };
      }
    });

    if (formValues) {

      this.api.put("vehiculos", formValues).subscribe({
        next: (response) => {
          console.log('Response:', response);
          Swal.fire({
            icon: 'success',
            title: 'Vehiculo actualizado',
            text: 'Los cambios se guardaron correctamente'
          });
          this.getVehiculos();
        },
        error: (err) => {
          console.error('Error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar los datos del vehiculo'
          });
        }
      });

    }
  }

}