package com.mitocode.repo;

import com.mitocode.model.Usuario;

public interface IUsuarioRepo extends IGenericRepo<Usuario, Integer> {

	/*Metodo generado de acuerdo a las reglas de springboot:
	 * findOneBy -> expresion reservada de spring para crear métodos de búsqueda
	 * UserName -> nombre de un campo del entity Usuario en este caso username
	 * */
	Usuario findOneByUserName(String name);	//Equivale a SELECT * FROM usario WHERE username = ?
	
}
