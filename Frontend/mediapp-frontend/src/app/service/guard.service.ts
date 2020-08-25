import { Menu } from './../model/menu';
import { map } from 'rxjs/operators';
import { MenuService } from './menu.service';
import { environment } from './../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private router:Router
    ) { }

  public canActivate (ruta: ActivatedRouteSnapshot, estado:RouterStateSnapshot): boolean|Observable<boolean> {
    
      if (!this.loginService.estaLogueado()) {  // Validar si esta logueado
        return this.cerrarSesion();
      } else {                                  // Validar si el token ha expirado
          const helper = new JwtHelperService();
          let token = sessionStorage.getItem(environment.TOKEN_AUTH_NAME);
          if (!helper.isTokenExpired(token)) {    // Validar si el usr tiene el rol necesario para acceder a esa página
            
            let url = estado.url;
            const decodedToken = helper.decodeToken(token);
            return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map((data: Menu[]) => {
              this.menuService.setMenuCambio(data);
              let cont = 0;
              for (let m of data) {
                if (url.startsWith(m.url)) {
                  cont++;
                  break;
                }
              }
              if (cont > 0) {
                return true;
              } else {
                this.router.navigate(['not-403']);
                return false;
              }
            }));
          } else {
            return this.cerrarSesion();
          }
      }
  }

  private cerrarSesion() : boolean{
    this.loginService.cerrarSesion();
    return false;
  }

}
