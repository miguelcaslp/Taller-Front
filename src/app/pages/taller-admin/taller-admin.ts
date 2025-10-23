import {ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
import { NavbarAdmin } from '../../navbar/navbar-admin/navbar-admin';
import { ApiService } from '../../services/api-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';




export interface DialogData {
  taller: string;
}



@Component({
  selector: 'app-taller-admin',
  imports: [NavbarAdmin, CommonModule, CommonModule,],
  templateUrl: './taller-admin.html',
  styleUrl: './taller-admin.css'
})
export class TallerAdmin {
  constructor(private api:ApiService,){}
  ngOnInit(): void {
    this.getTaller();
  }

  talleres: { Name: string, Id:string }[] = [];

  getTaller(){
    this.api.get("taller").subscribe({
      next: (response) => {

        this.talleres = response.talleres.map((item: any) => ({ Name: item.Name , Id: item.Id}));
        
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  postTaller(value: string){
    const data= {"Name": value}
    this.api.post("taller",data).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.getTaller();
        
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  delelteTaller(id: string){
    this.api.delete("taller/"+id).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.getTaller();
        
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

confirmarAccion(id: string) {
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
        Swal.fire('¡Confirmado!', 'La acción se realizó.', 'success');
        this.delelteTaller(id);
      } else {
        // Acción cancelada
        Swal.fire('Cancelado', 'No se hizo ningún cambio.', 'info');
      }
    });
  }

   async addTaller() {
    const { value: nombre } = await Swal.fire({
      title: 'Ingresa el nombre del taller',
      input: 'text',
      inputPlaceholder: 'Escribe el nombre aqui',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return '¡El nombre es obligatorio!';
        }
        return null;
      }
    });

    if (nombre) {
      // Aquí puedes usar el valor ingresado
      Swal.fire(`¡Hola, ${nombre}!`);
      this.postTaller(nombre)
    }
  }

}

