// Eduardo Caversan da Silva Rocha - 2475391
public class Supino extends Aparelho {
    private boolean ajustavel;

    public void setAjustavel(boolean ajustavel) {
        this.ajustavel = ajustavel;
    }

    public boolean isAjustavel() {
        return ajustavel;
    }

    //Sobrescrita
    @Override
    public String toString() {
        return super.toString() + (ajustavel ? " ajustável" : " fixo");
    }
}