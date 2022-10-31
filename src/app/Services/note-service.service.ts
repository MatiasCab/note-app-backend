
import { EventEmitter, Injectable } from '@angular/core';
import { Note } from '../Interfaces/Note';
import { CITYS } from '../Mocks/mock-ciudades';
import { TemperaturaService } from './temperatura.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlacesService } from './places.service';
import { environment } from 'src/environments/environment';

const NODES_API_URL = `${environment.baseApiUrl}/v1/notes`;

@Injectable({
  providedIn: 'root'
})

export class NoteServiceService {

  refresh = new EventEmitter<void>();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*'
    })
  };

  notas?: Map<string, Note>;
  invisibleNotes?: Map<string, Note>;


  constructor(private servicioTemperatura: TemperaturaService, private http:HttpClient, private placesServices: PlacesService) {
    this.notas = new Map<string, Note>();
    this.invisibleNotes = new Map<string, Note>();
  }

  refreshTemperature(notes: Note[]){
    notes.forEach((note) => this.noteUpdate(note))
  }

  noteUpdate(note: Note){
    console.log(note.fechaFormateada);
    this.placesServices.getPlace(note.ciudad).subscribe(city =>
        this.servicioTemperatura.getWeather(this.reFormatDate(note.fechaFormateada), city).subscribe( temperature => {
          let hour = note.fechaFormateada.split(" ")[1].split(":")[0];
          let temperatureFormate = temperature.hourly.temperature_2m[hour];
          note.temperatura = temperatureFormate ? `${temperatureFormate} °C` : "";
        }
        )
    )
  }

  reFormatDate(date: string): string{
    const splitDate = date.split(" ");
    const year = splitDate[0].split("/");
    return `${year[2]}-${year[1]}-${year[0]}`
  }

  obtenerNotas(): Observable<Note[] | undefined> {
    return this.http.get<Note[]>(NODES_API_URL, this.httpOptions);
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
      return this.http.post<any>(NODES_API_URL, nota);
    }
    return;
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
