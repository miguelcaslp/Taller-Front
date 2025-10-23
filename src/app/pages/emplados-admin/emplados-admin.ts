import { Component } from '@angular/core';
import { NavbarAdmin } from '../../navbar/navbar-admin/navbar-admin';
import { ApiService } from '../../services/api-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'

interface Empleado {
  id: number;
  nombre: string;
  cargo: string;
  email: string;
}

@Component({
  selector: 'app-emplados-admin',
  imports: [NavbarAdmin, CommonModule],
  templateUrl: './emplados-admin.html',
  styleUrl: './emplados-admin.css'
})
export class EmpladosAdmin {
   constructor(private api:ApiService,){}
    ngOnInit(): void {
      this.getEmpleados();
      this.getTaller();
    }

  empleados: { Id:string ,Name:string, DNI: string, Email:string, Password: string, Id_Taller: string, Role: string }[] = [];
   talleres: { Name: string, Id:string }[] = [];

  getEmpleados(){
    this.api.get("empleados").subscribe({
      next: (response) => {
        this.empleados = response.empleados.map((item: any) => ({ Name: item.Name , Id: item.Id, DNI: item.DNI, Email: item.Email, Id_Taller: item.Id_Taller,Role: item.Role, Password: item.Password}));
  
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

   putEmpleado(data:any){

    this.api.put("empleados/"+data.Id, data).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.getEmpleados();
        
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

   deleteEmpleado(id: string){
    this.api.delete("empleados/"+id).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.getEmpleados();
        
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

   postEmpleado(Name:string, DNI: string, Email:string, Password: string, Id_Taller: string, Role: string){
    const data= {"Name": Name, "DNI": DNI, "Email": Email,"Password": Password, "Id_Taller": Id_Taller, "Role": Role}
    this.api.post("empleados",data).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.getEmpleados();
        
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

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


 async addEmpleado() {
  // 🔹 Llamamos a getTaller() para asegurarnos de tener los talleres actualizados
  

  // 🔹 Creamos las opciones del select dinámicamente
  const opcionesTaller = this.talleres
    .map((taller: any) => `<option value="${taller.Id}">${taller.Name}</option>`)
    .join('');

  const { value: formValues } = await Swal.fire({
    title: 'Registrar nuevo empleado',
    html: `
      <input id="swal-input-name" class="swal2-input" placeholder="Nombre completo">
      <input id="swal-input-dni" class="swal2-input" placeholder="DNI">
      <input id="swal-input-email" type="email" class="swal2-input" placeholder="Correo electrónico">
      <input id="swal-input-password" type="password" class="swal2-input" placeholder="Contraseña">
      <select id="swal-input-idtaller" class="swal2-input" style="width: 60%; margin-top: 15px">
        <option value="" disabled selected>Selecciona un taller</option>
        ${opcionesTaller}
      </select>
      <select id="swal-input-role" class="swal2-input" style="width:60%; margin-top: 15px">
        <option value="" disabled selected>Selecciona un rol</option>
        <option value="Mecanico">Mecánico</option>
        <option value="Recepcionista">Recepcionista</option>
      </select>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const name = (document.getElementById('swal-input-name') as HTMLInputElement).value.trim();
      const dni = (document.getElementById('swal-input-dni') as HTMLInputElement).value.trim();
      const email = (document.getElementById('swal-input-email') as HTMLInputElement).value.trim();
      const password = (document.getElementById('swal-input-password') as HTMLInputElement).value.trim();
      const idTaller = (document.getElementById('swal-input-idtaller') as HTMLSelectElement).value.trim();
      const role = (document.getElementById('swal-input-role') as HTMLInputElement).value.trim();

      if (!name || !dni || !email || !password || !idTaller || !role) {
        Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
        return null;
      }

      return { Name: name, DNI: dni, Email: email, Password: password, Id_Taller: idTaller, Role: role };
    }
  });

  if (formValues) {
    console.log('Empleado registrado:', formValues);
    this.postEmpleado(formValues.Name, formValues.DNI,formValues.Email, formValues.Password, formValues.Id_Taller, formValues.Role  )

    Swal.fire({
      icon: 'success',
      title: 'Empleado registrado',
      text: `Empleado: ${formValues.Name}`,
      confirmButtonText: 'Aceptar'
    });

  }
}

 async editarEmpleado(data: any) {
  // 🔹 Llamamos a getTaller() para asegurarnos de tener los talleres actualizados
  // (asumo que ya está hecho antes de llamar a esta función)

  // 🔹 Creamos las opciones del select dinámicamente y seleccionamos el taller actual
  const opcionesTaller = this.talleres
    .map((taller: any) => {
      const selected = taller.Id === data.Id_Taller ? 'selected' : '';
      return `<option value="${taller.Id}" ${selected}>${taller.Name}</option>`;
    })
    .join('');

  // 🔹 Selección de rol actual
  const roleOptions = ['Mecanico', 'Recepcionista']
    .map(role => {
      const selected = role === data.Role ? 'selected' : '';
      return `<option value="${role}" ${selected}>${role}</option>`;
    })
    .join('');

  const { value: formValues } = await Swal.fire({
    title: 'Editar empleado',
    html: `
      <input id="swal-input-name" class="swal2-input" placeholder="Nombre completo" value="${data.Name}">
      <input id="swal-input-dni" class="swal2-input" placeholder="DNI" value="${data.DNI}">
      <input id="swal-input-email" type="email" class="swal2-input" placeholder="Correo electrónico" value="${data.Email}">
      <input id="swal-input-password" type="password" class="swal2-input" placeholder="Contraseña (dejar vacío si no quieres cambiarla)">
      <select id="swal-input-idtaller" class="swal2-input" style="width: 60%; margin-top: 15px">
        <option value="" disabled>Selecciona un taller</option>
        ${opcionesTaller}
      </select>
      <select id="swal-input-role" class="swal2-input" style="width:60%; margin-top: 15px">
        <option value="" disabled>Selecciona un rol</option>
        ${roleOptions}
      </select>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const name = (document.getElementById('swal-input-name') as HTMLInputElement).value.trim();
      const dni = (document.getElementById('swal-input-dni') as HTMLInputElement).value.trim();
      const email = (document.getElementById('swal-input-email') as HTMLInputElement).value.trim();
      const password = (document.getElementById('swal-input-password') as HTMLInputElement).value.trim();
      const idTaller = (document.getElementById('swal-input-idtaller') as HTMLSelectElement).value.trim();
      const role = (document.getElementById('swal-input-role') as HTMLInputElement).value.trim();

      if (!name || !dni || !email || !idTaller || !role) {
        Swal.showValidationMessage('⚠️ Todos los campos excepto la contraseña son obligatorios');
        return null;
      }

      return { 
        Name: name, 
        DNI: dni, 
        Email: email, 
        Password: password || null, // Si no se pone contraseña, se envía null
        Id_Taller: idTaller, 
        Role: role 
      };
    }
  });

  if (formValues) {
    if(formValues.Password==null){
      formValues.Password=data.Password
    }
    formValues.Id= data.Id;
    console.log('Empleado actualizado:', formValues);
    this.putEmpleado(formValues); 

    Swal.fire({
      icon: 'success',
      title: 'Empleado actualizado',
      text: `Empleado: ${formValues.Name}`,
      confirmButtonText: 'Aceptar'
    });
  }
}





confirmarEliminar(id: string) {
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
        this.deleteEmpleado(id);
      } else {
        // Acción cancelada
        Swal.fire('Cancelado', 'No se hizo ningún cambio.', 'info');
      }
    });
  }



}