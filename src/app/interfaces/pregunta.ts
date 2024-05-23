export interface Pregunta {
  id?: number,
  pregunta: string,
  tipo: 'estrella' | 'texto' | 'radio',
  pivot?: {
    id_nota?: number,
    id_pregunta?: number,
    valor: string
  }
}
