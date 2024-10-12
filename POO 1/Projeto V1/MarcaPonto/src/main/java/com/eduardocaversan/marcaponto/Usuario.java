package com.eduardocaversan.marcaponto;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Eduardo Caversan
 */
public abstract class Usuario {

    private String nome;
    private String matricula;
    private List<Ponto> registros;
    private int cargaHorariaMinima;

    public Usuario(String nome, String matricula, int cargaHorariaMinima) {
        this.nome = nome;
        this.matricula = matricula;
        this.registros = new ArrayList<>();
        this.cargaHorariaMinima = cargaHorariaMinima;
    }

    public abstract void registrarPonto();

    public String getNome() {
        return nome;
    }

    public String getMatricula() {
        return matricula;
    }

    public List<Ponto> getRegistros() {
        return registros;
    }

    protected void adicionarRegistro(Ponto registro) {
        registros.add(registro);
    }

    public int getCargaHorariaMinima() {
        return cargaHorariaMinima;
    }

    public int calcularSaldoHoras() {
        return registros.size();
    }
}
