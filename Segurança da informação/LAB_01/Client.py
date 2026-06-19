import socket
import sys
import time
import threading
import select
import traceback
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

KEY = b'\x9c\x14\xef\xd3\x7a\x8b\x52\x91\x3f\x2e\xc1\x99\x47\xac\x6d\x0f\x72\x81\xab\x53\x0e\x94\x5c\x1a\xf7\x63\x2b\x88\x4d\xda\x11\x6e'
NONCE = b'\x6a\x3f\x91\x2c\x8e\x74\x19\xb0\x5d\xfa\x44\xce'


class Server(threading.Thread):

    def initialise(self, receive):
        self.receive = receive
        self.aesgcm = AESGCM(KEY)

    def decrypt_message(self, data):
        try:
            plaintext = self.aesgcm.decrypt(NONCE, data, None)
            return plaintext.decode()
        except:
            return "[Erro ao descriptografar]"

    def run(self):
        lis = []
        lis.append(self.receive)
        while 1:
            read, write, err = select.select(lis, [], [])
            for item in read:
                try:
                    s = item.recv(1024)
                    if s != b'':
                        msg = self.decrypt_message(s)
                        print(msg + '\n>>')
                except:
                    traceback.print_exc(file=sys.stdout)
                    break


class Client(threading.Thread):

    def connect(self, host, port):
        self.sock.connect((host, port))

    def encrypt_message(self, msg):
        aesgcm = AESGCM(KEY)
        ciphertext = aesgcm.encrypt(NONCE, msg, None)
        return ciphertext

    def client(self, host, port, msg):
        encrypted = self.encrypt_message(msg)
        self.sock.send(encrypted)

    def run(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
        try:
            host = input("Enter the server IP\n>>")
            port = int(input("Enter the server Destination Port\n>>"))
        except EOFError:
            print("Error")
            return 1
        print("Connecting\n")
        self.connect(host, port)
        print("Connected\n")
        user_name = input("Enter the User Name to be Used\n>>")
        receive = self.sock
        time.sleep(1)
        srv = Server()
        srv.initialise(receive)
        srv.daemon = True
        print("Starting service")
        srv.start()

        while 1:
            msg = input('>>')
            if msg == 'exit':
                break
            if msg == '':
                continue
            msg = user_name + ': ' + msg
            data = msg.encode()
            self.client(host, port, data)
        return (1)


if __name__ == '__main__':
    print("Starting client")
    cli = Client()
    cli.start()