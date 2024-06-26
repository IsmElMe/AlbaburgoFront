export interface Usuario {
    id?: number,
    nif: string,
    id_rol: number,
    email: string,
    nombre: string,
    apellidos: string,
    password?: string,
    fecha_nacimiento: string,
    telefono: string,
    imagen?: string,
    tiene_servicio?: number,
    tiene_nota?: number
}

export interface Credenciales {
    email: string,
    password: string
}
