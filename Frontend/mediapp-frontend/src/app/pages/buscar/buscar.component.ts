import { BuscarDialogComponent } from './buscar-dialog/buscar-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Consulta } from './../../model/consulta';
import { MatTableDataSource } from '@angular/material/table';
import { FiltroConsultaDTO } from './../../dto/FiltroConsultaDTO';
import { ConsultaService } from './../../service/consulta.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  formita: FormGroup;
  maxFecha:Date = new Date();

  displayedColumns = ['paciente', 'medico', 'especialidad', 'fecha', 'acciones'];
  dataSource: MatTableDataSource<Consulta>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private consultaService: ConsultaService,
    private dialogo: MatDialog
  ) { }

  ngOnInit(): void {
    this.formita = new FormGroup({
      'dni': new FormControl(''),
      'nombreCompleto': new FormControl(''),
      'fechaConsulta': new FormControl('')
    })
  }
  
  public buscar () {

    let fechaStr:string = this.formita.value['fechaConsulta'];
    let filtro = new FiltroConsultaDTO(this.formita.value['dni'], 
                                      this.formita.value['nombreCompleto'], 
                                      fechaStr.length > 0 ?
                                      moment(this.formita.value['fechaConsulta']).format('YYYY-MM-DDTHH:mm:ss') : '');
    console.log(filtro.toString());

    if (filtro.fechaConsulta) {
      delete filtro.dni;
      delete filtro.nombreCompleto;
    } else {
      delete filtro.fechaConsulta;
      if (filtro.dni.length === 0){
        delete filtro.dni;
      }
      if (filtro.nombreCompleto.length === 0) {
        delete filtro.nombreCompleto;
      }
    }


    this.consultaService.buscar(filtro).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  verDetalle(consulta:Consulta){
    this.dialogo.open(BuscarDialogComponent, {data: consulta});
  }
}
