import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { NavbarAdmin } from '../../navbar/navbar-admin/navbar-admin';
import { ApiService } from '../../services/api-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';




export interface DialogData {
  taller: string;
}



@Component({
  selector: 'app-taller-admin',
  imports: [NavbarAdmin, CommonModule,],
  templateUrl: './taller-admin.html',
  styleUrl: './taller-admin.css'
})
export class TallerAdmin {
  constructor(private api: ApiService,) { }
  ngOnInit(): void {
    this.getTaller();
  }

  talleres: { Name: string, Id: string }[] = [];

  getTaller() {
    this.api.get("taller").subscribe({
      next: (response) => {

        this.talleres = response.talleres.map((item: any) => ({ Name: item.Name, Id: item.Id }));

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
         this.api.delete("taller/" + id).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Taller Borrado',
          });
          this.getTaller();
        },
        error: (err) => {
          console.error('Error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo borrar el taller'
          });
        }
      });
      } else {
        // Acción cancelada
        Swal.fire('Cancelado', 'No se hizo ningún cambio.', 'info');
      }
    });
  }

  async addTaller() {
    const { value: Nombre } = await Swal.fire({
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

    if (Nombre) {
      // Aquí puedes usar el valor ingresado
      console.log(Nombre)
      const body={
      Name: Nombre
      }
      this.api.post("taller", body).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Taller Creado',
          });
          this.getTaller();
        },
        error: (err) => {
          console.error('Error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el taller'
          });
        }
      });


    }
  }


  async editarTaller(data: any) {


    const { value: formValues } = await Swal.fire({
      title: 'Editar Taller',
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Nombre completo" value="${data.Name}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value.trim();

        if (!name) {
          Swal.showValidationMessage('⚠️ Todos los campos excepto la contraseña son obligatorios');
          return null;
        }

        return {
          Name: name,
        };
      }
    });

    if (formValues) {
      const body={
        Name: formValues.Name
      }
      this.api.put(`taller/` + data.Id, body).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Taller actualizada',
            text: 'Los cambios se guardaron correctamente'
          });
          this.getTaller();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el taller'
          });
        }
      });
    }
  }

}

