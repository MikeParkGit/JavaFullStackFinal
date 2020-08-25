import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { ConsultaListaExamenDTO } from 'src/app/dto/consultaListaExamenDTO';
import { Consulta } from './../../../model/consulta';
import { Observable } from 'rxjs';
import { DetalleConsulta } from './../../../model/detalleConsulta';
import { Examen } from 'src/app/model/examen';
import { Especialidad } from './../../../model/Especialidad';
import { Medico } from './../../../model/medico';
import { Paciente } from 'src/app/model/paciente';
import { ConsultaService } from './../../../service/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamenService } from './../../../service/examen.service';
import { EspecialidadService } from 'src/app/service/especialidad.service';
import { MedicoService } from './../../../service/medico.service';
import { PacienteService } from 'src/app/service/paciente.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper; //Busca en la vista un componente con el apodo #stepper y aqui le llama stepper

  esLineal:boolean = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  // Contenedores de la data recuperada de BD
  pacientes: Paciente[] = [];
  medicos:Medico[] = [];
  especialidades:Especialidad[] = [];
  examenes: Examen[] = []; 

  // Contenedores de la data proporcionada por el usuario
  detalleConsultaArreglo: DetalleConsulta [] = [];
  examenesSeleccionados: Examen [] = [];
  consultorios: number[] = [];
  consultorioSeleccionado: number;
  pacienteSeleccionado: Paciente;
  medicoSeleccionado: Medico;
  especialidadSeleccionada: Especialidad;
  examenSeleccionado: Examen;
  fechaSeleccionada: Date = new Date();

  // Auxiliares
  diagnostico:string;
  tratamiento:string;
  mensaje:string;
  maxFecha: Date = new Date();
  pacientesFiltrados: Observable<Paciente[]>;
  medicosFiltrados: Observable<Medico[]>;


  constructor(
    private formBuilder:FormBuilder, // Se utiliza cuando hay más de un formulario en un html y se requiere agruparlos
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private examenService: ExamenService,
    private snackbar:MatSnackBar,
    private consultaService:ConsultaService
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
      pacienteSeleccionado: new FormControl(),
      fecha: ['', new FormControl(new Date(), [Validators.required])] ,
      'diagnostico': new FormControl(),
      'tratamiento': new FormControl()
    });
    this.secondFormGroup = this.formBuilder.group({
     secondCtrl:['', Validators.required]
    });

    this.listarPacientes();
    this.listarEspecialidades();
    this.listarMedicos();
    this.listarExamenes();
    this.listarConsultorios();
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

  public listarConsultorios() {
    for(let i = 1; i <= 20; i++) {
      this.consultorios.push(i); // this.consultorios[i] = i;
    }
  }

   public seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.value;
  }

  public seleccionarEspecialidad(e: any) {
    this.especialidadSeleccionada = e.value;
  }

   public seleccionarMedico(medico: Medico) {
    this.medicoSeleccionado = medico;
  }


  public agregarDetalle() {
    console.log("Entra a Agregar Detalle");
    if (this.diagnostico != null && this.tratamiento !== null) {
      let detalleConsulta = new DetalleConsulta();
      detalleConsulta.diagnostico = this.diagnostico;
      detalleConsulta.tratamiento = this.tratamiento;
      this.detalleConsultaArreglo.push(detalleConsulta);

      this.diagnostico = null;
      this.tratamiento = null;
    } else {
      this.mensaje = 'Debe agregar un diagnóstico y tratamiento';
      this.snackbar.open(this.mensaje, "Aviso", {duration:1500});
    }
    console.log("Termina Agregar Detalle");
  }

  public estadoBotonRegistrar() {
    return (this.detalleConsultaArreglo.length === 0 ||
            this.pacienteSeleccionado === null ||
            this.medicoSeleccionado === null ||
            this.especialidadSeleccionada === null );
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
        this.snackbar.open("El examen ya está en la lista", "Aviso", {duration:1500});
      } else {
        this.examenesSeleccionados.push(this.examenSeleccionado);
     }
    } else {
      this.mensaje = "Debe agragar un examen";
      this.snackbar.open(this.mensaje, "Aviso", {duration:1500});
    }
  }

  public eliminarDiagnostico(indice: number) {
    this.detalleConsultaArreglo.splice(indice, 1);
  }
  public removerExamen(i:number) {
    this.examenesSeleccionados.splice(i, 1);
  }

  seleccionarConsultorio(numCons:number) {
    this.consultorioSeleccionado = numCons;
  }

  nextManualStep() {
    if (this.consultorioSeleccionado > 0) {
        this.stepper.linear = false;
        this.stepper.next();
    } else {
      this.snackbar.open('Debe seleccionar consultorio', 'Info', {duration: 1500});
    }
  }


  registrar() {
    console.log("Entra a registrar");
    let consulta = new Consulta();
    consulta.paciente = this.pacienteSeleccionado;     
    consulta.medico = this.medicoSeleccionado        
    consulta.especialidad = this.especialidadSeleccionada
    consulta.numConsultorio = 'C'+this.consultorioSeleccionado;
    consulta.fecha = moment(this.fechaSeleccionada).format("YYYY-MM-DDTHH:mm:ss");
    consulta.detalleConsulta = this.detalleConsultaArreglo;

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    
    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() =>{
      this.snackbar.open("Se registro", "Aviso", {duration:1500});
      setTimeout(() => { this.limpiarControles();}, 1500);
    });
  } 
    limpiarControles() {
      this.detalleConsultaArreglo = [];
      this.examenesSeleccionados = [];
      this.diagnostico = '';
      this.tratamiento = '';
      this.consultorioSeleccionado = 0;
      this.pacienteSeleccionado = null;
      this.medicoSeleccionado = null;
      this.especialidadSeleccionada = null;
      this.examenSeleccionado = null;
      this.fechaSeleccionada = new Date();
      this.fechaSeleccionada.setHours(0);
      this.fechaSeleccionada.setMinutes(0);
      this.fechaSeleccionada.setSeconds(0);
      this.fechaSeleccionada.setMilliseconds(0);
      this.mensaje= '';
      this.stepper.reset();
  }

}
