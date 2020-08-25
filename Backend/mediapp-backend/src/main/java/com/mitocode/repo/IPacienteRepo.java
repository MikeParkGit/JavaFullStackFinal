package com.mitocode.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mitocode.model.Paciente;

//@Repository  - Opcional porque se esta heredando de JpaRepository

public interface IPacienteRepo extends IGenericRepo<Paciente, Integer>{

}
