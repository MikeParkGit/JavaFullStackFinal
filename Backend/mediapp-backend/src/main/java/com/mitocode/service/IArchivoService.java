package com.mitocode.service;

import com.mitocode.model.Archivo;


public interface IArchivoService {

	public int guardar(Archivo archivo);
	public byte[] leerArchivo(Integer idArchivo);
	
}
