import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { PacienteSignosVitalesDTO } from './../../dto/PacienteSignosVitalesDTO';
import { MatTableDataSource } from '@angular/material/table';
import { SignosVitalesService } from './../../service/signos-vitales.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.css']
})
export class SignosVitalesComponent implements OnInit {

  dataSource: MatTableDataSource<PacienteSignosVitalesDTO>;
  displayedColumns: string[] = ['id_paciente', 'apellidos', 'nombres', 'fecha', 'temperatura', 'pulso', 'ritmo_respiratorio', 'acciones'];
  @ViewChild(MatSort) ordena: MatSort; 
  @ViewChild(MatPaginator) paginador: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private signosVitalesService:SignosVitalesService,
    public route:ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.signosVitalesService.listarPacientesSignos().subscribe( data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.ordena;
      this.dataSource.paginator = this.paginador;
    })

    this.signosVitalesService.getPacienteCambio().subscribe( data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.ordena;
      this.dataSource.paginator = this.paginador;
    })

    this.signosVitalesService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'Aviso', {duration:1500});
    });
  }

  public eliminar (pacienteSV: PacienteSignosVitalesDTO) {
    this.signosVitalesService.eliminar(pacienteSV.id_signo).pipe(switchMap( () => {
        return this.signosVitalesService.listarPacientesSignos();
    })).subscribe (data => {
      this.dataSource = new MatTableDataSource(data);
      this.signosVitalesService.setMensajeCambio("Se eliminó el registro");
      this.dataSource.sort = this.ordena;
      this.dataSource.paginator = this.paginador;
    });
  }

  public filtrar(valor:string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

}
