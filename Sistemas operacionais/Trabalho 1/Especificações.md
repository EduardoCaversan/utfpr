
# T1: Implementação de Concorrência e Sincronização em Sistemas Operacionais

# Objetivo: Desenvolver um programa que simule um cenário de concorrência entre múltiplos processos ou threads, onde os alunos devem implementar mecanismos de sincronização para garantir a integridade dos dados compartilhados e prevenir problemas como condições de corrida e deadlocks.

# Parte 1: Simulação de Concorrência
- Desenvolver um programa que simule múltiplos processos ou threads concorrentes.
- O cenário pode ser baseado em um dos problemas clássicos de concorrência, como o Problema Produtor-Consumidor ou o Problema dos Leitores-Escritores.
- Os processos ou threads devem compartilhar um recurso comum (como um buffer ou uma variável compartilhada).

# Requisitos:
- Implementar processos ou threads concorrentes (mínimo de 3).
- Simular acesso concorrente ao recurso compartilhado.
- Utilizar um mecanismo de exclusão mútua, como locks ou semaforos, para controlar o acesso à seção crítica.

# Parte 2: Sincronização com Semáforos e Locks
- Garantir a integridade dos dados compartilhados implementando um mecanismo de sincronização.
- Usar semaforos ou locks para garantir que apenas um processo ou thread acesse a seção crítica por vez.
- Implementar um controle que evite condições de corrida.

# Requisitos:
- Implementar corretamente a sincronização com semáforos binários ou locks.
- O programa deve evitar condições de corrida e manter a consistência dos dados compartilhados.

# Parte 3: Prevenção de Deadlocks
- Adicionar uma lógica de prevenção de deadlocks no código.
- Os alunos devem implementar uma estratégia para evitar deadlocks, como a aplicação de uma ordem fixa para a aquisição de locks ou semáforos, ou outra técnica de prevenção.

# Requisitos:
- Implementar uma solução que garanta que não ocorrerão deadlocks.
- Demonstrar o uso de uma estratégia de prevenção, como evitar espera circular ou liberar recursos antes de tentar adquirir novos recursos.

# Deve ser entregue:
- Código-fonte comentado do programa.
- Um relatório explicando o funcionamento do programa, com detalhes sobre a implementação de concorrência, sincronização e prevenção de deadlocks.
- Exemplo de execução e teste do programa com resultados, mostrando como o programa lida com a concorrência e como a sincronização foi implementada.

# Critérios de Avaliação:
- Implementação correta da concorrência entre processos ou threads.
- Uso adequado de mecanismos de sincronização, como semáforos ou locks.
- Implementação de uma estratégia eficaz de prevenção de deadlocks.
- Qualidade e clareza do código-fonte.
- Clareza e completude do relatório entregue.
Linguagem como C++.
