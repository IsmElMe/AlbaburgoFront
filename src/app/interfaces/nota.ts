import { Pregunta } from "./pregunta";
import { Usuario } from "./usuario";

export interface Nota {
  id?: number,
  id_usuario: number,
  comentario: string,
  usuario?: Usuario,
  preguntas?: Pregunta[],
  pivot?: {
    id_nota?: number,
    id_pregunta?: number,
    valor: string
  }
}
