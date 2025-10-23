import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-navbar-admin',
  imports: [RouterModule],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.css'
})
export class NavbarAdmin {
 constructor(private router: Router) {}
   userName: string | null  = localStorage.getItem("name");
  logout(){
     localStorage.clear();
     this.router.navigate(['/login']);
  }
}
