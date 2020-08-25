import { MedicoService } from './../../../service/medico.service';
import { Medico } from './../../../model/medico';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';   // Operador reactivo para programación reactiva

@Component({
  selector: 'app-medico-dialogo',
  templateUrl: './medico-dialogo.component.html',
  styleUrls: ['./medico-dialogo.component.css']
})
export class MedicoDialogoComponent implements OnInit {

  medico:Medico;

  constructor(
    @Inject(MAT_DIALOG_DATA) private inData:Medico,
    private dialogRef:MatDialogRef<MedicoDialogoComponent>,
    private medicoService: MedicoService
  ) { }

  ngOnInit(): void {
    this.medico = new Medico();
    this.medico.idMedico = this.inData.idMedico;
    this.medico.nombres = this.inData.nombres;
    this.medico.apellidos = this.inData.apellidos;
    this.medico.cmp = this.inData.cmp;
    this.medico.fotoUrl = this.inData.fotoUrl;
  }   


  ejecutar() {  // switchMap se utiliza para concatenar varias llamadas a subscribe formando una sola.  
    if (this.medico != null && this.medico.idMedico > 0) {    //Modificar
        this.medicoService.modificar(this.medico).pipe(switchMap( () => {
          return this.medicoService.listar();
        })).subscribe(data => {
          this.medicoService.setMedicoCambioSubject(data);
          this.medicoService.setMensajeCambioSubject('Se modificó');
        })

    } else {                                                  //Insertar
      this.medicoService.registrar(this.medico).pipe(switchMap( () => {
        return this.medicoService.listar();
      })).subscribe(data => {
        this.medicoService.setMedicoCambioSubject(data);
        this.medicoService.setMensajeCambioSubject('Se registró');
      })
    }
    this.cancelar();
  }

/*   ejecutar() {             //Forma de encadenar subscribes menos recomendada 
    if (this.medico != null && this.medico.idMedico > 0) {    //Modificar
        console.log("Entra a modificar:" + this.medico.nombres);
         this.medicoService.modificar(this.medico).subscribe(() => {
          this.medicoService.listar().subscribe(data => {
            this.medicoService.medicoCambio.next(data);
          });
        }); 
    } else {                                                  //Insertar
        this.medicoService.registrar(this.medico).subscribe(() => {
          this.medicoService.listar().subscribe(elems => {
            this.medicoService.medicoCambio.next(elems);
          });
        });
    }
    this.cancelar();
  } */

  cancelar() {
    this.dialogRef.close();
  }
}
