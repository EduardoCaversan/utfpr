package com.eduardocaversan.marcaponto;

import java.util.List;
import java.util.Scanner;

/**
 *
 * @author Eduardo Caversan
 */
public class MarcaPonto {

    private List<Usuario> usuarios;
    private Scanner scanner;

    public MarcaPonto() {
        usuarios = new GeradorDados().gerarUsuarios(3, 3);
        scanner = new Scanner(System.in);
    }

    public void mostrarMenu() {
        System.out.println("=== Sistema de Controle de Ponto ===");
        System.out.println("1. Registrar Ponto");
        System.out.println("2. Consultar Saldo de Horas de Todos os Funcionarios");
        System.out.println("3. Consultar Saldo de Horas de Funcionario Especifico");
        System.out.println("4. Sair");
        System.out.print("Escolha uma opcao: ");
    }

    public void registrarPontos() {
        System.out.println("Selecione o numero do usuario:");
        for (int i = 0; i < usuarios.size(); i++) {
            System.out.println(i + ": " + usuarios.get(i).getNome() + " - " + usuarios.get(i).getMatricula());
        }

        int escolha = scanner.nextInt();
        if (escolha >= 0 && escolha < usuarios.size()) {
            usuarios.get(escolha).registrarPonto();
        } else {
            System.out.println("Usuario invalido.");
        }
    }

    public void consultarSaldoHoras() {
        for (Usuario usuario : usuarios) {
            int saldoHoras = usuario.calcularSaldoHoras();
            System.out.println("Funcionario: " + usuario.getNome());
            System.out.println("Carga Horaria Minima: " + usuario.getCargaHorariaMinima() + " horas");
            System.out.println("Saldo de Horas: " + saldoHoras + " horas");
            System.out.println("================================");
        }
    }

    public void consultarSaldoHorasFuncionarioEspecifico() {
        System.out.println("Selecione o numero do funcionario:");
        for (int i = 0; i < usuarios.size(); i++) {
            if (usuarios.get(i) instanceof Funcionario) {
                System.out.println(i + ": " + usuarios.get(i).getNome());
            }
        }

        int escolha = scanner.nextInt();
        if (escolha >= 0 && escolha < usuarios.size() && usuarios.get(escolha) instanceof Funcionario) {
            Usuario funcionario = usuarios.get(escolha);
            int saldoHoras = funcionario.calcularSaldoHoras();
            System.out.println("Funcionario: " + funcionario.getNome());
            System.out.println("Carga Horaria Minima: " + funcionario.getCargaHorariaMinima() + " horas");
            System.out.println("Saldo de Horas: " + saldoHoras + " horas");
        } else {
            System.out.println("Funcionario invalido.");
        }
    }

    public void executar() {
        boolean executando = true;
        while (executando) {
            mostrarMenu();
            int opcao = scanner.nextInt();
            switch (opcao) {
                case 1 -> registrarPontos();
                case 2 -> consultarSaldoHoras();
                case 3 -> consultarSaldoHorasFuncionarioEspecifico();
                case 4 -> {
                    executando = false;
                    System.out.println("Saindo do sistema...");
                }
                default -> System.out.println("Opcao invalida. Tente novamente.");
            }
        }
    }

    public static void main(String[] args) {
        MarcaPonto sistema = new MarcaPonto();
        sistema.executar();
    }
}