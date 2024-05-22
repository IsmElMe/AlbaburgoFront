import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario';

export const notaGuard: CanActivateFn = (route, state) => {
  const usuario = JSON.parse(localStorage.getItem('usuario') ?? '') as Usuario;

  if (!usuario || usuario.tiene_servicio === 0 || usuario.tiene_nota === 1) {
    inject(Router).navigate(['']);

    return false;
  }

  return true;
};
