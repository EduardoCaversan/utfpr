#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <chrono>

std::mutex mtx;  // Mutex para proteger o acesso ao buffer
std::condition_variable cv_producer, cv_consumer;  // Condições para sincronização
std::queue<int> buffer;  // Buffer compartilhado
const unsigned int BUFFER_SIZE = 5;  // Tamanho do buffer
const int TOTAL_ITEMS = 20;  // Número total de itens que serão produzidos
int items_produced = 0;  // Contador de itens produzidos
int items_consumed = 0;  // Contador de itens consumidos

// Função do produtor
void producer(int id) {
    while (true) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));  // Simula trabalho de produção

        std::unique_lock<std::mutex> lock(mtx);  // Trava o mutex

        // Se já produzimos todos os itens, paramos
        if (items_produced >= TOTAL_ITEMS) {
            break;
        }

        // Espera até que haja espaço no buffer
        cv_producer.wait(lock, [] { return buffer.size() < BUFFER_SIZE; });

        // Produzindo o item
        int item = ++items_produced;
        buffer.push(item);  // Adiciona item ao buffer
        std::cout << "Produtor " << id << " produziu item " << item << "\n";

        lock.unlock();  // Libera o mutex
        cv_consumer.notify_one();  // Notifica o consumidor de que há um item disponível

        if (items_produced >= TOTAL_ITEMS) {
            break;
        }
    }
}

// Função do consumidor
void consumer(int id) {
    while (true) {
        std::unique_lock<std::mutex> lock(mtx);  // Trava o mutex

        // Se já consumimos todos os itens, paramos
        if (items_consumed >= TOTAL_ITEMS) {
            break;
        }

        // Espera até que haja itens no buffer
        cv_consumer.wait(lock, [] { return !buffer.empty(); });

        int item = buffer.front();  // Pega o item do buffer
        buffer.pop();
        std::cout << "Consumidor " << id << " consumiu item " << item << "\n";
        ++items_consumed;

        lock.unlock();  // Libera o mutex
        cv_producer.notify_one();  // Notifica o produtor de que há espaço disponível

        std::this_thread::sleep_for(std::chrono::milliseconds(150));  // Simula o tempo de consumo

        if (items_consumed >= TOTAL_ITEMS) {
            break;
        }
    }
}

int main() {
    // Vetores para armazenar as threads dos produtores e consumidores
    std::thread producers[5];
    std::thread consumers[5];

    // Criando 5 produtores
    for (int i = 0; i < 5; ++i) {
        producers[i] = std::thread(producer, i + 1);
    }

    // Criando 5 consumidores
    for (int i = 0; i < 5; ++i) {
        consumers[i] = std::thread(consumer, i + 1);
    }

    // Aguarda a execução das threads
    for (int i = 0; i < 5; ++i) {
        producers[i].join();
        consumers[i].join();
    }

    std::cout << "Execução concluída! Todos os itens foram produzidos e consumidos sem deadlocks.\n";
    return 0;
}