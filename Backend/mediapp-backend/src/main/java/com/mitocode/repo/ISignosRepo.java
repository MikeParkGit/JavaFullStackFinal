package com.mitocode.repo;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

import com.mitocode.model.Signo;

public interface ISignosRepo extends IGenericRepo<Signo, Integer> {

	@Query(value="SELECT p.id_paciente, p.nombres, p.apellidos, s.id_signo, s.fecha, s.pulso, s.ritmo_respiratorio, s.temperatura " +
			" FROM paciente p, signo s " + 
			" WHERE p.id_paciente = s.id_paciente " +
			" ORDER BY p.apellidos, s.fecha", nativeQuery=true)
	public  List<Object[]> listarPacientesSignosVitales() ;
}
