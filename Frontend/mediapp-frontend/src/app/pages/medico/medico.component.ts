import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MedicoService } from './../../service/medico.service';
import { Medico } from './../../model/medico';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MedicoDialogoComponent } from './medico-dialogo/medico-dialogo.component';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  displayedColumns = ['idMedico', 'nombres', 'apellidos', 'cmp', 'acciones'];

  dataSource: MatTableDataSource<Medico>;

  @ViewChild(MatPaginator) paginador: MatPaginator;
  @ViewChild(MatSort) ordenador: MatSort;


  constructor(
    private medicoService: MedicoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.medicoService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.ordenador;
      this.dataSource.paginator = this.paginador;
    });

    this.medicoService.getMedicoCambioSubject().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.ordenador;
      this.dataSource.paginator = this.paginador;
    })

    this.medicoService.getMensajeCambioSubject().subscribe(data => {
      this.snackBar.open(data, 'Aviso', { duration: 1500 });
    })
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }


  abrirDialogo(medico?: Medico) {   //? Para indicar que es un parámetro opcional
    let med = medico != null ? medico : new Medico(); //De alguna forma se valida si el parámetro viene o no viene
    this.dialog.open(MedicoDialogoComponent, { width: '250px', data: med })
  }

  eliminar(medico: Medico) {
    this.medicoService.eliminar(medico.idMedico).pipe(switchMap(() => {
      return this.medicoService.listar();
    })).subscribe(data => {
      this.medicoService.setMedicoCambioSubject(data);
      this.medicoService.setMensajeCambioSubject('Se eliminó');
    })
  }

}
