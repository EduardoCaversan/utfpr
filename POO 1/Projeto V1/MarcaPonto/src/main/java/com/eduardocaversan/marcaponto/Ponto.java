package com.eduardocaversan.marcaponto;

import java.time.LocalDateTime;

/**
 *
 * @author Eduardo Caversan
 */
public class Ponto {

    private LocalDateTime dataHora;
    private String matricula;

    public Ponto(String matricula) {
        this.dataHora = LocalDateTime.now();
        this.matricula = matricula;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public String getMatricula() {
        return matricula;
    }

    @Override
    public String toString() {
        return "Registro de Ponto: " + matricula + " - " + dataHora;
    }
}
