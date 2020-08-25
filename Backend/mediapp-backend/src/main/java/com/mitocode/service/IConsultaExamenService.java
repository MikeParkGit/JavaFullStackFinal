package com.mitocode.service;

import java.util.List;

import com.mitocode.model.ConsultaExamen;
import com.mitocode.model.Medico;

public interface IConsultaExamenService  {

	List<ConsultaExamen> listarExamenesPorconsulta(Integer idConsulta);
}
