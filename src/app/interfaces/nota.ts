import { Pregunta } from "./pregunta";
import { Usuario } from "./usuario";

export interface Nota {
  id?: number,
  id_usuario: number,
  comentario: string,
  usuario?: Usuario,
  preguntas?: Pregunta[],
  created_at: string
}
