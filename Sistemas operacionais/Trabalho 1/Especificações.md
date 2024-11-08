# Objetivo
- Criar e implementar um algoritmo para testar e comparar o tempo para a soma de um vetor com tamanho de 100 milhoes de posicoes.

# Sistema operacional escolhido
- Linux

# Como compilar o codigo:
- Rodar sudo apt-get update
- Rodar sudo apt-get install libtbb-dev
- g++ -std=c++11 -o somavetor -DTBB_AVAILABLE -fopenmp "caminho para o arquivo de código fonte .cpp” -ltbb

# Resultado:
- Tabela, desvio padrao e media dos tempos de execucao para a soma utilizando um laco for simples.
- Tabela, desvio padrao e media dos tempos de execucao para a soma utilizando OpenMP.
- Tabela, desvio padrao e media dos tempos de execucao para a soma utilizando TBB.
