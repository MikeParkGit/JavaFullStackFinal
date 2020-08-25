import { Paciente } from './../../../model/paciente';
import { PacienteService } from './../../../service/paciente.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-edicion',
  templateUrl: './edicion.component.html',
  styleUrls: ['./edicion.component.css']
})

export class EdicionComponent implements OnInit {

  form:FormGroup;
  id: number;
  edicion: boolean;

  constructor(private ruta: ActivatedRoute, 
              private pacienteServ: PacienteService,
              private ruteador: Router
              ) {}

    
  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl('', [Validators.required]), 
      'telefono': new FormControl(''),
      'direccion':new FormControl(''),
      'correo' : new FormControl('')
    });

   // this.ruta.params.subscribe(data => {console.log(data)})
    //this.ruta.params.subscribe((data: Params) =>{console.log(data['id'])});

    this.ruta.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
   });
  }
  
  initForm() {
    if (this.edicion) { //Edicion
        //this.pacienteServ.listarPorId(this.id).subscribe(data =>{ console.log(data)});
        this.pacienteServ.listarPorId(this.id).subscribe(data =>{ 
          this.form = new FormGroup({
            'id': new FormControl(data.idPaciente),
            'nombres': new FormControl(data.nombres),
            'apellidos': new FormControl(data.apellidos),
            'dni': new FormControl(data.dni), 
            'telefono': new FormControl(data.telefono),
            'direccion':new FormControl(data.direccion),
            'correo': new FormControl(data.email)
          });
        });
    }
  }

  ejecutar() {
    if (this.form.invalid) {return;}

    let paciente:Paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];
    paciente.email = this.form.value['correo'];

    if (this.edicion) {       // Modificar
        this.pacienteServ.modificar(paciente).subscribe( () => 
        {this.pacienteServ.listar().subscribe(data => 
          { this.pacienteServ.pacienteCambio.next(data)
            this.pacienteServ.mensajeCambio.next('Se modificó');
          }); 
        });

    } else {                  // Insertar
        this.pacienteServ.registrar(paciente).subscribe(() => {
          this.pacienteServ.listar().subscribe(data => {
            this.pacienteServ.pacienteCambio.next(data);
            this.pacienteServ.mensajeCambio.next('Se registró');
          });
        });
    }
    this.ruteador.navigate(['paciente']);
  }

  get fun() {return this.form.controls;}
}
