// Eduardo Caversan da Silva Rocha - 2475391
public class Aparelho {
    private String marca;
    private String modelo;
    private String grupoMuscular;

    public Aparelho() {}

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public void setGrupoMuscular(String grupoMuscular) {
        this.grupoMuscular = grupoMuscular;
    }

    public String getMarca() {
        return marca;
    }

    public String getModelo() {
        return modelo;
    }

    public String getGrupoMuscular() {
        return grupoMuscular;
    }

    //Sobrescrita
    @Override
    public String toString() {
        return marca + " - " + modelo ;
    }
}