import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const rol = localStorage.getItem('rol');

  if (!rol || rol !== 'administrador') {
    inject(Router).navigate(['']);

    return false;
  }

  return true;
};
