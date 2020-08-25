package com.mitocode.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class FiltroConsultaDTO {
	
	private String dni;
	private String nombreCompleto;
	private LocalDateTime fechaConsultaLD;
	private String fechaConsulta;
	
	public String getDni() {
		return dni;
	}
	public void setDni(String dni) {
		this.dni = dni;
	}
	public String getNombreCompleto() {
		return nombreCompleto;
	}
	public void setNombreCompleto(String nombreCompleto) {
		this.nombreCompleto = nombreCompleto;
	}
	public String getFechaConsulta() {
		return fechaConsulta;
	}
	public void setFechaConsulta(String fechaConsulta) {
		
		if (!fechaConsulta.trim().equals("Invalid date")) { 
			this.fechaConsulta = fechaConsulta.replace('T', ' ');
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			this.fechaConsultaLD = LocalDateTime.parse(this.fechaConsulta, formatter);
		}
	}
	
	public LocalDateTime getFechaConsultaLD() {
		return fechaConsultaLD;
	}
	
	

}
