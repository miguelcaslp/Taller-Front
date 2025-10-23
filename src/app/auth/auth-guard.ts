import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if(localStorage.getItem("token")==null){
    router.navigate(['/login']);
    return false;
  }else{
    return true
  }

};
