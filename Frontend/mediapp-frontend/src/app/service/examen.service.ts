import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Examen } from '../model/examen';

@Injectable({
  providedIn: 'root'
})
export class ExamenService extends GenericService<Examen> {

  
  examenCambio = new Subject <Examen[]>();
  mensajeCambio = new Subject<string>();

  constructor(protected http:HttpClient) {
    super(http,`${environment.HOST}/examenes`);
   }

   


}
