import { Paciente } from './../model/paciente';
import { Observable, Subject } from 'rxjs';
import { PacienteSignosVitalesDTO } from './../dto/PacienteSignosVitalesDTO';
import { Signo } from './../model/signo';
import { GenericService } from './generic.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignosVitalesService extends GenericService<Signo> {

  private mensajeCambio = new Subject<string>();
  private signoCambio = new Subject<PacienteSignosVitalesDTO[]>(); 
  private pacienteNuevo = new Subject<Paciente>();

  constructor(protected http:HttpClient) { 
    super(http, environment.HOST + '/signos');
  }

  public listarPacientesSignos():Observable<PacienteSignosVitalesDTO[]> {
   return this.http.get<PacienteSignosVitalesDTO[]>(`${this.url}/pacientessignos`);
  }

  public getMensajeCambio ():Observable<string> {
    return this.mensajeCambio.asObservable();
  }

  public setMensajeCambio (mensaje:string): void {
    this.mensajeCambio.next(mensaje);
  }

  public getPacienteCambio () {
    return this.signoCambio.asObservable();
  }

  public setPacienteCambio(pacienteSignos: PacienteSignosVitalesDTO[]) {
    this.signoCambio.next(pacienteSignos);
  }

  public getPacienteNuevo(): Observable<Paciente> {
    return this.pacienteNuevo.asObservable();
  }

  public setPacienteNuevo(paciente: Paciente) {
    this.pacienteNuevo.next(paciente);
  }
}
