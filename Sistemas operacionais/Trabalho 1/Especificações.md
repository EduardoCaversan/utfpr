# Objetivo
- Criar e implementar um algoritmo para testar e comparar o tempo para a soma de um vetor com tamanho de 100 milhões de posições.

# Sistema operacional escolhido
- Linux

# Como compilar o código:
- Rodar sudo apt-get update
- Rodar sudo apt-get install libtbb-dev
- g++ -std=c++11 -o somavetor -DTBB_AVAILABLE -fopenmp "caminho para o arquivo de código fonte .cpp” -ltbb

# Resultado:
- Tabela, desvio padrão e média dos tempos de execução para a soma utilizando um laço for simples.
- Tabela, desvio padrão e média dos tempos de execução para a soma utilizando OpenMP.
- Tabela, desvio padrão e média dos tempos de execução para a soma utilizando TBB.
