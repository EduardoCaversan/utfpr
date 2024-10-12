package com.eduardocaversan.marcaponto;

import java.util.List;

/**
 *
 * @author Eduardo Caversan
 */
public class Gerente extends Usuario {

    public Gerente(String nome, String matricula, int cargaHorariaMinima) {
        super(nome, matricula, cargaHorariaMinima);
    }

    @Override
    public void registrarPonto() {
        Ponto registro = new Ponto(getMatricula());
        adicionarRegistro(registro);
        System.out.println(getNome() + " (Gerente) registrou ponto em: " + registro.getDataHora());
    }

    public void consultarSaldoHoras(List<Usuario> usuarios) {
        System.out.println("Consultando saldo de horas dos funcionarios:");
        for (Usuario usuario : usuarios) {
            int saldoHoras = usuario.calcularSaldoHoras();
            System.out.println("Funcionario: " + usuario.getNome());
            System.out.println("Carga Horaria Minima: " + usuario.getCargaHorariaMinima() + " horas");
            System.out.println("Saldo de Horas: " + saldoHoras + " horas");
            System.out.println("================================");
        }
    }
}
