import { LoginService } from './service/login.service';
import { MenuService } from './service/menu.service';
import { Menu } from './model/menu';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  //title = 'mediapp-frontend';

  menus: Menu[] = [];

  constructor (private menuService: MenuService, public loginService:LoginService) { }

  ngOnInit() {
      this.menuService.getMenuCambio().subscribe(data => {this.menus = data});
  }
}
