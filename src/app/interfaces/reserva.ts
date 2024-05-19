import { Servicio } from "./servicio";

export interface Reserva {
    id?: number,
    id_cliente?: number,
    fecha: string,
    hora: string,
    estado: estadoReserva,
    imagen?: string,
    parte_seguro?: string,
    frecuencia?: number,
    servicios?: Servicio[]
}

export type estadoReserva = 'pendiente' | 'aceptada' | 'rechazada';
