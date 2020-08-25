import { ServerErrorsInterceptor } from './shared/server-errors.interceptor';
import { environment } from './../environments/environment';
import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MedicoComponent } from './pages/medico/medico.component';
import { EdicionComponent } from './pages/paciente/edicion/edicion.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MedicoDialogoComponent } from './pages/medico/medico-dialogo/medico-dialogo.component';
import { EspecialidadComponent } from './pages/especialidad/especialidad.component';
import { EspecialidadEdicionComponent } from './pages/especialidad/especialidad-edicion/especialidad-edicion.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { ExamenComponent } from './pages/examen/examen.component';
import { ExamenEdicionComponent } from './pages/examen/examen-edicion/examen-edicion.component';
import { ConsultaEspecialComponent } from './pages/consulta/consulta-especial/consulta-especial.component';
import { WizardComponent } from './pages/consulta/wizard/wizard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { BuscarDialogComponent } from './pages/buscar/buscar-dialog/buscar-dialog.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PaginadoComponent } from './pages/paciente/paginado/paginado.component';
import { LoginComponent } from './pages/login/login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { Not403Component } from './pages/not403/not403.component';
import { Not404Component } from './pages/not404/not404.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SignosVitalesComponent } from './pages/signos-vitales/signos-vitales.component';
import { SignosVitalesEdicionComponent } from './pages/signos-vitales/signos-vitales-edicion/signos-vitales-edicion.component';
import { SignosVitalesNuevoComponent } from './pages/signos-vitales/signos-vitales-nuevo/signos-vitales-nuevo.component';
import { PacienteNuevoComponent } from './pages/signos-vitales/paciente-nuevo/paciente-nuevo.component';

export function tokenGetter() {
  return sessionStorage.getItem(environment.TOKEN_AUTH_NAME);
}

@NgModule({
  declarations: [
    AppComponent,
    PacienteComponent,
    MedicoComponent,
    EdicionComponent,
    MedicoDialogoComponent,
    EspecialidadComponent,
    EspecialidadEdicionComponent,
    ConsultaComponent,
    ExamenComponent,
    ExamenEdicionComponent,
    ConsultaEspecialComponent,
    WizardComponent,
    BuscarComponent,
    BuscarDialogComponent,
    ReporteComponent,
    PaginadoComponent,
    LoginComponent,
    Not403Component,
    Not404Component,
    PerfilComponent,
    SignosVitalesComponent,
    SignosVitalesEdicionComponent,
    SignosVitalesNuevoComponent,
    PacienteNuevoComponent
  ],
  //entryComponents: [MedicoDialogoComponent]   Desde Angular 8 ya no se utiliza registrar los componentes tipo dialogo
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,       //Para importar(habilitar) el modulo que permite usar el cliente http y las operaciones (GET, POST, etc)
    BrowserAnimationsModule,
    ReactiveFormsModule,   // Para importar el modulo de manejo de forms (Habilitar formularios en Angular Material)
    MaterialModule,        //Para importar el modulo que contiene las importaciones de componentes graficos de la UI
    FormsModule,
    FlexLayoutModule,
    PdfViewerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains:["localhost:8080"],
        disallowedRoutes:[""] //http://localhost:8080/login/enviarCorreo
      }
    })
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
