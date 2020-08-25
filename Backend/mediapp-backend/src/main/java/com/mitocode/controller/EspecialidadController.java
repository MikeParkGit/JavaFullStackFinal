package com.mitocode.controller;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
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

import com.mitocode.exception.ModeloNotFoundException;
import com.mitocode.model.Especialidad;
import com.mitocode.service.IEspecialidadService;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;;


@RestController					//Para indicar que es una clase de servicio rest
@RequestMapping("/especialidades")	// Para indicar un endpoint
public class EspecialidadController {

	@Autowired
	private IEspecialidadService servicio;
	

	@PostMapping		//Para insertar
	public ResponseEntity<Void> registrar(@Valid @RequestBody Especialidad especialidad) {	
		Especialidad obj = servicio.registrar(especialidad);		
		
		//localhost:8080/especialidades/5
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdEspecialidad()).toUri();
		return 	ResponseEntity.created(location).build();
	}
	
	
	@GetMapping
	public ResponseEntity<List<Especialidad>> listar () {		//En Spring MVC se recomienda trabajar controlando los códigos Status code para realizar validaciones, 
		List<Especialidad> lstEspecialidades = servicio.listar();
		return new ResponseEntity<List<Especialidad>>(lstEspecialidades, HttpStatus.OK) ;	//para ello se debe usar la clase generica ResponseEntity<T<V>>
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Especialidad> listarPorId(@PathVariable("id") Integer id) {
		Especialidad especialidad = servicio.listarPorId(id);
		//if (especialidad.getIdEspecialidad() == null) {
		if (especialidad == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		return new ResponseEntity<Especialidad>(especialidad, HttpStatus.OK);
	}


	@GetMapping("/hateoas/{id}")
	public EntityModel<Especialidad> listarPorIdHateoas(@PathVariable("id") Integer id) {
		Especialidad especialidad = servicio.listarPorId(id);
		if (especialidad.getIdEspecialidad() == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		// para generar un link tipo: localhost:8080/especialidades/{id}
		EntityModel<Especialidad> recurso = EntityModel.of(especialidad);				// Antes  new EntityModel<Especialidad>(especialidad)
		//WebMvcLinkBuilder linkTo = linkTo(methodOn(this.getClass()).listarPorId(id));
		WebMvcLinkBuilder linkTo = linkTo(methodOn(EspecialidadController.class).listarPorId(id));
		
		recurso.add(linkTo.withRel("especialidad-recurso"));
		
		return recurso;
	}
	
	
	
	@PutMapping			//Para actualizar
	public ResponseEntity<Especialidad> modificar(@Valid @RequestBody Especialidad especialidad) {		// @Valid solo sirve para springboot MVC (Servicios Rest de tipo MVC)
		Especialidad obj = servicio.modificar(especialidad);
		return new ResponseEntity<Especialidad>(obj, HttpStatus.OK);								//	se usa para que el Entity respete los constraints definidos (@Size, @Email, etc)
	}
	
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar (@PathVariable("id") Integer id) {
		Especialidad especialidad = servicio.listarPorId(id);
		if (especialidad.getIdEspecialidad() == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		servicio.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		
	}
}
