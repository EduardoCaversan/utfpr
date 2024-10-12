package com.eduardocaversan.marcaponto;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 *
 * @author Eduardo Caversan
 */
public class GeradorDados {

    private static final String[] NOME_FUNCIONARIOS = {"Alice", "Carlos", "Diana", "Eduardo", "Fernanda"};
    private static final String[] NOME_GERENTES = {"Bob", "Laura", "Rafael", "Sofia"};

    private Random random;

    public GeradorDados() {
        this.random = new Random();
    }

    public List<Usuario> gerarUsuarios(int numFuncionarios, int numGerentes) {
        List<Usuario> usuarios = new ArrayList<>();

        for (int i = 0; i < numFuncionarios; i++) {
            String nome = NOME_FUNCIONARIOS[random.nextInt(NOME_FUNCIONARIOS.length)];
            String matricula = "F" + String.format("%03d", i + 1);
            int cargaHorariaMinima = random.nextInt(4) + 5;
            usuarios.add(new Funcionario(nome, matricula, cargaHorariaMinima));
        }

        for (int i = 0; i < numGerentes; i++) {
            String nome = NOME_GERENTES[random.nextInt(NOME_GERENTES.length)];
            String matricula = "G" + String.format("%03d", i + 1);
            int cargaHorariaMinima = random.nextInt(4) + 5;
            usuarios.add(new Gerente(nome, matricula, cargaHorariaMinima));
        }

        return usuarios;
    }
}