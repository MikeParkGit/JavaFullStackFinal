import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamenService } from './../../service/examen.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Examen } from './../../model/examen';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit {
  dataSource: MatTableDataSource<Examen>;
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'acciones'];
  @ViewChild(MatSort) ordena: MatSort;      //Equivalente a document.getElementById de javascript
  @ViewChild(MatPaginator) paginador: MatPaginator;


  constructor(
    private examenService: ExamenService,
    private snackBar:MatSnackBar,
    public route:ActivatedRoute         //Para conocer los hijos implicados. 
                                        //Las variables inyectadas se ponen como publicas si se desea utilizarlas en el html
  ) { }

  ngOnInit(): void {

    this.examenService.listar().subscribe(datos => {
      this.dataSource = new MatTableDataSource(datos);
      this.dataSource.sort = this.ordena;
      this.dataSource.paginator = this.paginador;
    })
    
    this.examenService.examenCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.ordena;
      this.dataSource.paginator = this.paginador;
    })

    this.examenService.mensajeCambio.subscribe (data => {
      this.snackBar.open(data, 'Aviso', {duration:2000});
    })
  }
  
  filtrar(valor:string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }
  
  public eliminar(idExamen: number) {
    this.examenService.eliminar(idExamen).pipe(switchMap( () => {
      return this.examenService.listar();
    })).subscribe( data => {
      this.examenService.examenCambio.next(data);
      this.examenService.mensajeCambio.next(`Se eliminó examen: ${idExamen}`);
    });
   }

}
