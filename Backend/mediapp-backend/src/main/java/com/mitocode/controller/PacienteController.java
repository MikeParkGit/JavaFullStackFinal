package com.mitocode.controller;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mitocode.exception.ModeloNotFoundException;
import com.mitocode.model.Paciente;
import com.mitocode.service.IPacienteService;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;;


@RestController					//Para indicar que es una clase de servicio rest
@RequestMapping("/pacientes")	// Para indicar un endpoint
//@CrossOrigin("http://localhost:4200")  // Para romper la politica CORS de la manera más sencilla
public class PacienteController {

	@Autowired
	private IPacienteService servicio;
	
	/*
	@PostMapping		//Para insertar
	public ResponseEntity<Void> registrar(@Valid @RequestBody Paciente paciente) {	
		Paciente obj = servicio.registrar(paciente);		
		
		//localhost:8080/pacientes/5
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdPaciente()).toUri();
		return 	ResponseEntity.created(location).build();
	}
	*/
	
	@PostMapping		//Para insertar  Modificado para el proyecto final
	public ResponseEntity<Paciente> registrar(@Valid @RequestBody Paciente paciente) {	
		Paciente pacienteAux = servicio.registrar(paciente);		
		return new ResponseEntity<Paciente>(pacienteAux, HttpStatus.OK);
	}
	
	
	@GetMapping
	public ResponseEntity<List<Paciente>> listar () {		//En Spring MVC se recomienda trabajar controlando los códigos Status code para realizar validaciones, 
		List<Paciente> lstPacientes = servicio.listar();
		return new ResponseEntity<List<Paciente>>(lstPacientes, HttpStatus.OK) ;	//para ello se debe usar la clase generica ResponseEntity<T<V>>
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Paciente> listarPorId(@PathVariable("id") Integer id) {
		Paciente paciente = servicio.listarPorId(id);
		//if (paciente.getIdPaciente() == null) {
		if (paciente == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		return new ResponseEntity<Paciente>(paciente, HttpStatus.OK);
	}


	@GetMapping("/hateoas/{id}")
	public EntityModel<Paciente> listarPorIdHateoas(@PathVariable("id") Integer id) {
		Paciente paciente = servicio.listarPorId(id);
		if (paciente.getIdPaciente() == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		// para generar un link tipo: localhost:8080/pacientes/{id}
		EntityModel<Paciente> recurso = EntityModel.of(paciente);				// Antes  new EntityModel<Paciente>(paciente)
		//WebMvcLinkBuilder linkTo = linkTo(methodOn(this.getClass()).listarPorId(id));
		WebMvcLinkBuilder linkTo = linkTo(methodOn(PacienteController.class).listarPorId(id));
		
		recurso.add(linkTo.withRel("paciente-recurso"));
		
		return recurso;
	}
	
	
	
	@PutMapping			//Para actualizar
	public ResponseEntity<Paciente> modificar(@Valid @RequestBody Paciente paciente) {		// @Valid solo sirve para springboot MVC (Servicios Rest de tipo MVC)
		Paciente obj = servicio.modificar(paciente);
		return new ResponseEntity<Paciente>(obj, HttpStatus.OK);								//	se usa para que el Entity respete los constraints definidos (@Size, @Email, etc)
	}
	
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar (@PathVariable("id") Integer id) {
		Paciente paciente = servicio.listarPorId(id);
		if (paciente.getIdPaciente() == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		servicio.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);	
	}
	
	@GetMapping ("/paginado")
	public ResponseEntity<Page<Paciente>> listarPaginado(Pageable pageable) throws Exception {
		Page<Paciente> lstPacientes = servicio.listarPaginado(pageable);
		return new ResponseEntity<Page<Paciente>>(lstPacientes, HttpStatus.OK); 
	}
}
