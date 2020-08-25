package com.mitocode.dto;



public class PacienteSignosVitalesDTO {

	private Integer id_paciente; 
	
	private String  nombres;

	private String  apellidos;
	
	private Integer id_signo;

	private String  fecha;

	private String  pulso;

	private String  ritmo_respiratorio;

	private String  temperatura;
	
	
	public Integer getId_paciente() {
		return id_paciente;
	}
	public void setId_paciente(Integer id_paciente) {
		this.id_paciente = id_paciente;
	}
	public String getNombres() {
		return nombres;
	}
	public void setNombres(String nombres) {
		this.nombres = nombres;
	}
	public String getApellidos() {
		return apellidos;
	}
	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}
	public Integer getId_signo() {
		return id_signo;
	}
	public void setId_signo(Integer id_signo) {
		this.id_signo = id_signo;
	}
	public String getFecha() {
		return fecha;
	}
	public void setFecha(String fecha) {
		this.fecha = fecha;
	}
	public String getPulso() {
		return pulso;
	}
	public void setPulso(String pulso) {
		this.pulso = pulso;
	}
	public String getRitmo_respiratorio() {
		return ritmo_respiratorio;
	}
	public void setRitmo_respiratorio(String ritmo_respiratorio) {
		this.ritmo_respiratorio = ritmo_respiratorio;
	}
	public String getTemperatura() {
		return temperatura;
	}
	public void setTemperatura(String temperatura) {
		this.temperatura = temperatura;
	}
	
	
}
