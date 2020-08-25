package com.mitocode.controller;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.mitocode.model.Examen;
import com.mitocode.service.IExamenService;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;;


@RestController					//Para indicar que es una clase de servicio rest
@RequestMapping("/examenes")	// Para indicar un endpoint
public class ExamenController {

	@Autowired
	private IExamenService servicio;
	

	@PostMapping		//Para insertar
	public ResponseEntity<Void> registrar(@Valid @RequestBody Examen examen) {	
		Examen obj = servicio.registrar(examen);		
		
		//localhost:8080/examenes/5
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdExamen()).toUri();
		return 	ResponseEntity.created(location).build();
	}
	
	
	//@PreAuthorize("hasAuthority('ADMIN')")
	@PreAuthorize("@authServiceImpl.tieneAcceso('listar')")
	@GetMapping
	public ResponseEntity<List<Examen>> listar () {		//En Spring MVC se recomienda trabajar controlando los códigos Status code para realizar validaciones, 
		List<Examen> lstExamenes = servicio.listar();
		return new ResponseEntity<List<Examen>>(lstExamenes, HttpStatus.OK) ;	//para ello se debe usar la clase generica ResponseEntity<T<V>>
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Examen> listarPorId(@PathVariable("id") Integer id) {
		Examen examen = servicio.listarPorId(id);
		//if (examen.getIdExamen() == null) {
		if (examen == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		return new ResponseEntity<Examen>(examen, HttpStatus.OK);
	}

	/* https://docs.spring.io/spring-hateoas/docs/current/reference/html/
	 * hateoas 0.9 -> Springboot 1.5 y 2
	 * hateoas 1.0 -> Springboot 2.2
	 * hateoas 1.1 -> Springboot 2.3
	 * */
	@GetMapping("/hateoas/{id}")
	public EntityModel<Examen> listarPorIdHateoas(@PathVariable("id") Integer id) {
		Examen examen = servicio.listarPorId(id);
		if (examen.getIdExamen() == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		// para generar un link tipo: localhost:8080/examenes/{id}
		EntityModel<Examen> recurso = EntityModel.of(examen);				// Antes  new EntityModel<Examen>(examen)
		//WebMvcLinkBuilder linkTo = linkTo(methodOn(this.getClass()).listarPorId(id));
		WebMvcLinkBuilder linkTo = linkTo(methodOn(ExamenController.class).listarPorId(id));
		
		
		recurso.add(linkTo.withRel("examen-recurso"));
		
		return recurso;
	}
	
	
	
	@PutMapping			//Para actualizar
	public ResponseEntity<Examen> modificar(@Valid @RequestBody Examen examen) {		// @Valid solo sirve para springboot MVC (Servicios Rest de tipo MVC)
		Examen obj = servicio.modificar(examen);
		return new ResponseEntity<Examen>(obj, HttpStatus.OK);								//	se usa para que el Entity respete los constraints definidos (@Size, @Email, etc)
	}
	
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar (@PathVariable("id") Integer id) {
		Examen examen = servicio.listarPorId(id);
		if (examen.getIdExamen() == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		servicio.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		
	}
}
