package com.mitocode.service;

import java.util.List;

import com.mitocode.dto.PacienteSignosVitalesDTO;
import com.mitocode.model.Signo;

public interface ISignosService extends ICRUD<Signo, Integer> {
	
	public  List<PacienteSignosVitalesDTO> listarPacientesSignosVitales();

}
