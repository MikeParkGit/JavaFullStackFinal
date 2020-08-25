import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Medico } from './../model/medico';
import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class MedicoService extends GenericService<Medico> {

  private medicoCambio = new Subject <Medico[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http:HttpClient) { 
    super(http, `${environment.HOST}/medicos`);
  }

  
  // getters y setters de los Subjects. Es otra forma de hacerlo para evitar tener publicos los objs Subject
  public getMedicoCambioSubject() {
    return this.medicoCambio.asObservable();
  }

  public getMensajeCambioSubject() {
    return this.mensajeCambio.asObservable();
  }

  public setMedicoCambioSubject(medico: Medico[]) {
    this.medicoCambio.next(medico);
  }
  
  public setMensajeCambioSubject(mensaje :string) {
    this.mensajeCambio.next(mensaje);
  }
  

/*   listar() {
      return this.http.get<Medico[]>(this.url);
  }

 public listarPorId(id:number) {
    //return this.http.get<Paciente>(this.url+ '/'+ id);
     return this.http.get<Medico>(`${this.url}/${id}`);
  }

  public registrar(medico:Medico) {
    return this.http.post(this.url, medico);
  }

  public modificar(medico:Medico) {
    return this.http.put(this.url, medico);
  }

  public eliminar(id:number) {
    return this.http.delete(this.url+'/'+id);
  } */

}
