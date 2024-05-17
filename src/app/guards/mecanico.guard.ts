import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const mecanicoGuard: CanActivateFn = (route, state) => {
  const rol = localStorage.getItem('rol');

  if (!rol || rol !== 'mecanico') {
    inject(Router).navigate(['']);

    return false;
  }

  return true;
};
