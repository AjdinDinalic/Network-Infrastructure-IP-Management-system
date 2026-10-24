package com.niipm.api;

import org.springframework.core.NestedExceptionUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {

    public record Problem(String error) {}

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<Problem> duplicate(DuplicateKeyException e) {
        String message = rootMessage(e);
        String friendly = message.contains("ip_addresses") ? "That address is already allocated."
                : message.contains("vlan_id") ? "That VLAN ID is already used by another network."
                : message.contains("users_email") ? "That email address is already in use."
                : "A record with the same unique value already exists.";
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new Problem(friendly));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Problem> integrity(DataIntegrityViolationException e) {
        String message = rootMessage(e);
        if (message.contains("networks_no_overlap")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new Problem("This range overlaps an existing network."));
        }
        if (message.contains("foreign key")) {
            return ResponseEntity.badRequest().body(new Problem("A referenced record does not exist."));
        }
        return ResponseEntity.badRequest().body(new Problem(firstLine(message)));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Problem> invalid(MethodArgumentNotValidException e) {
        String fields = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + " " + f.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(new Problem(fields));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Problem> badRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(new Problem(e.getMessage()));
    }

    @ExceptionHandler({NoSuchElementException.class, EmptyResultDataAccessException.class})
    public ResponseEntity<Problem> notFound(Exception e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Problem(e.getMessage()));
    }

    private static String rootMessage(Exception e) {
        String message = NestedExceptionUtils.getMostSpecificCause(e).getMessage();
        return message == null ? "" : message;
    }

    private static String firstLine(String message) {
        int newline = message.indexOf('\n');
        String line = newline < 0 ? message : message.substring(0, newline);
        return line.startsWith("ERROR: ") ? line.substring(7) : line;
    }
}
