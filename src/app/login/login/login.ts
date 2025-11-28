import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  constructor( private router: Router, private apiService: ApiService){}

  enviar() {
    const data={
      email: this.email,
      password: this.password
    }
    this.apiService.login(data).subscribe({
      next: (response) => {

        // puedes guardar token, redirigir, etc.
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.user.role);
        localStorage.setItem('name',  response.user.name);
        localStorage.setItem('Id_Taller',  response.user.Id_Taller);

        if(response.user.role=="Admin"){
          this.router.navigate(['/taller-admin']);
        }else if(response.user.role=="Recepcionista"){
          this.router.navigate(['/reparaciones']);
        }else if(response.user.role=="Mecanico"){
          this.router.navigate(['/tareas-mecanico']);
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
      }
    });
  }

    
}