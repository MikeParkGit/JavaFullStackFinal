import { Especialidad } from './../../../model/Especialidad';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';

import { EspecialidadService } from 'src/app/service/especialidad.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-especialidad-edicion',
  templateUrl: './especialidad-edicion.component.html',
  styleUrls: ['./especialidad-edicion.component.css']
})

export class EspecialidadEdicionComponent implements OnInit {

  id: number;
  especialidad: Especialidad;
  form: FormGroup;
  edicion: boolean = false;

  constructor(
    private especialidadService: EspecialidadService,
    private route: ActivatedRoute,     
    private router: Router) { }

    ngOnInit() {

      this.especialidad = new Especialidad();
  
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
        this.especialidadService.listarPorId(this.id).subscribe(data => {
          this.form = new FormGroup({
            'id': new FormControl(data.idEspecialidad),
            'nombre': new FormControl(data.nombre),
            'descripcion': new FormControl(data.descripcion)
          });
        });
      }
    }

    
    ejecutar() {
      this.especialidad = new Especialidad();
      this.especialidad.idEspecialidad = this.form.value['id'];
      this.especialidad.nombre = this.form.value['nombre'];
      this.especialidad.descripcion = this.form.value['descripcion']
  
      if (this.especialidad != null && this.especialidad.idEspecialidad > 0) {
        this.especialidadService.modificar(this.especialidad).pipe(switchMap(() => {
          return this.especialidadService.listar();
        })).subscribe(data => {
          this.especialidadService.especialidadCambio.next(data);
          this.especialidadService.mensajeCambio.next("Se modificó");
        });
  
      } else {
        this.especialidadService.registrar(this.especialidad).pipe(switchMap (() => {
          return this.especialidadService.listar();
        })).subscribe( data => {
          this.especialidadService.especialidadCambio.next(data);
          this.especialidadService.mensajeCambio.next("Se agregó");
        })

      }
  
      this.router.navigate(['especialidad']);
    }

}










