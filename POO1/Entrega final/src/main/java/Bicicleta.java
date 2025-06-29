// Eduardo Caversan da Silva Rocha - 2475391
public class Bicicleta extends Aparelho {
    private boolean temMonitorCardiaco;

    public void setTemMonitorCardiaco(boolean valor) {
        this.temMonitorCardiaco = valor;
    }

    public boolean isTemMonitorCardiaco() {
        return temMonitorCardiaco;
    }

    //Sobrescrita
    @Override
    public String toString() {
        return super.toString() + (temMonitorCardiaco ? " com Monitor" : " sem Monitor");
    }
}