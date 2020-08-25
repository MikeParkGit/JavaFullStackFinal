import { ConsultaListaExamenDTO } from './../dto/consultaListaExamenDTO';
import { Observable } from 'rxjs';
import { FiltroConsultaDTO } from './../dto/FiltroConsultaDTO';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Consulta } from '../model/consulta';
import { ConsultaResumenDTO } from '../dto/ConsultaResumenDTO'


@Injectable({
  providedIn: 'root'
})
export class ConsultaService extends GenericService<Consulta> {


  urlConsultaTransacional = new String();
 
  constructor(protected http:HttpClient) { 
    super (http, `${environment.HOST}/consultas`);
  }

  public registrarTransaccion (consultaDTO: ConsultaListaExamenDTO) {
    let urlConsultaTransacional = `${this.url}/regTransaccionalBis`
    //this.url = `${environment.HOST}/consultas/regTransaccionalBis`;
    return this.http.post(urlConsultaTransacional, consultaDTO);
  }

  public buscar(filtroConsulta: FiltroConsultaDTO) {
    console.log(filtroConsulta.toString());
    return this.http.post<Consulta[]>(`${this.url}/buscar`, filtroConsulta);
  }

  public listarExamenPorConsulta (idConsulta:number) {
    console.log(`Url: ${environment.HOST}/consultaexamenes/${idConsulta}`);
    return this.http.get<ConsultaListaExamenDTO[]>(`${environment.HOST}/consultaexamenes/${idConsulta}`);
  }

  public listarResumen() {
    return this.http.get<ConsultaResumenDTO[]>(`${this.url}/listarResumen`)
  }

  /* Métodos para PDFs */

  public generarReporte() {
    return this.http.get(`${this.url}/generarReporte`, {responseType: 'blob'});
  }

  public descargarReporte() {
   
  }

  /* Métodos para guardar y leer imagenes */

  public guardarArchivo(data: File) {
    let formData: FormData = new FormData();
    formData.append('adjunto', data);
    return this.http.post(`${this.url}/guardarArchivo`, formData)
  }

  public leerArchivo() {
    return this.http.get(`${this.url}/leerArchivo/1`, { responseType: 'blob' });
  }
}
