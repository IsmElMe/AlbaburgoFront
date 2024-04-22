import { Usuario } from "./usuario";
import { Vehiculo } from "./vehiculo";

export interface RespuestaAuth {
    token?: string,
    error?: string,
    usuario?: Usuario
}

export interface RespuestaVehiculo {
    error?: string,
    vehiculo?: Vehiculo
}
