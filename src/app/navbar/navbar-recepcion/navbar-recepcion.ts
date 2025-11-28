import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-navbar-recepcion',
  imports: [RouterModule],
  templateUrl: './navbar-recepcion.html',
  styleUrl: './navbar-recepcion.css'
})
export class NavbarRecepcion {
constructor(private router: Router) {}
   userName: string | null  = localStorage.getItem("name");
  logout(){
     localStorage.clear();
     this.router.navigate(['/login']);
  }
}
