import { Servicio } from "./servicio";

export interface Reparacion {
  id?: number,
  id_cliente: number,
  nif_mecanico: string,
  descripcion?: string,
  fecha_inicio: string,
  fecha_fin?: string,
  estado: estadoReparacion,
  servicios?: Servicio[]
}

export type estadoReparacion = 'pendiente' | 'finalizado' | 'cancelado';
