import { ConsultaListaExamenDTO } from 'src/app/dto/consultaListaExamenDTO';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsultaService } from './../../../service/consulta.service';
import { Consulta } from './../../../model/consulta';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-buscar-dialog',
  templateUrl: './buscar-dialog.component.html',
  styleUrls: ['./buscar-dialog.component.css']
})
export class BuscarDialogComponent implements OnInit {

  consulta:Consulta;
  examenes:ConsultaListaExamenDTO[];
  constructor(
    private consultaService: ConsultaService, 
    private dialogRef: MatDialogRef<BuscarDialogComponent>,
    @Inject (MAT_DIALOG_DATA) private data: Consulta
  ) { 

    }

  ngOnInit(): void {
    this.consulta = this.data; 
    this.listarExamenes();
  }

  public cancelar () {
    this.dialogRef.close();
  }

  public listarExamenes () {
    this.consultaService.listarExamenPorConsulta(this.consulta.idConsulta).subscribe(data => {
      this.examenes = data;
    })
  }
}
