// Eduardo Caversan da Silva Rocha - 2475391
import java.util.ArrayList;
import java.util.List;

public class BDEsteira implements BDInterface<Esteira> {
    private final ArrayList<Esteira> lista = new ArrayList<>();
    private static BDEsteira instancia;

    //MÉTODO SINGLETON
    public static BDEsteira getInstance() {
        if (instancia == null) 
            instancia = new BDEsteira();
        return instancia;
    }

    //Sobrescrita
    @Override
    public void adicionar(Esteira obj) {
        lista.add(obj);
    }

    //Sobrescrita
    @Override
    public void atualizar(int indice, Esteira obj) {
        if (indice >= 0 && indice < lista.size()) {
            lista.set(indice, obj);
        }
    }

    @Override
    public void remover(int indice) {
        if (indice >= 0 && indice < lista.size()) {
            lista.remove(indice);
        }
    }

    //Sobrescrita
    @Override
    public List<Esteira> listar() {
        return lista;
    }

    //Sobrescrita
    @Override
    public Esteira get(int indice) {
        return lista.get(indice);
    }
}