// Eduardo Caversan da Silva Rocha - 2475391
public class CampoObrigatorioException extends Exception {
    public CampoObrigatorioException(String campo) {
        super("O campo '" + campo + "' é obrigatório.");
    }
}