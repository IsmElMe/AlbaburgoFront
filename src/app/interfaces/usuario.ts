export interface Usuario {
    'nif': string,
    'id_rol': number,
    'email': string,
    'nombre': string,
    'apellidos': string,
    'password': string,
    'fecha_nacimiento': string,
    'telefono': string
}

export interface Credenciales {
    'email': string,
    'password': string
}
