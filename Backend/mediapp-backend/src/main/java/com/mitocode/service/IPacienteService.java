package com.mitocode.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mitocode.model.Paciente;

/* Declara las operaciones CRUD a implementar/Utilizar */

public interface IPacienteService extends ICRUD<Paciente, Integer> {


	public Page<Paciente> listarPaginado(Pageable pageable);
}
