package com.mitocode.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mitocode.model.ConsultaExamen;
import com.mitocode.service.IConsultaExamenService;

@RestController
@RequestMapping("/consultaexamenes")
public class ConsultaExamenController {
	
	@Autowired
	private IConsultaExamenService servicio;

	@GetMapping("/{idConsulta}")
	public ResponseEntity<List<ConsultaExamen>> listar(@PathVariable("idConsulta") Integer idConsulta) { 
		System.out.println("Llega al ConsultaExamenController.listar con " + idConsulta);
		List<ConsultaExamen> consultaExamen = new ArrayList<ConsultaExamen>();
		consultaExamen = servicio.listarExamenesPorconsulta(idConsulta);
		return new ResponseEntity<List<ConsultaExamen>>(consultaExamen, HttpStatus.OK);
	}
}
