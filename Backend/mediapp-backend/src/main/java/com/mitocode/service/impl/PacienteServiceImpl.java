package com.mitocode.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mitocode.model.Paciente;
import com.mitocode.repo.IGenericRepo;
import com.mitocode.repo.IPacienteRepo;
import com.mitocode.service.IPacienteService;

@Service
public class PacienteServiceImpl extends CRUDImpl<Paciente, Integer> implements IPacienteService {
												// La razon por la que se implementa IPacienteService es para que se pueda inyectar en el controlador 
	@Autowired
	private IPacienteRepo repo;
	
	protected IGenericRepo<Paciente, Integer> getRepo() {
		return repo;
	}

	@Override
	public Page<Paciente> listarPaginado(Pageable pageable) {
		return repo.findAll(pageable);
	}

	
}
