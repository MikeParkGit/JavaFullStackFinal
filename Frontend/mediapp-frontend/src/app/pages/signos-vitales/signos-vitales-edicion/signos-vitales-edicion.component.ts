import { PacienteService } from 'src/app/service/paciente.service';
import { switchMap } from 'rxjs/operators';
import { Paciente } from './../../../model/paciente';
import { SignosVitalesService } from './../../../service/signos-vitales.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Signo } from 'src/app/model/signo';
import * as moment from 'moment';

@Component({
  selector: 'app-signos-vitales-edicion',
  templateUrl: './signos-vitales-edicion.component.html',
  styleUrls: ['./signos-vitales-edicion.component.css']
})
export class SignosVitalesEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean = false;
  pacienteLbl:string;
  fechaSeleccionada: Date;
  maxFecha: Date = new Date();

  pacienteSeleccionado: Paciente;

  constructor(
    private signosVitalesService: SignosVitalesService,
    private ruteador: Router,
    private ruta: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'fecha': new FormControl(''),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''), 
      'ritmoRespiratorio': new FormControl('')
    });
    this.ruta.params.subscribe((data: Params) => {
      this.id = data['id'];
   });
   
   this.signosVitalesService.listarPorId(this.id).subscribe(data => { 
 
    this.fechaSeleccionada = new Date(data.fecha);
    this.form = new FormGroup({
     'fecha': new FormControl(this.fechaSeleccionada),
     'temperatura': new FormControl(data.temperatura), 
     'pulso': new FormControl(data.pulso),
     'ritmoRespiratorio':new FormControl(data.ritmoRespiratorio)
    });
     this.pacienteSeleccionado = data.paciente;
     this.pacienteLbl = `${this.pacienteSeleccionado.nombres} ${this.pacienteSeleccionado.apellidos}`;
   }); 
  }

  public cambieFecha(e:any){
    console.log('Fecha seleccionada:' + e.target.value);
    this.fechaSeleccionada = e.target.value;
  }
 
  public  ejecutar():void { 
    if (this.form.invalid) {return;}
    let signovit = new Signo();
    signovit.idSigno = this.id;
    signovit.fecha = moment(this.fechaSeleccionada).format("YYYY-MM-DDTHH:mm:ss");
    signovit.temperatura = this.form.value['temperatura'];
    signovit.pulso = this.form.value['pulso'];
    signovit.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
    signovit.paciente = new Paciente();
    signovit.paciente.idPaciente = this.pacienteSeleccionado.idPaciente;
    
    this.signosVitalesService.modificar(signovit).pipe(switchMap (() => {
      return this.signosVitalesService.listarPacientesSignos();
    })).subscribe(data => {
        this.signosVitalesService.setPacienteCambio(data);
        this.signosVitalesService.setMensajeCambio('Se actualizó el registro');
      });
    
    this.ruteador.navigate(['signos-vitales']);
  }

  get fun() {return this.form.controls;}

}
