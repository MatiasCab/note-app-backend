import { Injectable } from '@angular/core';
import { Note } from '../Interfaces/Note';
import { CITYS } from '../Mocks/mock-ciudades';
import { TemperaturaService } from './temperatura.service';

@Injectable({
  providedIn: 'root'
})
export class NoteServiceService {

  notas?: Map<string, Note>;
  invisibleNotes?: Map<string, Note>;


  constructor(private servicioTemperatura: TemperaturaService) {
    this.notas = new Map<string, Note>();
    this.invisibleNotes = new Map<string, Note>();
  }

  obtenerNota(id: string): Note | undefined {
    if (this.notas) {
      return this.notas.get(id);
    }
    return undefined;
  }

  eliminarNota(id: string | undefined) {
    if (this.notas && id) {
      this.notas.delete(id);
    }
  }

  formatearFecha(fecha: Date){
    const minutos = fecha.getMinutes() < 10 ? `0${fecha.getMinutes()}` : fecha.getMinutes();
    const tiempo = `${ fecha.getHours() }:${ minutos }`;
    return`${new Intl.DateTimeFormat('es-ES').format(fecha)} ${tiempo}`;
  }

  crearNota(nota: Note) {
    if (this.notas) {
      nota.id = `${Math.floor(Math.random() * 1000000)}`;
      nota.clase = nota.clase == "" ? "bg-light" : nota.clase;
      this.notas.set(nota.id, nota);
      let fecha = nota.fechaFormateada == "" ? new Date(Date.now()) : new Date(nota.fechaFormateada);
      nota.fechaFormateada = this.formatearFecha(fecha);
      let ciudad = {
        nombre: nota.ciudad,
        lat: CITYS[nota.ciudad].lat,
        long: CITYS[nota.ciudad].long
      }
      try {
        this.servicioTemperatura.getWeather(fecha, ciudad)
        .subscribe(x => {
          let hour = fecha.getHours();
          let temperature = x.hourly.temperature_2m[hour];
          nota.temperatura = temperature ? `${temperature} °C` : "";
        });
    } catch (x){
      console.log("ERROR AL OBTENER LA FECHA");
    }
  }
  }

  fillNotes(colors : string[]){
    let noteAux = new Map<string, Note>();
    for(let nota of this.invisibleNotes!){
      if(!colors.includes(nota[1].clase)){
        this.notas?.set(nota[0],nota[1]);
        noteAux.set(nota[0],nota[1]);
      }
    }
    for(let noteKey of noteAux.keys()){
      this.invisibleNotes?.delete(noteKey);
    }
    noteAux = new Map<string, Note>();
    for(let nota of this.notas!) {
      if(colors.includes(nota[1].clase)){
        this.invisibleNotes?.set(nota[0],nota[1]);
        noteAux.set(nota[0],nota[1]);
      }
    }
    for(let noteKey of noteAux.keys()){
      this.notas?.delete(noteKey);
    }
  }

  editarNota(nota: Note) {
    if (this.notas) {
      nota.fechaFormateada = this.formatearFecha(new Date(nota.fechaFormateada));
      this.notas.set(nota.id, nota);
    }
  }
}
