import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {
  
  nombre:string;
  perfiles:string [] =[];
  displayedColumns: string[] = ['perfil'];

  constructor() { }

  ngOnInit(): void {

    let tokenStr = sessionStorage.getItem(environment.TOKEN_AUTH_NAME);

    const helper = new JwtHelperService();
    let decodedToken = helper.decodeToken(tokenStr);

    console.log(decodedToken);

    this.nombre = decodedToken.user_name;
    this.perfiles = decodedToken.authorities;


  }

}
