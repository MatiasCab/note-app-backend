import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NoteServiceService } from 'src/app/Services/note-service.service';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.scss']
})
export class ModalDeleteComponent implements OnInit {

  @Input() noteId?: string;
  constructor(public modalActivo: NgbActiveModal, private noteService: NoteServiceService) { }

  ngOnInit(): void {
  }

  delete() {
    this.noteService.eliminarNota(this.noteId!)
    .subscribe(() => {
      this.modalActivo.close();
      this.noteService.refresh.emit();
    });
  }

  cancel() {
    this.modalActivo.close();
  }

}
