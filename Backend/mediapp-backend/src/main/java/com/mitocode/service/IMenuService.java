package com.mitocode.service;

import java.util.List;

import com.mitocode.model.Menu;

public interface IMenuService extends ICRUD<Menu, Integer>{

	public List<Menu> listarMenuPorUsuario(String nombre);

}
