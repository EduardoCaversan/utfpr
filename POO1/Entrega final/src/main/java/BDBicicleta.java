// Eduardo Caversan da Silva Rocha - 2475391
import java.util.ArrayList;
import java.util.List;

public class BDBicicleta implements BDInterface<Bicicleta> {

    private final ArrayList<Bicicleta> lista = new ArrayList<>();
    private static BDBicicleta instancia;

    //MÉTODO SINGLETON
    public static BDBicicleta getInstance() {
        if (instancia == null) {
            instancia = new BDBicicleta();
        }
        return instancia;
    }

    //Sobrescrita
    @Override
    public void adicionar(Bicicleta obj) {
        lista.add(obj);
    }

    //Sobrescrita
    @Override
    public void atualizar(int indice, Bicicleta obj) {
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
    public List<Bicicleta> listar() {
        return lista;
    }

    //Sobrescrita
    @Override
    public Bicicleta get(int indice) {
        return lista.get(indice);
    }
}
