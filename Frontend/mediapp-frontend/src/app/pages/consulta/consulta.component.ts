import { ConsultaListaExamenDTO } from 'src/app/dto/consultaListaExamenDTO';
import { Especialidad } from './../../model/Especialidad';
import { ConsultaService } from './../../service/consulta.service';
import { Consulta } from './../../model/consulta';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamenService } from './../../service/examen.service';
import { DetalleConsulta } from './../../model/detalleConsulta';
import { EspecialidadService } from 'src/app/service/especialidad.service';
import { MedicoService } from './../../service/medico.service';
import { Medico } from './../../model/medico';
import { Paciente } from './../../model/paciente';
import { PacienteService } from './../../service/paciente.service';
import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Examen } from 'src/app/model/examen';
import * as moment from 'moment';



@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  pacientes: Paciente[];
  medicos$:Observable<Medico[]>;
  especialidades$:Observable<Especialidad[]>;
  examenes: Examen[];

  idPacienteSeleccionado:number;
  idMedicoSeleccionado:number;
  idEspecialidadSeleccionada:number;
  idExamenSeleccionado:number;

  maxFecha: Date = new Date();
 
  fechaSeleccionada: Date = new Date();

  diagnostico:string;
  tratamiento:string;
  detalleConsultaArreglo: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] =[];

  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private examenService: ExamenService,
    private snackbar:MatSnackBar,
    private consultaService:ConsultaService
    ) { }

  ngOnInit(): void {
    this.listarPacientes();
    this.listarMedicos$();
    this.listarEspecialidade$();
    this.listarExamenes();

    this.maxFecha.setMonth(this.maxFecha.getMonth()+2);
  }

  listarPacientes () {
    this.pacienteService.listar().subscribe( data => {
      this.pacientes = data;
    });
  }

  listarMedicos$() {
    this.medicos$ = this.medicoService.listar();
  }

  public listarEspecialidade$() {
    this.especialidades$ = this.especialidadService.listar();
  }

  public listarExamenes() {
    this.examenService.listar().subscribe ( data => {
      this.examenes = data;
    });
    
  }

  public cambieFecha(e:any){
    console.log(e);
  }

  public agregarDetalle() {
    if (this.diagnostico != null && this.tratamiento !== null) {
      let detalleConsulta = new DetalleConsulta();
      detalleConsulta.diagnostico = this.diagnostico;
      detalleConsulta.tratamiento = this.tratamiento;
      this.detalleConsultaArreglo.push(detalleConsulta);

      this.diagnostico = null;
      this.tratamiento = null;
    } 
  }

  public agregarExamen() {
    let cont = 0;
    
    for (let index = 0; index < this.examenesSeleccionados.length; index++) {
      let examenAux = this.examenesSeleccionados[index];
      if (examenAux.idExamen === this.idExamenSeleccionado) {
          cont++;
          break;
      }
    } 
    if (cont > 0) {
      this.snackbar.open("El examen ya está en la lista", "Aviso", {duration:1500});
    } else {
      let examen = new Examen();
      examen.idExamen = this.idExamenSeleccionado;
      this.examenService.listarPorId(this.idExamenSeleccionado).subscribe(data => {
        examen.nombre = data.nombre;
      })
      console.log("idExamen: " + examen.idExamen);
      this.examenesSeleccionados.push(examen);
   }
  }


  public removerExamen(i:number) {
    this.examenesSeleccionados.splice(i, 1);
  }

  public eliminarDiagnostico(indice: number) {
      this.detalleConsultaArreglo.splice(indice, 1);
  }

  public estadoBotonRegistrar() {
    return (this.detalleConsultaArreglo.length === 0 ||
            this.idPacienteSeleccionado === 0 ||
            this.idMedicoSeleccionado === 0 ||
            this.idEspecialidadSeleccionada === 0 );
  }


  public registrar() {
    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;

    let medico = new Medico();
    medico.idMedico = this.idMedicoSeleccionado;

    let especialidad = new Especialidad();
    especialidad.idEspecialidad = this.idEspecialidadSeleccionada;

    let consulta = new Consulta();
    consulta.paciente = paciente;
    consulta.medico = medico;
    consulta.especialidad = especialidad;
        
    /* Obtener la fecha ISO (ISO Date) de forma manual 
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let localISOTime = (new Date(this.fechaSeleccionada.getTime() - tzoffset)).toISOString();
    consulta.fecha = localISOTime;
    */

    // Obtener la fecha con la librería moment.js instalada
    consulta.fecha = moment(this.fechaSeleccionada).format("YYYY-MM-DDTHH:mm:ss");

    consulta.numConsultorio = "C7";
    consulta.detalleConsulta = this.detalleConsultaArreglo;

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() =>{
      this.snackbar.open("Se registro", "Aviso", {duration:1500});
      setTimeout(() => { this.limpiarControles();}, 1500)
    })
  }

  limpiarControles() {
    this.detalleConsultaArreglo = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.idPacienteSeleccionado = 0;
    this.idEspecialidadSeleccionada = 0;
    this.idMedicoSeleccionado = 0;
    this.idExamenSeleccionado = 0;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
  }
}
