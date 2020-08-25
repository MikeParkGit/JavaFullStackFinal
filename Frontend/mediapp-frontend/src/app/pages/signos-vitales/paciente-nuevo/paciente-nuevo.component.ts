import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignosVitalesService } from './../../../service/signos-vitales.service';
import { Paciente } from './../../../model/paciente';
import { PacienteService } from './../../../service/paciente.service';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-paciente-nuevo',
  templateUrl: './paciente-nuevo.component.html',
  styleUrls: ['./paciente-nuevo.component.css']
})
export class PacienteNuevoComponent implements OnInit {

  id: number;
  paciente:Paciente;

constructor(
    @Inject(MAT_DIALOG_DATA) private inData:Paciente,
    private signosVitalesService: SignosVitalesService,
    private pacienteService: PacienteService,
    private dialogRef:MatDialogRef<PacienteNuevoComponent>
) {}

 ngOnInit(): void {
    this.paciente = new Paciente();
    this.paciente.apellidos = '';
    this.paciente.nombres = '';
    this.paciente.dni = '';
    this.paciente.direccion = '';
    this.paciente.telefono = '';
    this.paciente.email = '';
 }
  
  public registrar():void {

    this.pacienteService.registrar(this.paciente).subscribe( (data:Paciente)  => {
      this.signosVitalesService.setPacienteNuevo(data);
      this.signosVitalesService.setMensajeCambio('Se registró un nuevo paciente');
      this.cancelar();
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

}
