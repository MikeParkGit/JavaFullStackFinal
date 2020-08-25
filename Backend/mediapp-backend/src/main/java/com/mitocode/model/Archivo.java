package com.mitocode.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="archivo")
public class Archivo {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer idArchivo;
	
	@Column(name="fileName", length=50)
	private String fileName;
	
	@Column(name="fileType", length=15)
	private String filetype;
	
	@Column(name="contenido")
	private byte[] contenido;		//Tipo utilizado para almacenar una imagen (arreglo de bytes)

	public Integer getIdArchivo() {
		return idArchivo;
	}

	public void setIdArchivo(Integer idArchivo) {
		this.idArchivo = idArchivo;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFiletype() {
		return filetype;
	}

	public void setFiletype(String filetype) {
		this.filetype = filetype;
	}

	public byte[] getContenido() {
		return contenido;
	}

	public void setContenido(byte[] contenido) {
		this.contenido = contenido;
	}
	
	
}
