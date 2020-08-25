import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url:string  = `${environment.HOST}/oauth/token`

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public login (usuario: string, clave:string) {
      const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(clave)}`;

      return this.http.post<any>(this.url, body, {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
            .set('Authorization', 'Basic ' + btoa(`${environment.TOKEN_AUTH_USERNAME}:${environment.TOKEN_AUTH_PASSWORD}`))
          //'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD
      });
  }

  public estaLogueado(): boolean {
    let token = sessionStorage.getItem(environment.TOKEN_AUTH_NAME);
    return token != null;
  }

  public cerrarSesion():void {
    let token = sessionStorage.getItem(environment.TOKEN_AUTH_NAME);
    if (token) {
      this.http.get(`${environment.HOST}/tokens/anular/${token}`).subscribe(() => {});
    } 
    this.cerrarSesionLocal();
  }

  /*  Solo limpia el token a nivel de memoria */
  private cerrarSesionLocal():void {
    this.router.navigate(['login']);
    sessionStorage.clear();
  }
  
  /*
  public cerrarSesion():void {
    let token = sessionStorage.getItem(environment.TOKEN_AUTH_NAME);
    if (token) {
      this.http.get(`${environment.HOST}/tokens/anular/${token}`).subscribe(() => {
        this.cerrarSesionLocal();
      });
    } else {
      this.cerrarSesionLocal();
    }
  }
  */
}
