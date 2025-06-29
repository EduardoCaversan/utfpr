// Eduardo Caversan da Silva Rocha - 2475391
public class Esteira extends Aparelho {
    private double velocidadeMaxima;

    public void setVelocidadeMaxima(double velocidade) {
        this.velocidadeMaxima = velocidade;
    }

    public double getVelocidadeMaxima() {
        return velocidadeMaxima;
    }

    //Sobrescrita
    @Override
    public String toString() {
        return super.toString() + " até " + velocidadeMaxima + " km/h";
    }
}