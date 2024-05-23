import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformarFecha',
  standalone: true
})
export class TransformarFechaPipe implements PipeTransform {

  transform(value: string): string {
    const fechaStr = value.split('T')[0];
    const fechaSeparada = fechaStr.split('-');
    
    return `${fechaSeparada[2]}-${fechaSeparada[1]}-${fechaSeparada[0]}`;
  }

}
