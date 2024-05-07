export interface Reserva {
    id?: number,
    id_cliente?: number,
    fecha: string,
    hora: string,
    estado: estadoReserva,
    imagen?: string
}

export type estadoReserva = 'pendiente' | 'aceptada' | 'rechazada';
