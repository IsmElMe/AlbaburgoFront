import { Usuario } from "./usuario";

export interface RespuestaAuth {
    token?: string,
    error?: string,
    usuario?: Usuario
}
