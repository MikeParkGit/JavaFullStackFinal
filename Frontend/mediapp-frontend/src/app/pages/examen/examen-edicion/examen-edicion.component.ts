import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ExamenService } from './../../../service/examen.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Examen } from 'src/app/model/examen';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-examen-edicion',
  templateUrl: './examen-edicion.component.html',
  styleUrls: ['./examen-edicion.component.css']
})
export class ExamenEdicionComponent implements OnInit {
  id: number;
  examen: Examen;
  form: FormGroup;
  edicion: boolean = false;

  constructor(
    private examenService: ExamenService,
    private route: ActivatedRoute,     
    private router: Router) { }

    ngOnInit() {

      this.examen = new Examen();
  
      this.form = new FormGroup({
        'id': new FormControl(0),
        'nombre': new FormControl(''),
        'descripcion' : new FormControl('')
      });
  
      this.route.params.subscribe((params: Params) => {
        this.id = params['id'];
        this.edicion = params['id'] != null;
        this.initForm();
      });
    }

    initForm() {
      if (this.edicion) {
        this.examenService.listarPorId(this.id).subscribe(data => {
          this.form = new FormGroup({
            'id': new FormControl(data.idExamen),
            'nombre': new FormControl(data.nombre),
            'descripcion': new FormControl(data.descripcion)
          });
        });
      }
    }

    
    ejecutar() {
      this.examen = new Examen();
      this.examen.idExamen = this.form.value['id'];
      this.examen.nombre = this.form.value['nombre'];
      this.examen.descripcion = this.form.value['descripcion']
  
      if (this.examen != null && this.examen.idExamen > 0) {
        this.examenService.modificar(this.examen).pipe(switchMap(() => {
          return this.examenService.listar();
        })).subscribe(data => {
          this.examenService.examenCambio.next(data);
          this.examenService.mensajeCambio.next("Se modificó");
        });
  
      } else {
        this.examenService.registrar(this.examen).pipe(switchMap (() => {
          return this.examenService.listar();
        })).subscribe( data => {
          this.examenService.examenCambio.next(data);
          this.examenService.mensajeCambio.next("Se agregó");
        })

        let obs1:any = this.examenService.registrar(this.examen);
        let obs2:Observable<Examen[]> = this.examenService.listar();

      }
  
      this.router.navigate(['Examen']);
    }

}
