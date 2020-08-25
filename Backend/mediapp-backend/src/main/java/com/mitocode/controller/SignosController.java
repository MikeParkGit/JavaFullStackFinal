package com.mitocode.controller;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mitocode.dto.PacienteSignosVitalesDTO;
import com.mitocode.exception.ModeloNotFoundException;
import com.mitocode.model.Signo;
import com.mitocode.service.ISignosService;

@RestController
@RequestMapping("/signos")
public class SignosController {

	@Autowired
	private ISignosService servicio;
	
	
	@GetMapping
	public ResponseEntity<List<Signo>> listar () {		 
		List<Signo> lstSignos = servicio.listar();
		return new ResponseEntity<List<Signo>>(lstSignos, HttpStatus.OK) ;	
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Signo> listarPorId(@PathVariable("id") Integer id) {
		Signo signo = servicio.listarPorId(id);
		if (signo == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		System.out.println("Fecha consultada: " + signo.getFecha().toString());
		return new ResponseEntity<Signo>(signo, HttpStatus.OK);
	}
	
	@GetMapping("/pacientessignos")
	public ResponseEntity<List<PacienteSignosVitalesDTO>> listarPacientesSignos () {		 
		List<PacienteSignosVitalesDTO> lstSignos = servicio.listarPacientesSignosVitales();
		return new ResponseEntity<List<PacienteSignosVitalesDTO>>(lstSignos, HttpStatus.OK) ;	
	}
	
	@PostMapping		
	public ResponseEntity<Void> registrar(@Valid @RequestBody Signo especialidad) {	
		
		Signo signo = servicio.registrar(especialidad);		
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(signo.getIdSigno()).toUri();
		return 	ResponseEntity.created(location).build();
	}
	
	@PutMapping			
	public ResponseEntity<Signo> modificar(@Valid @RequestBody Signo signo) {		
		Signo obj = servicio.modificar(signo);
		return new ResponseEntity<Signo>(obj, HttpStatus.OK);						
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar (@PathVariable("id") Integer id) {
		Signo signo = servicio.listarPorId(id);
		if (signo == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		servicio.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}
	
}
