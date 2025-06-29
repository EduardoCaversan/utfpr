// Eduardo Caversan da Silva Rocha - 2475391
import java.util.ArrayList;
import java.util.List;

public class BDSupino implements BDInterface<Supino> {
    private final ArrayList<Supino> lista = new ArrayList<>();
    private static BDSupino instancia;

    //MÉTODO SINGLETON
    public static BDSupino getInstance() {
        if (instancia == null) 
            instancia = new BDSupino();
        return instancia;
    }

    //Sobrescrita
    @Override
    public void adicionar(Supino obj) {
        lista.add(obj);
    }

    //Sobrescrita
    @Override
    public void atualizar(int indice, Supino obj) {
        if (indice >= 0 && indice < lista.size()) {
            lista.set(indice, obj);
        }
    }

    //Sobrescrita
    @Override
    public void remover(int indice) {
        if (indice >= 0 && indice < lista.size()) {
            lista.remove(indice);
        }
    }

    //Sobrescrita
    @Override
    public List<Supino> listar() {
        return lista;
    }

    //Sobrescrita
    @Override
    public Supino get(int indice) {
        return lista.get(indice);
    }
}