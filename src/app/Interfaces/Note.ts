export interface Note {
  _id: string;
  clase: string;
  titulo: string;
  ciudad: string;
  cuerpo: string;
  temperatura: string;
  fechaFormateada: string;
}

export class EmptyNote implements Note {
  _id: string = '';
  clase: string = '';
  titulo: string = '';
  ciudad: string = '';
  cuerpo: string = '';
  temperatura: string = '';
  fechaFormateada: string = '';

  constructor() {  }
}
