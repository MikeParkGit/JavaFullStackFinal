package com.mitocode.repo;




import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mitocode.model.Consulta;

//@Repository
public interface IConsultaRepo extends IGenericRepo<Consulta, Integer>{
	
	@Query("FROM Consulta c WHERE c.paciente.dni = :dni OR LOWER(c.paciente.nombres) LIKE %:nombreCompleto% OR LOWER(c.paciente.apellidos) LIKE %:nombreCompleto%")
	public  List<Consulta> buscar (@Param("dni") String dni, String nombreCompleto);
	
	@Query("FROM Consulta c WHERE c.fecha BETWEEN :fechaIni AND :fechaFin")
	public  List<Consulta> buscarFecha(@Param("fechaIni")LocalDateTime fechaIni, @Param("fechaFin")LocalDateTime fechaFin) ;

	//Llamada a un stored procedure (depende de como se ejecutan los sp en cada BD)
	@Query(value="select * from fn_listarResumen()", nativeQuery=true)
	public List<Object[]> listarResumen();		//Lo mas recomendado porque JPA asi es como mejor lo reconoce, poner un bean especifico obligaria a que sea 
												// una clase estereotipada con @Entity o alguna otra forma para que Spring JPA pueda convertir el resultado
	
}
