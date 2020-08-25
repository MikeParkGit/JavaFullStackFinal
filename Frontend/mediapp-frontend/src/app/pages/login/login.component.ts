import { MenuService } from './../../service/menu.service';
import { LoginService } from './../../service/login.service';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import '../../../assets/login-animation.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje:string;
  error:string;
  
  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public iniciarSesion() {
       
    this.loginService.login(this.usuario, this.clave).subscribe(data => {

      sessionStorage.setItem(environment.TOKEN_AUTH_NAME, data.access_token);
     
      const helper = new JwtHelperService();
      let decodedToken = helper.decodeToken(data.access_token);

      this.menuService.listarPorUsuario(decodedToken.user_name).subscribe(data => {
        this.menuService.setMenuCambio(data);
        this.router.navigate(['paciente']);
      });
    });
  }

  ngAfterViewInit() {
    (window as any).initialize();
  }

}
