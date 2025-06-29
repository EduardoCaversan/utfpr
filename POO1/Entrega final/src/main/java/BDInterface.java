// Eduardo Caversan da Silva Rocha - 2475391
import java.util.List;

public interface BDInterface<T> {
    void adicionar(T obj);
    void atualizar(int indice, T obj);
    void remover(int indice);
    List<T> listar();
    T get(int indice);
}