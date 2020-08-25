import { ConsultaListaExamenDTO } from 'src/app/dto/consultaListaExamenDTO';
import { Consulta } from './../../../model/consulta';
import { DetalleConsulta } from './../../../model/detalleConsulta';
import { Examen } from 'src/app/model/examen';
import { Especialidad } from './../../../model/Especialidad';
import { Medico } from './../../../model/medico';
import { Paciente } from 'src/app/model/paciente';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsultaService } from './../../../service/consulta.service';
import { ExamenService } from './../../../service/examen.service';
import { MedicoService } from './../../../service/medico.service';
import { EspecialidadService } from 'src/app/service/especialidad.service';
import { PacienteService } from 'src/app/service/paciente.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-consulta-especial',
  templateUrl: './consulta-especial.component.html',
  styleUrls: ['./consulta-especial.component.css']
})
export class ConsultaEspecialComponent implements OnInit {

  forma:FormGroup;

  pacientes: Paciente[] = [];
  medicos:Medico[] = [];
  especialidades:Especialidad[] = [];
  examenes: Examen[] = []; 

  diagnostico:string;
  tratamiento:string;
  mensaje:string;

  detalleConsultaArreglo: DetalleConsulta [] = [];
  examenesSeleccionados: Examen [] = [];

  pacientesFiltrados: Observable<Paciente[]>;
  medicosFiltrados: Observable<Medico[]>;

  pacienteSeleccionado: Paciente;
  medicoSeleccionado: Medico;
  especialidadSeleccionada: Especialidad;
  examenSeleccionado: Examen;
  
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  /* Utiles para Autocomplete */
  myControlPaciente: FormControl = new FormControl();
  myControlMedico: FormControl = new FormControl();

  constructor(
    private pacienteService: PacienteService,
    private especialidadService: EspecialidadService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.forma = new FormGroup({
      'paciente': this.myControlPaciente,
      'especialidad':new FormControl(),
      'medico': this.myControlMedico,
      'fecha': new FormControl(new Date()),
      'diagnostico':new FormControl(),
      'tratamiento':new FormControl()
    });
    this.maxFecha.setMonth(this.maxFecha.getMonth()+2);
    
    this.listarPacientes();
    this.listarEspecialidades();
    this.listarMedicos();
    this.listarExamenes();

    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map( valor => this.filtrarPacientes(valor)));
    this.medicosFiltrados = this.myControlMedico.valueChanges.pipe(map( valor => this.filtrarMedicos(valor)));
  }

  private filtrarPacientes(val: any){
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter( paciente => 
        paciente.nombres.toLowerCase().includes(val.nombres.toLowerCase()) ||
        paciente.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) ||
        paciente.dni.includes(val.dni));
    }
      return this.pacientes.filter(paciente => 
        paciente.nombres.toLowerCase().includes(val?.toLowerCase()) ||
        paciente.apellidos.toLowerCase().includes(val?.toLowerCase()) ||
        paciente.dni.includes(val)
        );
  }

  public mostrarPaciente(val: Paciente) {
   return val != null ? `${val.nombres} ${val.apellidos}` : val;
  }

  private filtrarMedicos(medicoSeleccionado: any){
    if (medicoSeleccionado != null && medicoSeleccionado.idMedico > 0) {
      return this.medicos.filter( medico => 
        medico.nombres.toLowerCase().includes(medicoSeleccionado.nombres.toLowerCase()) ||
        medico.apellidos.toLowerCase().includes(medicoSeleccionado.apellidos.toLowerCase()) ||
        medico.cmp.includes(medicoSeleccionado.cmp));
    }
      return this.medicos.filter(medico => 
        medico.nombres.toLowerCase().includes(medicoSeleccionado?.toLowerCase()) ||
        medico.apellidos.toLowerCase().includes(medicoSeleccionado?.toLowerCase()) ||
        medico.cmp.includes(medicoSeleccionado));
  }

  public mostrarMedico(medico: Medico) {
   return medico != null ? `${medico.nombres} ${medico.apellidos}` : medico;
  }

  public seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  public seleccionarMedico(e: any) {
    this.medicoSeleccionado = e.option.value;
  }
    
  listarPacientes() { 
    this.pacienteService.listar().subscribe( data => {
      this.pacientes = data;
    });
  }

  listarMedicos() {
    this.medicoService.listar().subscribe( data => {
      this.medicos = data;
    });
  }

  
  listarEspecialidades () {
    this.especialidadService.listar().subscribe( data => {
      this.especialidades = data;
    });
  }

  public listarExamenes() {
    this.examenService.listar().subscribe ( data => {
      this.examenes = data;
    });
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
    else {
      this.mensaje = 'Debe agregar un diagnóstico y tratamiento';
      this.snackBar.open(this.mensaje, "Aviso", {duration:1500});
    }
    console.log("Termina Agregar Detalle");
  }

  public agregarExamen() {
    if (this.examenSeleccionado) {
      let cont = 0;
      for (let index = 0; index < this.examenesSeleccionados.length; index++) {
        let examenAux = this.examenesSeleccionados[index];
        if (examenAux.idExamen === this.examenSeleccionado.idExamen) {
            cont++;
            break;
        }
      }
      if (cont > 0) {
        this.snackBar.open("El examen ya está en la lista", "Aviso", {duration:1500});
      } else {
        this.examenesSeleccionados.push(this.examenSeleccionado);
     }
    } else {
      this.mensaje = "Debe agragar un examen";
      this.snackBar.open(this.mensaje, "Aviso", {duration:1500});
    }
  }

  public eliminarDiagnostico(indice: number) {
    this.detalleConsultaArreglo.splice(indice, 1);
  }
  public removerExamen(indice:number) {
    this.examenesSeleccionados.splice(indice, 1);
  }



  public estadoBotonRegistrar() {
    return (this.detalleConsultaArreglo.length === 0 ||
            this.pacienteSeleccionado === null ||
            this.medicoSeleccionado === null ||
            this.especialidadSeleccionada === null );
  }


  registrar() {
    console.log("Entra a registrar");
    let consulta = new Consulta();
          //Se pueden llenar estos campos de dos formas:
    consulta.paciente = this.pacienteSeleccionado;        //usando directamente el objeto asociado al html
    consulta.medico = this.forma.value['medico'];         //de la manera clasica a traves del formulario (forma)
    consulta.especialidad = this.forma.value['especialidad']
    
    consulta.numConsultorio = "C7";
    consulta.fecha = moment(this.fechaSeleccionada).format("YYYY-MM-DDTHH:mm:ss");

    consulta.detalleConsulta = this.detalleConsultaArreglo;

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

     this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() =>{
      this.snackBar.open("Se registro", "Aviso", {duration:1500});
      setTimeout(() => { this.limpiarControles();}, 1500)
    }) 
  }

  limpiarControles() {
    this.detalleConsultaArreglo = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = null;
    this.medicoSeleccionado = null;
    this.especialidadSeleccionada = null;
    this.examenSeleccionado = null;
    //this.pacientesFiltrados=EMPTY;
    //this.medicosFiltrados=EMPTY;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje= '';
    this.myControlPaciente.reset();
    this.myControlMedico.reset();

  }
}
