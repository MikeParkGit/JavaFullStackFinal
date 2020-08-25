package com.mitocode.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="signo")
public class Signo {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer idSigno;
	
	@Column(name = "temperatura", nullable=true)
	private String temperatura;
	
	@Column(name = "pulso", nullable=true)
	private String pulso;
	
	@Column(name = "ritmoRespiratorio", nullable=true)
	private String ritmoRespiratorio;
	
	@Column(name="fecha", nullable=false)
	private LocalDateTime fecha;

	@ManyToOne
	@JoinColumn(name="id_paciente", nullable=false, foreignKey=@ForeignKey(name="FK_signos_paciente"))
	private Paciente paciente;
	
	
	public Integer getIdSigno() {
		return idSigno;
	}

	public void setIdSigno(Integer idSigno) {
		this.idSigno = idSigno;
	}

	public String getTemperatura() {
		return temperatura;
	}

	public void setTemperatura(String temperatura) {
		this.temperatura = temperatura;
	}

	public String getPulso() {
		return pulso;
	}

	public void setPulso(String pulso) {
		this.pulso = pulso;
	}

	public String getRitmoRespiratorio() {
		return ritmoRespiratorio;
	}

	public void setRitmoRespiratorio(String ritmoRespiratorio) {
		this.ritmoRespiratorio = ritmoRespiratorio;
	}

	public LocalDateTime getFecha() {
		return fecha;
	}

	public void setFecha(LocalDateTime fecha) {
		this.fecha = fecha;
	}

	public Paciente getPaciente() {
		return paciente;
	}

	public void setPaciente(Paciente paciente) {
		this.paciente = paciente;
	}
	
	
}
