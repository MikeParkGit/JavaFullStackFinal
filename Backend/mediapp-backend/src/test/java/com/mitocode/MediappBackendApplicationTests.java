package com.mitocode;

import org.junit.jupiter.api.Assertions;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.mitocode.model.Usuario;
import com.mitocode.repo.IUsuarioRepo;

@SpringBootTest
class MediappBackendApplicationTests {

	@Autowired
	private IUsuarioRepo repo;
	
	@Autowired
	private BCryptPasswordEncoder bcrypt;
	
	@Test
	void verificarClave() {
		Usuario user = new Usuario();
		user.setIdUsuario(2);
		user.setUserName("miguelcfb@gmail.com"); 
		user.setPassword(bcrypt.encode("54321"));
		user.setEnabled(true);
		
		Usuario usr = repo.save(user);
		
		Assertions.assertTrue(usr.getPassword().equalsIgnoreCase(user.getPassword()));
	}
	
	// cruzma2005@yahoo.com.mx	12345		//mitotest21@gmail.com
	// miguelcfb@gmail.com		54321		//mitocode21@gmail.com

}
