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
        console.log('✅ Login exitoso:', response);

        // puedes guardar token, redirigir, etc.
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.user.role);
        localStorage.setItem('name',  response.user.name)
        if(response.user.role=="admin"){
          this.router.navigate(['/taller-admin']);
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
      }
    });
  }

    
}