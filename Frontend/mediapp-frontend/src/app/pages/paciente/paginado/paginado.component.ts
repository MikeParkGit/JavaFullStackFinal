import { MatSnackBar } from '@angular/material/snack-bar';
import { PacienteService } from './../../../service/paciente.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Paciente } from './../../../model/paciente';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-paginado',
  templateUrl: './paginado.component.html',
  styleUrls: ['./paginado.component.css']
})
export class PaginadoComponent implements OnInit {
  //pacientes:Paciente[];
  dataSource: MatTableDataSource<Paciente>;
  displayedColumns: string[] = ['idPaciente', 'nombres', 'apellidos'];
  @ViewChild(MatSort) ordena: MatSort;      //Equivalente a document.getElementById de javascript
  @ViewChild(MatPaginator) paginador: MatPaginator;

  cantidad:number = 0;
  constructor(private service:PacienteService, private snackBar:MatSnackBar) { }  //Inyeccion de dependencias

  ngOnInit(): void {

     this.service.listarPaginado(0,10).subscribe(datos => {  //0, 10 son datos iniciales solamente
      this.cantidad = datos.totalElements;
      this.dataSource = new MatTableDataSource(datos.content);
      this.dataSource.sort = this.ordena;
      //this.dataSource.paginator = this.paginador;
    })
    
    this.service.pacienteCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.ordena;
      this.dataSource.paginator = this.paginador;
    })

    this.service.mensajeCambio.subscribe (data => {
      this.snackBar.open(data, 'Aviso', {duration:2000});
  })
  }


  public filtrar(valor:string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }
  
  public eliminar(idPaciente: number) {
    this.service.eliminar(idPaciente).subscribe(() => 
      this.service.listar().subscribe(data => {
        this.service.pacienteCambio.next(data);
        this.service.mensajeCambio.next("Se eliminó");
      })
    );
   }

   public mostrarMas(e:any) {
     this.service.listarPaginado(e.pageIndex, e.pageSize).subscribe(data => {
        this.cantidad = data.totalElements;
        this.dataSource = new MatTableDataSource(data.content);
        this.dataSource.sort = this.ordena;
     })

   }

}
