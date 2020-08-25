import { Especialidad } from './../model/Especialidad';
import { Subject } from 'rxjs';

import { HttpClient } from '@angular/common/http';

import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService extends GenericService<Especialidad> {

  especialidadCambio = new Subject <Especialidad[]>();
  mensajeCambio = new Subject<string>();

  constructor(protected http:HttpClient) {
    super(http, environment.HOST + '/especialidades');
   }

}
