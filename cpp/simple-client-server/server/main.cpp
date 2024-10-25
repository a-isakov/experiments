#include <iostream>
#include <fstream>
#include <string>
#include <thread>
#include <mutex>
#include <arpa/inet.h>
#include <algorithm>

class MessageListener {
public:
    explicit MessageListener(const int serverPort) : serverPort(serverPort), ready(false), address(0) {
        serverSocket = socket(AF_INET, SOCK_STREAM, 0);
        if (serverSocket == 0) {
            err = "Socket creation error!";
        } else {
            address.sin_family = AF_INET;
            address.sin_addr.s_addr = INADDR_ANY;
            address.sin_port = htons(serverPort);

            if (bind(serverSocket, reinterpret_cast<struct sockaddr *>(&address), sizeof(address)) < 0) {
                err = "Bind failed!";
            } else {
                if (listen(serverSocket, 10) < 0) {
                    err = "Listen failed!";
                } else {
                    ready = true;
                    // run listening in a background
                    listenerThread = std::thread(&MessageListener::run, this);
                    listenerThread.detach();
                }
            }
        }
    }

    ~MessageListener() {
        stop();
        close(serverSocket);
    }

    bool isReady() const {
        return ready;
    }

    std::string getError() {
        return err;
    }

private:
    int serverPort;
    int serverSocket;
    bool ready;
    sockaddr_in address;
    std::string err;
    std::mutex logMutex;
    std::thread listenerThread;

    void run() {
        while (ready) {
            int clientSocket = accept(serverSocket, nullptr, nullptr);
            if (clientSocket >= 0) {
                char buffer[1024] = {0};
                if (const ssize_t bytesReceived = recv(clientSocket, buffer, 1024, 0); bytesReceived > 0) {
                    std::string message(buffer, bytesReceived);
                    if (message == "stop")
                        ready = false;
                    else
                        logMessage(message);
                }
                close(clientSocket);
            }
        }
    }

    void stop() {
        ready = false;

        // send "stop" word to ourselves to close listening correctly
        const int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
        if (clientSocket < 0) {
            std::cerr << "Socket creation error!" << std::endl;
            return;
        }

        sockaddr_in serv_addr = {0};
        serv_addr.sin_family = AF_INET;
        serv_addr.sin_port = htons(serverPort);

        if (inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr) <= 0) {
            std::cerr << "Invalid address!" << std::endl;
            return;
        }

        if (connect(clientSocket, reinterpret_cast<struct sockaddr *>(&serv_addr), sizeof(serv_addr)) < 0) {
            std::cerr << "Connection failed!" << std::endl;
            close(clientSocket);
            return;
        }

        const std::string message = "stop";
        send(clientSocket, message.c_str(), message.size(), 0);
        close(clientSocket);

        if (listenerThread.joinable())
            listenerThread.join();
    }

    void logMessage(const std::string& message) {
        std::lock_guard<std::mutex> guard(logMutex);
        std::ofstream logFile("log.txt", std::ios::app);
        if (logFile.is_open()) {
            logFile << message << std::endl;
            logFile.close();
        } else {
            std::cerr << "Unable to open log file!" << std::endl;
        }
    }
};

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: server <port>" << std::endl;
        return 1;
    }
    const int serverPort = std::stoi(argv[1]);

    // start listening in a background
    MessageListener listener(serverPort);
    if (!listener.isReady()) {
        std::cerr << listener.getError() << std::endl;
        return 1;
    }
    std::cout << "Server is listening on port " << serverPort << std::endl;

    // wait for exit command to be entered
    std::string command;
    while (command != "exit") {
        std::cout << "Type 'exit' to stop: ";
        std::cin >> command;
        std::transform(command.begin(), command.end(), command.begin(), [](unsigned char c){ return std::tolower(c); });
    }
    return 0;
}
