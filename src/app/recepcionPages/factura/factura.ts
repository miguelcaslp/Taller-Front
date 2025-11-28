import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ApiService } from '../../services/api-service';
import { NavbarRecepcion } from '../../navbar/navbar-recepcion/navbar-recepcion';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarMecanico } from '../../navbar/navbar-mecanico/navbar-mecanico';
import Swal from 'sweetalert2';
import { couldStartTrivia } from 'typescript';
import { AuthService } from '../../auth/auth-service';
import { lastValueFrom } from 'rxjs';
import jsPDF from 'jspdf';



@Component({
  selector: 'app-factura',
  imports: [NgxDatatableModule, NavbarRecepcion, CommonModule],
  templateUrl: './factura.html',
  styleUrl: './factura.css'
})
export class Factura implements OnInit {

  orderId!: string;


  // Propiedades para enlazar con el HTML
  reparacion: any = {};
  cliente: any = {};
  vehiculo: string = '';
  piezas: any[] = [];
  totalHours: any = {};

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    console.log('ID de la orden:', this.orderId);
    this.getFactura();
  }

  getFactura() {
    this.api.get("factura/" + this.orderId).subscribe({
      next: (data: any) => {
        console.log('Datos de la factura:', data);
        // Asignar los datos a las propiedades del componente
        this.reparacion = {
          Repair_Request: data.Repair_Request,
          Date: data.Date
        };
        this.vehiculo = data.Vehiculo;
        this.cliente = data.Cliente || {};
        this.piezas = data.Piezas || [];
        this.totalHours= data.Total_Hours;

      },
      error: (err) => {
        console.error('Error al obtener la factura:', err);
      }
    });
  }

  get totalPiezas(): number {
    const price1=this.piezas.reduce((sum, p) => sum + p.Price, 0);
    const price2 = this.totalHours*22
    return price1+price2
  }


  async addPieza() {

    const { value: formValues } = await Swal.fire({
      title: 'Añadir Pieza',
      html: `
               <input id="swal-input-name" class="swal2-input" placeholder="Nombre de pieza" ">
               <input id="swal-input-price" class="swal2-input" placeholder="Precio de pieza" type="number" step="0.01" min="0"">

              
              `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value.trim();
        const price = (document.getElementById('swal-input-price') as HTMLInputElement).value.trim();

        if (!name || !price) {
          Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
          return null;
        }

        return { Id_Reparacion: this.orderId, Name: name, Price: price };
      }
    });

    if (formValues) {
      this.api.post(`pieza`, formValues).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Pieza creada',
            text: 'Los cambios se guardaron correctamente'
          });
          this.getFactura();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear la reparacion'
          });
        }
      });
    }
  }


deletePieza(id: string) {
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
         this.api.delete(`pieza/`+ id).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Pieza borrada',
            text: 'Los cambios se guardaron correctamente'
          });
          this.getFactura();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo borrar la pieza'
          });
        }
      });
      } else {
        // Acción cancelada
        Swal.fire('Cancelado', 'No se hizo ningún cambio.', 'info');
      }
    });
  }

  async editPieza(data:any) {

    const { value: formValues } = await Swal.fire({
      title: 'Añadir Pieza',
      html: `
               <input id="swal-input-name" class="swal2-input" value="${data.Name}" placeholder="Nombre de pieza" ">
               <input id="swal-input-price" class="swal2-input" value="${data.Price}" placeholder="Precio de pieza" type="number" step="0.01" min="0"">

              
              `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value.trim();
        const price = (document.getElementById('swal-input-price') as HTMLInputElement).value.trim();

        if (!name || !price) {
          Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
          return null;
        }

        return {Id: data.Id, Id_Reparacion: this.orderId, Name: name, Price: price };
      }
    });

    if (formValues) {
      this.api.put(`pieza`, formValues).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Pieza actualizada',
            text: 'Los cambios se guardaron correctamente'
          });
          this.getFactura();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la Pieza'
          });
        }
      });
    }
  }

generatePDF() {
  const doc = new jsPDF();

  // Título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text('Factura de Reparación', 14, 22);

  // Datos del cliente
  doc.setFontSize(16);
  doc.text('Datos de cliente', 14, 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text('Nombre: ' + this.cliente.Name, 14, 40);
  doc.text('DNI: ' + this.cliente.DNI, 14, 48);
  doc.text('Matrícula del vehículo: ' + this.vehiculo, 14, 56);

 
  let y = 68; 

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text('Piezas utilizadas', 14, y);

  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  
  this.piezas.forEach((pieza: any) => {
    const linea = `${pieza.Name} - $${pieza.Price}`;
    doc.text(linea, 14, y);

    y += 8;

    
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  // Nueva sección después de la lista
doc.setFont("helvetica", "bold");
doc.text("Horas totales", 14, y + 10);

doc.setFont("helvetica", "normal");
doc.text(String(this.totalHours) + "H x 22€", 14, y + 18);

doc.setFont("helvetica", "bold");
doc.text("Cantidad total", 14, y + 26);

doc.setFont("helvetica", "normal");
doc.text(String(this.totalPiezas) + "€", 14, y + 34);

  doc.save('factura.pdf');
}


}
