export interface Vehiculo {
    id: number,
    vin: string,
    nif_propietario: string,
    matricula: string,
    fabricante: string,
    modelo: string,
    year: number,
    carroceria: Carroceria,
    motor: Motor,
    potencia: number,
    transmision: 'Manual' | 'Automática',
    kilometros: number
}

type Carroceria = 'Sedán' | 'SUV' | 'Coupé' | 'Pick-up' | 'Roadster' | 'Minivan' | 'Compacto' | 'Berlina' | 'Familiar' | 'Todoterreno';
type Motor = 'Gasolina' | 'Diesel' | 'Eléctrico' | 'Híbrido' | 'GLP';
