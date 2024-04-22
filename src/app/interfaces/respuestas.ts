import { Usuario } from "./usuario";

export interface RespuestaAuth {
    token?: string,
    error?: string,
    usuario?: Usuario
}

export interface Respuesta<T> {
    error?: string,
    respuesta?: T
}
