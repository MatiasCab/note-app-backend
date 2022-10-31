import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Note } from 'src/app/Interfaces/Note';
import { NoteServiceService } from 'src/app/Services/note-service.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  notas?: Note[] = [];

  @Output() newToggleEmitter = new EventEmitter<string>();

  constructor(private servicioNotas: NoteServiceService) {


    /*     if (this.servicioNotas.notas) {
          this.notas = this.servicioNotas.notas;
        } else {
          this.notas = new Map<string, Note>();
        } */
  }

  ngOnInit(): void {

    this.servicioNotas.obtenerNotas().subscribe(notas => {
      console.log("NOTAS", notas);
      if (notas) {
        this.notas = notas;
      }
    });
    console.log("notita", this.notas);
  }
  darkMode() {
    this.newToggleEmitter.emit("dark");
  }

}
