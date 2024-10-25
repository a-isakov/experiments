#include <iostream>
#include <string>
#include <chrono>
#include <thread>
#include <ctime>
#include <arpa/inet.h>
#include <cstring>

class SocketHelper {
public:
    explicit SocketHelper(const std::string& serverIp, const int serverPort) :
        socketCreated(false), ready(false) {
        socket = ::socket(AF_INET, SOCK_STREAM, 0);
        if (socket < 0) {
            err = "Socket creation error!";
        } else {
            socketCreated = true;
            sockaddr_in serv_addr = {0};
            serv_addr.sin_family = AF_INET;
            serv_addr.sin_port = htons(serverPort);

            if (inet_pton(AF_INET, serverIp.c_str(), &serv_addr.sin_addr) <= 0) {
                err = "Invalid address!";
            } else {
                if (connect(socket, reinterpret_cast<struct sockaddr *>(&serv_addr), sizeof(serv_addr)) < 0) {
                    err = "Connection failed!";
                } else {
                    ready = true;
                }
            }
        }
    }

    ~SocketHelper() {
        if (socketCreated)
            close(socket);
    }

    bool isReady() const {
        return ready;
    }

    std::string getError() {
        return err;
    }

    void send(const std::string &message) const {
        if (ready)
            ::send(socket, message.c_str(), message.size(), 0);
    }

private:
    int socket;
    std::string err;
    bool socketCreated;
    bool ready;
};

class InfoSender {
public:
    explicit InfoSender(const std::string& clientName, const std::string& serverIp, const int serverPort, const int intervalSec) :
        clientName(clientName), intervalSec(intervalSec), serverPort(serverPort), serverIp(serverIp), running(false) {

        running = true;
        listenerThread = std::thread(&InfoSender::run, this);
        listenerThread.detach();
    }

    ~InfoSender() {
        stop();
    }

private:
    std::string clientName;
    int intervalSec;
    int serverPort;
    std::string serverIp;
    std::thread listenerThread;
    bool running;

    static std::string getCurrentTime() {
        const auto now = std::chrono::system_clock::now();
        const auto in_time_t = std::chrono::system_clock::to_time_t(now);
        std::tm buf = {0};
        localtime_r(&in_time_t, &buf);
        char buffer[80];
        strftime(buffer, sizeof(buffer), "[%Y-%m-%d %H:%M:%S", &buf);

        const auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(now.time_since_epoch()) % 1000;
        sprintf(buffer + strlen(buffer), ".%03d] ", static_cast<int>(ms.count()));
        return std::string(buffer);
    }

    void run() {
        while (running) {
            SocketHelper socket(serverIp, serverPort);
            if (!socket.isReady())
                std::cerr << socket.getError() << std::endl;
            else {
                const std::string message = getCurrentTime() + clientName;
                socket.send(message);
            }
            std::this_thread::sleep_for(std::chrono::seconds(intervalSec));
        }
    }

    void stop() {
        running = false;
        if (listenerThread.joinable())
            listenerThread.join();
    }
};

int main(int argc, char* argv[]) {
    // simple check arguments
    if (argc != 4) {
        std::cerr << "Usage: client <client_name> <server_port> <interval_sec>" << std::endl;
        return 1;
    }
    // run sender in a background
    InfoSender sender(argv[1], "127.0.0.1", std::stoi(argv[2]), std::stoi(argv[3]));
    // wait for exit command to be entered
    std::string command;
    while (command != "exit") {
        std::cout << "Type 'exit' to stop: ";
        std::cin >> command;
        std::transform(command.begin(), command.end(), command.begin(), [](unsigned char c){ return std::tolower(c); });
    }

    return 0;
}
