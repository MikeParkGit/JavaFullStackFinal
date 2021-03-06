import { GenericService } from './generic.service';
import { Paciente } from './../model/paciente';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService extends GenericService<Paciente> {  // Aqui se define la lógica de conexión con el backend

  pacienteCambio = new Subject<Paciente[]>();
  mensajeCambio = new Subject<string>();

  constructor(protected http:HttpClient) {
    super(http, environment.HOST + '/pacientes');
   }

   public listarPaginado (page: number, size:number) {
      return this.http.get<any>(`${this.url}/paginado?page=${page}&size=${size}&sort=idPaciente`);
   }

/*  Estos metodos se pasaron al GenericService

  listar() {
        return this.http.get<Paciente[]>(this.url);
    }

    listarPorId(id:number) {
      //return this.http.get<Paciente>(this.url+ '/'+ id);
       return this.http.get<Paciente>(`${this.url}/${id}`);
        
    }

    registrar(paciente:Paciente) {
      return this.http.post(this.url, paciente);
    }

    modificar(paciente:Paciente) {
      return this.http.put(this.url, paciente);
    }

    eliminar(id:number) {
      return this.http.delete(this.url+'/'+id);
    } */

  }
