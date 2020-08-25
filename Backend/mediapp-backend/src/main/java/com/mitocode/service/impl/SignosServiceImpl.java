package com.mitocode.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mitocode.dto.PacienteSignosVitalesDTO;
import com.mitocode.model.Signo;
import com.mitocode.repo.IGenericRepo;
import com.mitocode.repo.ISignosRepo;
import com.mitocode.service.ISignosService;

@Service
public class SignosServiceImpl extends CRUDImpl<Signo, Integer> implements ISignosService {

	@Autowired
	private ISignosRepo repo;
	
	@Override
	protected IGenericRepo<Signo, Integer> getRepo() {
		return repo;
	}

	@Override
	public List<PacienteSignosVitalesDTO> listarPacientesSignosVitales() {
		
		List<PacienteSignosVitalesDTO> lstPacientesSignosVitales = new ArrayList<>();
		List<Object[]> lstObj = repo.listarPacientesSignosVitales();
		
		lstObj.forEach(elem -> {
			PacienteSignosVitalesDTO psv = new PacienteSignosVitalesDTO();
			psv.setId_paciente(Integer.parseInt(String.valueOf(elem[0])));
			psv.setNombres(String.valueOf(elem[1]));
			psv.setApellidos(String.valueOf(elem[2]));
			psv.setId_signo(Integer.parseInt(String.valueOf(elem[3])));
			psv.setFecha(String.valueOf(elem[4]));
			psv.setPulso(String.valueOf(elem[5]));
			psv.setRitmo_respiratorio(String.valueOf(elem[6]));
			psv.setTemperatura(String.valueOf(elem[7]));
			
			lstPacientesSignosVitales.add(psv);
		});
		
		return lstPacientesSignosVitales;
	}

	


}
