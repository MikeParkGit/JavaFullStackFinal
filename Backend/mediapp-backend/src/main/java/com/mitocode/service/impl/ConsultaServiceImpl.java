package com.mitocode.service.impl;



import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mitocode.dto.ConsultaListaExamenDTO;
import com.mitocode.dto.ConsultaResumenDTO;
import com.mitocode.dto.FiltroConsultaDTO;
import com.mitocode.model.Consulta;
import com.mitocode.repo.IConsultaExamenRepo;
import com.mitocode.repo.IConsultaRepo;
import com.mitocode.repo.IGenericRepo;
import com.mitocode.service.IConsultaService;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;


@Service
public class ConsultaServiceImpl extends CRUDImpl<Consulta, Integer> implements IConsultaService {

	@Autowired
	private IConsultaRepo repo;
	
	@Autowired
	private IConsultaExamenRepo ceRepo; 
	
	@Override
	protected IGenericRepo<Consulta, Integer> getRepo() {
		return repo;
	}

	@Override
	public Consulta registrarTransaccional(Consulta consulta) throws Exception {
		/*for(DetalleConsulta det: consulta.getDetalleConsulta()) {
			det.setConsulta(consulta)
		}*/
		consulta.getDetalleConsulta().forEach(det -> det.setConsulta(consulta));
		repo.save(consulta);
		return null;
	}
	

	@Transactional
	@Override
	public Consulta registrarTransaccionalBis(ConsultaListaExamenDTO dto) throws Exception {
		
		dto.getConsulta().getDetalleConsulta().forEach(det -> det.setConsulta(dto.getConsulta()));
		repo.save(dto.getConsulta());
		dto.getLstExamen().forEach(exa -> ceRepo.registrar(dto.getConsulta().getIdConsulta() , exa.getIdExamen()));
		 
		return dto.getConsulta();

	}

	@Override
	public List<Consulta> buscar(FiltroConsultaDTO filtroConsultaDTO) {
		System.out.println("Entro a buscar...");
		return repo.buscar(filtroConsultaDTO.getDni(), filtroConsultaDTO.getNombreCompleto());
	}

	@Override
	public List<Consulta> buscarFecha(FiltroConsultaDTO filtroConsultaDTO) {
		System.out.println("Entro a buscar fecha...");
		return repo.buscarFecha(filtroConsultaDTO.getFechaConsultaLD(), filtroConsultaDTO.getFechaConsultaLD().plusDays(1));
	}

	@Override
	public List<ConsultaResumenDTO> listarResumen() {
		//cantidad		fecha		
		//[1,		"03/07/2020"]
		//[6,		"04/07/2020"]
		//[1,		"13/06/2020"]
		//[1,		"27/06/2020"]
		List<ConsultaResumenDTO> consultas = new ArrayList<>();
		repo.listarResumen().forEach(reg -> {					//Regresa un List<Object[]>
			ConsultaResumenDTO cr = new ConsultaResumenDTO();
			cr.setCantidad(Integer.parseInt(String.valueOf(reg[0])));
			cr.setFecha(String.valueOf(reg[1]));
			consultas.add(cr);
		});
		return consultas;
	}
	
	/** Para comparar la diferencia entre hacerlo con ciclos for como habría sido anteriormente,
	 *  contra usar streams utilizados a partir de java 8 en el método de arriba
	 **/
	public List<ConsultaResumenDTO> listarResumenOld() {
		//cantidad		fecha		
		//[1,		"03/07/2020"]
		//[6,		"04/07/2020"]
		//[1,		"13/06/2020"]
		//[1,		"27/06/2020"]
		
		List<ConsultaResumenDTO> consultas = new ArrayList<>();
		List<Object[]> lstResultado = repo.listarResumen();			//Regresa un List<Object[]>
		Object[] objArray = null;
 		for (int i = 0; i<lstResultado.size();i++) {
 			objArray = lstResultado.get(i);
			for (int j = 0; j < objArray.length; j++) {
				ConsultaResumenDTO cr = new ConsultaResumenDTO();
				cr.setCantidad(Integer.valueOf(String.valueOf(objArray[j])));
				j++;
				cr.setFecha(String.valueOf(objArray[j]));
				consultas.add(cr);
			}
		}
		return consultas;
	}

	/**
	 * Sirve para generar un reporte. Lee el archivo.jasper que contiene la plantilla, ejecuta una consulta para llenar 
	 * la plantilla y regresa el resultado en forma de arreglo de bytes
	 */
	@Override
	public byte[] generarReporte() {
		byte[] data = null;
		Map<String, Object> parametros = new HashMap<>();
		parametros.put("txt_titulo", "Titulo de prueba");
		try {
			File file = new ClassPathResource("/reports/consultas.jasper").getFile();
			JasperPrint print = JasperFillManager.fillReport(file.getPath(), 
															 parametros, 
															 new JRBeanCollectionDataSource(this.listarResumen()));
			data = JasperExportManager.exportReportToPdf(print);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return data;
	}
	
	

}
