import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-mecanico',
  imports: [RouterModule],
  templateUrl: './navbar-mecanico.html',
  styleUrl: './navbar-mecanico.css'
})
export class NavbarMecanico {
constructor(private router: Router) {}
   userName: string | null  = localStorage.getItem("name");
  logout(){
     localStorage.clear();
     this.router.navigate(['/login']);
  }
}