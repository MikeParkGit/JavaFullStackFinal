import { Component, OnInit, ViewChild } from '@angular/core';
import { PacienteService } from 'src/app/service/paciente.service';
import { Paciente } from 'src/app/model/paciente';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  dataSource: MatTableDataSource<Paciente>;
  displayedColumns: string[] = ['idPaciente', 'nombres', 'apellidos', 'acciones'];
  @ViewChild(MatSort) ordena: MatSort;      //Equivalente a document.getElementById de javascript
  @ViewChild(MatPaginator) paginador: MatPaginator;

  constructor(private service: PacienteService, private snackBar: MatSnackBar) { }  //Inyeccion de dependencias

  ngOnInit(): void {
    //this.service.listar().subscribe(data => console.log(data));
    //this.service.listar().subscribe(data => this.pacientes = data)

    this.service.listar().subscribe(datos => {
      this.dataSource = new MatTableDataSource(datos);
      this.dataSource.sort = this.ordena;
      this.dataSource.paginator = this.paginador;
    })

    this.service.pacienteCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.ordena;
      this.dataSource.paginator = this.paginador;
    })

    this.service.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'Aviso', { duration: 2000 });
    })
  }


  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idPaciente: number) {
    this.service.eliminar(idPaciente).subscribe(() =>
      this.service.listar().subscribe(data => {
        this.service.pacienteCambio.next(data);
        this.service.mensajeCambio.next("Se eliminó");
      })
    );
  }
}
