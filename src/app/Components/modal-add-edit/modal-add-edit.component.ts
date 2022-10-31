import { Component, OnInit, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Note, EmptyNote } from 'src/app/Interfaces/Note';
import { COLOURS } from 'src/app/Mocks/mock-colores';
import { Color } from 'src/app/Interfaces/Color';
import { City } from './../../Interfaces/city';
import { PlacesService } from './../../Services/places.service';

import { NoteServiceService } from 'src/app/Services/note-service.service';

@Component({
  selector: 'app-modal-add-edit',
  templateUrl: './modal-add-edit.component.html',
  styleUrls: ['./modal-add-edit.component.scss']
})
export class ModalAddEditComponent implements OnInit {

  @Input() notaEntrada?: Note;

  nota: EmptyNote = new EmptyNote();
  titulo: string = 'Agregar Nota';
  textoBoton: string = 'Agregar';

  // Datos mockeados
  ciudades: City[] = [];

  colores: Color[] = COLOURS;

  constructor(public modalActivo: NgbActiveModal,
              private servicioNotas: NoteServiceService,
              private placesService: PlacesService) { }

  ngOnInit(): void {
    if (this.notaEntrada) {
      this.titulo = 'Editar Nota';
      this.textoBoton = 'Editar';
      this.nota = { ...this.notaEntrada };
      this.nota.fechaFormateada = this.formatearFecha(this.notaEntrada.fechaFormateada);
    }
    this.placesService.getPlaces().subscribe(places => {
      this.ciudades = places;
    });
  }

  formatearFecha(input: string): string {
    const fechaAPoner = input.split(" ");
    let dias = fechaAPoner[0].split("/");
    dias[1] = dias[1].length < 2? `0${dias[1]}` : dias[1];
    dias[0] = dias[0].length < 2? `0${dias[0]}` : dias[0];
    return `${dias[2]}-${dias[1]}-${dias[0]}T${fechaAPoner[1]}`;
  }

  guardarNota() {
    if (!this.nota._id) {
      if(!this.nota.ciudad) {
        alert("Seleccione una ciudad")
        return;
      }
      this.servicioNotas.crearNota(this.nota);
    } else {
      this.servicioNotas.editarNota(this.nota).subscribe();
    }
    this.modalActivo.close();
  }

}
