import { SignosVitalesNuevoComponent } from './pages/signos-vitales/signos-vitales-nuevo/signos-vitales-nuevo.component';
import { SignosVitalesEdicionComponent } from './pages/signos-vitales/signos-vitales-edicion/signos-vitales-edicion.component';
import { SignosVitalesComponent } from './pages/signos-vitales/signos-vitales.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { Not404Component } from './pages/not404/not404.component';
import { Not403Component } from './pages/not403/not403.component';
import { GuardService } from './service/guard.service';
import { LoginComponent } from './pages/login/login.component';
import { PaginadoComponent } from './pages/paciente/paginado/paginado.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { WizardComponent } from './pages/consulta/wizard/wizard.component';
import { ConsultaEspecialComponent } from './pages/consulta/consulta-especial/consulta-especial.component';
import { ExamenEdicionComponent } from './pages/examen/examen-edicion/examen-edicion.component';
import { ExamenComponent } from './pages/examen/examen.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { EspecialidadEdicionComponent } from './pages/especialidad/especialidad-edicion/especialidad-edicion.component';
import { EspecialidadComponent } from './pages/especialidad/especialidad.component';
import { EdicionComponent } from './pages/paciente/edicion/edicion.component';
import { MedicoComponent } from './pages/medico/medico.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:'paciente', component:PacienteComponent, 
    children: [                //Para definir subrutas de la ruta padre 
      {path: 'nuevo', component:EdicionComponent},        //    /paciente/nuevo
      {path: 'edicion/:id', component:EdicionComponent}   //    /paciente/edicion/3
    ], canActivate: [GuardService]
  },
  {path:'especialidad', component:EspecialidadComponent, children: [                
    {path: 'nuevo', component:EspecialidadEdicionComponent},        
    {path: 'edicion/:id', component:EspecialidadEdicionComponent}   
  ], canActivate: [GuardService]},
  {path:'examen', component:ExamenComponent, children: [                
    {path: 'nuevo', component:ExamenEdicionComponent},        
    {path: 'edicion/:id', component:ExamenEdicionComponent}   
  ], canActivate: [GuardService]}, 
  {path:'medico', component: MedicoComponent, canActivate: [GuardService]},
  {path:'consulta', component: ConsultaComponent, canActivate: [GuardService]},
  {path:'consulta-especial', component: ConsultaEspecialComponent, canActivate: [GuardService]},
  {path:'consulta-wizard', component: WizardComponent, canActivate: [GuardService]},
  {path:'buscar', component: BuscarComponent, canActivate: [GuardService]},
  {path:'reporte', component: ReporteComponent, canActivate: [GuardService]},
  {path:'paginado', component: PaginadoComponent, canActivate: [GuardService]},
  {path:'login', component: LoginComponent},
  {path:'perfil', component:PerfilComponent},
  {path:'signos-vitales', component:SignosVitalesComponent, children:[
    {path: 'edicion/:id', component:SignosVitalesEdicionComponent},
    {path: 'nuevo', component:SignosVitalesNuevoComponent}
  ], canActivate: [GuardService]},
  {path:'not-403', component:Not403Component},
  {path:'not-404', component:Not404Component},
  {path:'', redirectTo: 'login', pathMatch: 'full'},
  {path:'**', redirectTo:'not-404', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
