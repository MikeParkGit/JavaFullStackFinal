package com.mitocode.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mitocode.model.Medico;
import com.mitocode.service.impl.MedicoServiceImpl;

@RestController
@RequestMapping("/medicos")
public class MedicoController {
	
	@Autowired
	private MedicoServiceImpl servicio;

	@GetMapping
	public List<Medico> Listar() {
		return servicio.listar();
	}
	
	@GetMapping("/{id}")
	public Medico ListarPorId(@PathVariable Integer id) {
		
		return servicio.listarPorId(id);
	}
	
	@PostMapping
	public Medico registrar(@RequestBody Medico med) {
		return servicio.registrar(med);
	}
	
	@PutMapping
	public Medico modificar(@RequestBody Medico med) {
		System.out.println("En el BackEnd va a modificar: " + med.getNombres());
		return servicio.modificar(med);
	}
	
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Integer id) {
		servicio.eliminar(id);
	}
}
