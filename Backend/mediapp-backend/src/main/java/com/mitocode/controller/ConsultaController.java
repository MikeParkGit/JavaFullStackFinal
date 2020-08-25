	package com.mitocode.controller;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mitocode.dto.ConsultaListaExamenDTO;
import com.mitocode.dto.ConsultaResumenDTO;
import com.mitocode.dto.FiltroConsultaDTO;
import com.mitocode.exception.ModeloNotFoundException;
import com.mitocode.model.Archivo;
import com.mitocode.model.Consulta;
import com.mitocode.service.IArchivoService;
import com.mitocode.service.IConsultaService;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;;


@RestController					//Para indicar que es una clase de servicio rest
@RequestMapping("/consultas")	// Para indicar un endpoint
public class ConsultaController {

	@Autowired
	private IConsultaService servicio;
	
	@Autowired
	private IArchivoService servicioArchivo;
	
	  @PostMapping 					//Para insertar 
	  public ResponseEntity<Void> registrar(@Valid @RequestBody Consulta consulta) {
		  
		Consulta obj = servicio.registrar(consulta);
	    
		//localhost:8080/consultas/5 
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdConsulta()).toUri(); 
		return ResponseEntity.created(location).build(); 
	  }
	 
	

	
	@PostMapping("/regTransaccional")		//Para insertar de manera transaccional
	public ResponseEntity<Void> registrarTransaccional(@Valid @RequestBody Consulta consulta) throws Exception{	
		Consulta obj = servicio.registrarTransaccional(consulta);		
		
		//localhost:8080/consultas/5
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdConsulta()).toUri();
		return 	ResponseEntity.created(location).build();
	}
	
	@PostMapping("/regTransaccionalBis")		//Para insertar de manera transaccional
	public ResponseEntity<Void> registrarTransaccional(@Valid @RequestBody ConsultaListaExamenDTO dto) throws Exception{	//sobrecargado con el anterior
		Consulta obj = servicio.registrarTransaccionalBis(dto);		
		
		//localhost:8080/consultas/5
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdConsulta()).toUri();
		return 	ResponseEntity.created(location).build();
	}
	
	@GetMapping
	public ResponseEntity<List<Consulta>> listar () {		//En Spring MVC se recomienda trabajar controlando los códigos Status code para realizar validaciones, 
		List<Consulta> lstConsultas = servicio.listar();
		return new ResponseEntity<List<Consulta>>(lstConsultas, HttpStatus.OK) ;	//para ello se debe usar la clase generica ResponseEntity<T<V>>
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Consulta> listarPorId(@PathVariable("id") Integer id) {
		Consulta consulta = servicio.listarPorId(id);
		//if (consulta.getIdConsulta() == null) {
		if (consulta == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		return new ResponseEntity<Consulta>(consulta, HttpStatus.OK);
	}


	@GetMapping("/hateoas/{id}")
	public EntityModel<Consulta> listarPorIdHateoas(@PathVariable("id") Integer id) {
		Consulta consulta = servicio.listarPorId(id);
		if (consulta.getIdConsulta() == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		// para generar un link tipo: localhost:8080/consultas/{id}
		EntityModel<Consulta> recurso = EntityModel.of(consulta);				// Antes  new EntityModel<Consulta>(consulta)
		//WebMvcLinkBuilder linkTo = linkTo(methodOn(this.getClass()).listarPorId(id));
		WebMvcLinkBuilder linkTo = linkTo(methodOn(ConsultaController.class).listarPorId(id));
		
		
		recurso.add(linkTo.withRel("consulta-recurso"));
		
		return recurso;
	}
	
	
	
	@PutMapping			//Para actualizar
	public ResponseEntity<Consulta> modificar(@Valid @RequestBody Consulta consulta) {		// @Valid solo sirve para springboot MVC (Servicios Rest de tipo MVC)
		Consulta obj = servicio.modificar(consulta);
		return new ResponseEntity<Consulta>(obj, HttpStatus.OK);								//	se usa para que el Entity respete los constraints definidos (@Size, @Email, etc)
	}
	
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar (@PathVariable("id") Integer id) {
		Consulta consulta = servicio.listarPorId(id);
		if (consulta.getIdConsulta() == null) {
			throw new ModeloNotFoundException("Id no encontrado: " + id);
		}
		servicio.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}
	
	@PostMapping("/buscar")
	public ResponseEntity<List<Consulta>> buscar(@RequestBody FiltroConsultaDTO filtro) {

		List<Consulta> consultas = new ArrayList<Consulta>();

		System.out.print("Llego al servicio: ");
		System.out.println(filtro.getDni() + "|" + filtro.getNombreCompleto() + "|" + filtro.getFechaConsulta());
		
		if (filtro != null) {
			if (filtro.getFechaConsulta() == null) {
				consultas = servicio.buscar(filtro);
			} else {
				consultas = servicio.buscarFecha(filtro);
			}
		}
		return new ResponseEntity<List<Consulta>>(consultas, HttpStatus.OK);
	}
	
	@GetMapping(value = "/listarResumen")
	public ResponseEntity<List<ConsultaResumenDTO>> listarResumen() {
		List<ConsultaResumenDTO> consultas = new ArrayList<>();
		consultas = servicio.listarResumenOld();
		return new ResponseEntity<List<ConsultaResumenDTO>>(consultas, HttpStatus.OK);
	}
	
	/* Para generar un reporte en PDF a partir de una consulta y un archivo .jasper */
	@GetMapping(value="/generarReporte", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	private ResponseEntity<byte[]> generarReporte() {
		byte[] reporte = servicio.generarReporte();
		return new ResponseEntity<byte[]>(reporte, HttpStatus.OK);
	}
	
	
	/*Para guardar y recuperar archivos como arreglos de byte (Imagenes)*/
	
	@PostMapping(value="/guardarArchivo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Integer> guardarArchivo(@RequestParam("adjunto") MultipartFile file) throws IOException {
		
		Archivo archivoImg = new Archivo();
		archivoImg.setFiletype(file.getContentType());
		archivoImg.setFileName(file.getOriginalFilename());
		archivoImg.setContenido(file.getBytes());
		
		int respuesta = servicioArchivo.guardar(archivoImg);
		
		return new ResponseEntity<Integer>(new Integer(respuesta), HttpStatus.OK);
	}
	
	@GetMapping(value="/leerArchivo/{idArchivo}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	public ResponseEntity<byte[]> leerArchivo(@PathVariable("idArchivo") Integer idArchivo ) throws IOException {
		byte[] archivo = servicioArchivo.leerArchivo(idArchivo);
		return new ResponseEntity<byte[]>(archivo, HttpStatus.OK);
	}
	

	
}
