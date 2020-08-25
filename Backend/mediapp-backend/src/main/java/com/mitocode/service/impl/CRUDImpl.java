package com.mitocode.service.impl;

import java.util.List;
import java.util.Optional;


import com.mitocode.repo.IGenericRepo;
import com.mitocode.service.ICRUD;

public abstract class CRUDImpl<T, ID> implements ICRUD<T, ID> {
	
	protected abstract IGenericRepo<T, ID> getRepo();
	
	@Override
	public T registrar(T obj) {
		return getRepo().save(obj);
	}

	@Override
	public T modificar(T obj) {
		return getRepo().save(obj);
	}

	@Override
	public List<T> listar() {
		return getRepo().findAll();
	}
	
	@Override
	public void eliminar(ID id) {
		getRepo().deleteById(id);
		
	}
	
	@Override
	public T listarPorId(ID id) {
		return getRepo().findById(id).orElse(null);
	}


}
