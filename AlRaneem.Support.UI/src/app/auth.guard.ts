import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const reouter = inject(Router);
  const localData = localStorage.getItem('accessToken');
  if (localData != null)
    return true;
  else {
    reouter.navigateByUrl('/user/login');
    return false;
  }
};
