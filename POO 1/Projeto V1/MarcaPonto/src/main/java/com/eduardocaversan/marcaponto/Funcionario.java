package com.eduardocaversan.marcaponto;

/**
 *
 * @author Eduardo Caversan
 */
public class Funcionario extends Usuario {

    public Funcionario(String nome, String matricula, int cargaHorariaMinima) {
        super(nome, matricula, cargaHorariaMinima);
    }

    @Override
    public void registrarPonto() {
        Ponto registro = new Ponto(getMatricula());
        adicionarRegistro(registro);
        System.out.println(getNome() + " registrou ponto em: " + registro.getDataHora());
    }
}
