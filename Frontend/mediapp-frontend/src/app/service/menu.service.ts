import { Subject, Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Menu } from './../model/menu';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu> {

  private menuCambio:Subject<Menu[]> = new Subject<Menu[]>();

  constructor(http:HttpClient) { 
    super(http, `${environment.HOST}/menus`);
  }

  public getMenuCambio():Observable<Menu[]> {
    return this.menuCambio.asObservable();
  }

  public setMenuCambio(menus: Menu[]) {
    this.menuCambio.next(menus);
  }

  public listar () {
    return this.http.get<Menu[]>(`${this.url}`);  // Sin la libreria de  JWT habria que poner todo el codigo de abajo en cada peticion de los services para añadi el token a la petición
                                                  // Pero gracias a que ella intercepta las peticiones y les añade el token junto con todo lo necesario, pueden quedarse asi.

    /* let token = sessionStorage.getItem(environment.TOKEN_AUTH_NAME);
    
    return this.http.get<Menu[]>(`${this.url}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
    });
    */
  }

  public listarPorUsuario(nombre: string) {
    let token = sessionStorage.getItem(environment.TOKEN_AUTH_NAME);      //Se quedó asi el código como ejemplo

    return this.http.post<Menu[]>(`${this.url}/usuario`, nombre, {
      headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
    });
  }
}

