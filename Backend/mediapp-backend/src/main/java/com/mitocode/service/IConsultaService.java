package com.mitocode.service;

import java.util.List;

import com.mitocode.dto.ConsultaListaExamenDTO;
import com.mitocode.dto.ConsultaResumenDTO;
import com.mitocode.dto.FiltroConsultaDTO;
import com.mitocode.model.Consulta;


public interface IConsultaService extends ICRUD<Consulta, Integer> {

	public Consulta registrarTransaccional(Consulta consulta) throws Exception;
	
	public Consulta registrarTransaccionalBis(ConsultaListaExamenDTO dto) throws Exception;
	
	public List<Consulta> buscar(FiltroConsultaDTO filtroConsultaDTO);
	
	//public List<Consulta> buscarFecha();
	public List<Consulta> buscarFecha(FiltroConsultaDTO filtroConsultaDTO);
	
	public List<ConsultaResumenDTO> listarResumen();
	public List<ConsultaResumenDTO> listarResumenOld();	
	
	
	public byte[] generarReporte();
}
