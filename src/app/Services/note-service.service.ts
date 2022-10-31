
import { Injectable } from '@angular/core';
import { Note } from '../Interfaces/Note';
import { CITYS } from '../Mocks/mock-ciudades';
import { TemperaturaService } from './temperatura.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const NODES_API_URL = 'http://localhost:3002/v1/notes';

@Injectable({
  providedIn: 'root'
})

export class NoteServiceService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  notas?: Map<string, Note>;
  invisibleNotes?: Map<string, Note>;


  constructor(private servicioTemperatura: TemperaturaService, private http:HttpClient) {
    this.notas = new Map<string, Note>();
    this.invisibleNotes = new Map<string, Note>();
  }

  obtenerNotas(): Observable<Note[] | undefined> {
    return this.http.get<Note[]>(NODES_API_URL);
  }

  obtenerNota(id: string): Observable<Note | undefined> {
    return this.http.get<Note>(NODES_API_URL + "/" + id);
  }
  eliminarNota(id: string) {
    return this.http.delete<any>(NODES_API_URL + `/${id}`);
  }

  formatearFecha(fecha: Date){
    const minutos = fecha.getMinutes() < 10 ? `0${fecha.getMinutes()}` : fecha.getMinutes();
    const tiempo = `${ fecha.getHours() }:${ minutos }`;
    return`${new Intl.DateTimeFormat('es-ES').format(fecha)} ${tiempo}`;
  }

  crearNota(nota: Note) {
    if (this.notas) {
      nota.clase = nota.clase == "" ? "bg-light" : nota.clase;
      let fecha = nota.fechaFormateada == "" ? new Date(Date.now()) : new Date(nota.fechaFormateada);
      nota.fechaFormateada = this.formatearFecha(fecha);
      let ciudad = {
        nombre: nota.ciudad,
        lat: CITYS[nota.ciudad].lat,
        long: CITYS[nota.ciudad].long
      }
      this.http.post<any>(NODES_API_URL, nota).subscribe(noteId => {
        this.notas?.set(noteId, nota);
      });
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
      nota.fechaFormateada = this.formatearFecha(new Date(nota.fechaFormateada));
      return this.http.put(NODES_API_URL+ '/' + nota._id, nota, this.httpOptions);
  }
}
