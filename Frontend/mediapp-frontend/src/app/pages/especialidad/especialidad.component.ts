import { Especialidad } from './../../model/Especialidad';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EspecialidadService } from 'src/app/service/especialidad.service';


@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css']
})
export class EspecialidadComponent implements OnInit {

  dataSource: MatTableDataSource<Especialidad>;
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'acciones'];
  @ViewChild(MatSort) ordena: MatSort;      //Equivalente a document.getElementById de javascript
  @ViewChild(MatPaginator) paginador: MatPaginator;


  constructor(
    private especialidadService: EspecialidadService,
    private snackBar:MatSnackBar,
    public route:ActivatedRoute         //Para conocer los hijos implicados. 
                                        //Las variables inyectadas se ponen como publicas si se desea utilizarlas en el html
  ) { }

  ngOnInit(): void {

    this.especialidadService.listar().subscribe(datos => {
      this.dataSource = new MatTableDataSource(datos);
      this.dataSource.sort = this.ordena;
      this.dataSource.paginator = this.paginador;
    })
    
    this.especialidadService.especialidadCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.ordena;
      this.dataSource.paginator = this.paginador;
    })

    this.especialidadService.mensajeCambio.subscribe (data => {
      this.snackBar.open(data, 'Aviso', {duration:2000});
    })

       // Uso de forkJoin

/* 
1. Con las salidas por separado de cada observable
   let obs1 = this.especialidadService.listar();
   let obs2 = this.especialidadService.listar();
   let obs3 = this.especialidadService.listar();

   forkJoin(obs1, obs2, obs3).subscribe(data => console.log()); 
   
2. Insertando en un arreglo cada observable

    let arreglo = [];
    let obs1 = this.especialidadService.listar();
    arreglo.push(obs1);
    let obs2 = this.especialidadService.listar();
    arreglo.push(obs2);
    let obs3 = this.especialidadService.listar();
    arreglo.push(obs3);

    forkJoin(arreglo).subscribe(data => console.log());

    */
  }
  
  filtrar(valor:string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }
  
  eliminar(idEspecialidad: number) {
    
    this.especialidadService.eliminar(idEspecialidad).pipe(switchMap( () => {
      return this.especialidadService.listar();
    })).subscribe( data => {
      this.especialidadService.especialidadCambio.next(data);
      this.especialidadService.mensajeCambio.next(`Se elimino especialidad: ${idEspecialidad}`);

    });
   }



}
