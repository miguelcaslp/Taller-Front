import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ApiService } from '../../services/api-service';
import { NavbarRecepcion } from '../../navbar/navbar-recepcion/navbar-recepcion';
import Swal from 'sweetalert2';
import { couldStartTrivia } from 'typescript';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes',
  imports: [NgxDatatableModule, NavbarRecepcion, CommonModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {

  rows: any[] = [];           // Todos los clientes
  filteredRows: any[] = [];   // Clientes filtrados
  loading = true;             // Para mostrar spinner
  filterValue = '';           // Texto de filtro

  constructor(private http: HttpClient, private api: ApiService) { }

  ngOnInit() {
    this.getClientes();
  }


  getClientes() {
    const id = localStorage.getItem("Id_Taller")

    this.api.get("clientes/" + id).subscribe({
      next: (data) => {
        console.log(data)
        this.rows = data.clientes;
        this.filteredRows = data.clientes;
        this.loading = false;

      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }


  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // Filtra por cualquiera de los campos
    this.filteredRows = this.rows.filter(d =>
      d.DNI?.toString().toLowerCase().includes(val) ||
      d.Name?.toLowerCase().includes(val) ||
      d.Email?.toLowerCase().includes(val) ||
      d.Phone?.toString().toLowerCase().includes(val)
    );

    this.filterValue = val;
  }

  async addCliente() {

    const { value: formValues } = await Swal.fire({
      title: 'Registrar nuevo cliente',
      html: `
         <input id="swal-input-name" class="swal2-input" placeholder="Nombre completo">
         <input id="swal-input-dni" class="swal2-input" placeholder="DNI">
         <input id="swal-input-email" type="email" class="swal2-input" placeholder="Correo electrónico">
         <input id="swal-input-phone" class="swal2-input" placeholder="Telefono">
       `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value.trim();
        const dni = (document.getElementById('swal-input-dni') as HTMLInputElement).value.trim();
        const email = (document.getElementById('swal-input-email') as HTMLInputElement).value.trim();
        const phone = (document.getElementById('swal-input-phone') as HTMLInputElement).value.trim();

        if (!name || !dni || !email || !phone) {
          Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
          return null;
        }

        return { Name: name, DNI: dni, Email: email, Phone: phone, Id_Taller: localStorage.getItem("Id_Taller") };
      }
    });

    if (formValues) {
      this.api.post("clientes", formValues).subscribe({
      next: (response) => {
         Swal.fire({
                icon: 'success',
                title: 'Cliente creado',
                text: `Se registró correctamente`,
              });
        this.getClientes();

      },
      error: (err) => {
        console.error('Error:', err);
         Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el cliente'
          });
      }
    });

    }
  }

  async aditCliente(data: any) {

    const { value: formValues } = await Swal.fire({
      title: '✏️ Editar cliente',
      html: `
         <input id="swal-input-name" class="swal2-input" placeholder="Nombre completo" value="${data.Name}">
         <input id="swal-input-dni" class="swal2-input" placeholder="DNI" value="${data.DNI}">
         <input id="swal-input-email" type="email" class="swal2-input" placeholder="Correo electrónico" value="${data.Email}">
         <input id="swal-input-phone" class="swal2-input" placeholder="Telefono" value="${data.Phone}">
       `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value.trim();
        const dni = (document.getElementById('swal-input-dni') as HTMLInputElement).value.trim();
        const email = (document.getElementById('swal-input-email') as HTMLInputElement).value.trim();
        const phone = (document.getElementById('swal-input-phone') as HTMLInputElement).value.trim();

        if (!name || !dni || !email || !phone) {
          Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
          return null;
        }

        return { Id: data.Id, Name: name, DNI: dni, Email: email, Phone: phone };
      }
    });

    if (formValues) {

      this.api.put("clientes", formValues).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Cliente actualizado',
            text: 'Los cambios se guardaron correctamente'
          });
          this.getClientes();

        },
        error: (err) => {
          console.error('Error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar los datos del cliente'
          });
        }
      });

    }
  }

}