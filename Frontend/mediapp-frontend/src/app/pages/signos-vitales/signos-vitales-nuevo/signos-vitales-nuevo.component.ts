import { PacienteNuevoComponent } from './../paciente-nuevo/paciente-nuevo.component';
import { MatDialog } from '@angular/material/dialog';
import { map, switchMap } from 'rxjs/operators';
import { SignosVitalesService } from './../../../service/signos-vitales.service';
import { Router } from '@angular/router';
import { PacienteService } from './../../../service/paciente.service';
import { Paciente } from './../../../model/paciente';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Signo } from 'src/app/model/signo';
import * as moment from 'moment';


@Component({
  selector: 'app-signos-vitales-nuevo',
  templateUrl: './signos-vitales-nuevo.component.html',
  styleUrls: ['./signos-vitales-nuevo.component.css']
})
export class SignosVitalesNuevoComponent implements OnInit {
  
  form: FormGroup;
  titulo:string;
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  pacientesFiltrados: Observable<Paciente[]>;
  myControlPaciente: FormControl = new FormControl();
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente;

  signo: Signo;

  mensaje:string = 'Esperando';

  @ViewChild('nomPaciente') pacienteInput: ElementRef;

  constructor(
    private pacienteService: PacienteService,
    private signosVitalesService: SignosVitalesService,
    private ruteador: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    
    this.form = new FormGroup({
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(''),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''), 
      'ritmoRespiratorio': new FormControl('')
    });
    this.titulo = 'Ingrese los signos vitales del paciente';
    this.listarPacientes();

    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map( valor => this.filtrarPacientes(valor)));

    this.signosVitalesService.getPacienteNuevo().subscribe( (data:Paciente) => {
      this.listarPacientes();
      this.pacienteSeleccionado = data;
      this.pacienteInput.nativeElement.value = data.nombres + ' ' + data.apellidos;
    });

  }

  public cambieFecha(e:any) {
    this.fechaSeleccionada = e.target.value;
  }

  listarPacientes() { 
    this.pacienteService.listar().subscribe( data => {
      this.pacientes = data;
    });
  }

  private filtrarPacientes(val: any): Paciente[] {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter( paciente => 
        paciente.nombres.toLowerCase().includes(val.nombres.toLowerCase()) ||
        paciente.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()));
    }
      return this.pacientes.filter(paciente => 
        paciente.nombres.toLowerCase().includes(val?.toLowerCase()) ||
        paciente.apellidos.toLowerCase().includes(val?.toLowerCase()));
  }

  public mostrarPaciente(val: Paciente) {
    return val != null ? `${val.nombres} ${val.apellidos}` : val;
  }

  public seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }
 
  public  registrar() { 
      this.signo = new Signo();
      this.signo.fecha = moment(this.fechaSeleccionada).format("YYYY-MM-DDTHH:mm:ss");
      this.signo.pulso = this.form.value['pulso'];
      this.signo.temperatura = this.form.value['temperatura'];
      this.signo.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
      this.signo.paciente = this.pacienteSeleccionado;

      this.signosVitalesService.registrar(this.signo).pipe(switchMap( ()  => {
       return this.signosVitalesService.listarPacientesSignos();
      })).subscribe( data => {
        this.signosVitalesService.setPacienteCambio(data);
        this.signosVitalesService.setMensajeCambio('Se registró');
      });
      this.ruteador.navigate(['signos-vitales']);
  }

  public abrirDialogo () {   
    let paciente = new Paciente();
    this.dialog.open(PacienteNuevoComponent, {width: '380px', data:paciente} )
  }

  get fun() {return this.form.controls;}

}
