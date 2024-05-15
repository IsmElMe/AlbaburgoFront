import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const reservaGuard: CanActivateFn = (route, state) => {
  const fechaReserva = sessionStorage.getItem('fechaReserva');
  
  if (!fechaReserva) {
    inject(Router).navigate(['/reservas']);

    return false;
  }

  return true;
};
