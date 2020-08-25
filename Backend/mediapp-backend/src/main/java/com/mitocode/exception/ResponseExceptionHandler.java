package com.mitocode.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/*
 * El objetivo de esta clase es centralizar toda la lógica de las excepciones para evitar estar utilizando 
 * try-catch de otras clases.
 */

@ControllerAdvice		//Para que esta clase pueda interceptar los errores que suceden en las otras clases
@RestController
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler {

	String mensaje = "";
	/* Declaracion de Excepciones manejadas*/
	@ExceptionHandler(ModeloNotFoundException.class)
	public final ResponseEntity<ExceptionResponse> manejarModeloException(ModeloNotFoundException ex, WebRequest request) {
		ExceptionResponse exResp = 
					new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false));
		return new ResponseEntity<ExceptionResponse>(exResp, HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(Exception.class)	//Para manejar cualquier excepcion que se nos haya pasado 
	public final ResponseEntity<ExceptionResponse> manejarOtrasExcepciones(Exception ex, WebRequest request) {
		ex.printStackTrace();
		ExceptionResponse exResp = 
					new ExceptionResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false));
		return new ResponseEntity<ExceptionResponse>(exResp, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	
	/* Metodos sobre escritos de ResponseEntityExceptionHandler*/
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		
		ex.getBindingResult().getAllErrors().forEach(e -> { mensaje += e.getDefaultMessage() + "\n";});
		ExceptionResponse exResp = new ExceptionResponse(LocalDateTime.now(), mensaje, request.getDescription(false));
		
		return new ResponseEntity<Object>(exResp, HttpStatus.BAD_REQUEST);
	}
	
	
	
}
