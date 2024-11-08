// Aluno: Eduardo Caversan da Silva Rocha
// R.A: 2475391
#include <iostream>
#include <vector>
#ifdef TBB_AVAILABLE
#include <tbb/tbb.h>
#endif
#ifdef _OPENMP
#include <omp.h>
#endif
#include <chrono>
#include <cmath>
#include <numeric> // Para std::accumulate

// Funcao para gerar um vetor de tamanho de 100 milhoes de posicoes com todos os elementos iguais a 1
std::vector<int> gerarVetor(size_t tamanho) {
    return std::vector<int>(tamanho, 1);
}

// Função de soma sequencial
long long somaSequencial(const std::vector<int>& vetor) {
    long long soma = 0;
    for (int valor : vetor) {
        soma += valor;
    }
    return soma;
}

// Função de soma paralela com OpenMP
long long somaOpenMP(const std::vector<int>& vetor) {
    long long soma = 0;
    #pragma omp parallel for reduction(+:soma)
    for (size_t i = 0; i < vetor.size(); ++i) {
        soma += vetor[i];
    }
    return soma;
}

// Função de soma paralela com TBB
long long somaTBB(const std::vector<int>& vetor) {
    #ifdef TBB_AVAILABLE
    return tbb::parallel_reduce(
        tbb::blocked_range<size_t>(0, vetor.size()), 0LL,
        [&](const tbb::blocked_range<size_t>& r, long long soma_parcial) {
            for (size_t i = r.begin(); i != r.end(); ++i) {
                soma_parcial += vetor[i];
            }
            return soma_parcial;
        },
        std::plus<long long>()
    );
    #else
    std::cerr << "Erro: A lib TBB nao esta instalada, rode 'sudo apt-get install libtbb-dev'\n";
    return 0;
    #endif
}

// Funcao para calcular a media e o desvio padrao dos tempos
void calcularEstatisticas(const std::vector<double>& tempos, double& media, double& desvio_padrao) {
    media = std::accumulate(tempos.begin(), tempos.end(), 0.0) / tempos.size();
    desvio_padrao = std::sqrt(std::accumulate(tempos.begin(), tempos.end(), 0.0, 
                    [media](double acumulador, double tempo) { return acumulador + (tempo - media) * (tempo - media); }) / tempos.size());
}

// Funcao para executar e medir o tempo de cada abordagem
void executarTeste(const std::vector<int>& vetor, const std::string& metodo, long long (*funcaoSoma)(const std::vector<int>&)) {
    std::vector<double> tempos;
    double media, desvio_padrao;
    
    for (int i = 0; i < 30; ++i) {
        auto inicio = std::chrono::high_resolution_clock::now();
        long long soma = funcaoSoma(vetor);
        auto fim = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double> duracao = fim - inicio;
        
        tempos.push_back(duracao.count());
        
        std::cout << "Execucao " << (i + 1) << ": " << duracao.count() << " segundos\n";
    }

    calcularEstatisticas(tempos, media, desvio_padrao);
    std::cout << "Tempo medio (" << metodo << "): " << media << " segundos\n";
    std::cout << "Desvio padrao (" << metodo << "): " << desvio_padrao << " segundos\n\n";
}

int main() {
    const size_t tamanhoVetor = 100000000;
    std::vector<int> vetor = gerarVetor(tamanhoVetor);

    std::cout << "Executando abordagem: Sequencial\n";
    executarTeste(vetor, "Sequencial", somaSequencial);

    #ifdef _OPENMP
    std::cout << "Executando abordagem: OpenMP\n";
    executarTeste(vetor, "OpenMP", somaOpenMP);
    #endif

    #ifdef TBB_AVAILABLE
    std::cout << "Executando abordagem: TBB\n";
    executarTeste(vetor, "TBB", somaTBB);
    #endif

    return 0;
}
