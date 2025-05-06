from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from collections import OrderedDict
import sys, os
from time import sleep
import _thread
from chatterbot import ChatBot
from train import LOGIC_ADAPTER

FOLDER = os.path.dirname(os.path.abspath(__file__))


clients = []

class NLPController(WebSocket):
    def __init__(self, *args, **kwargs):
        WebSocket.__init__(self, *args, **kwargs)
        self.BUFFER = ['tisina']
        self.LAST = None
        self.chatbot = ChatBot('MICKO', read_only=True, logic_adapters=LOGIC_ADAPTER,
                               database=os.path.join(FOLDER, 'db.sqlite3'))
        _thread.start_new_thread(self.listen, ())

    def handleMessage(self):
        global clients
        print(f"RECEIVED: {self.data}")

        if self.data.startswith('Intro'):
            print(f"PASSAGE DETECTED: {self.data}")
            self.broadcast(f"PASSAGE:{self.data}")  # <-- broadcast umjesto sendMessage
            return


        if self.data.startswith('TWINE_COMMAND:DO_TRANSITION:'):
            passage = self.data.split(':')[-1]
            self.broadcast(f'DO_TRANSITION:{passage}')
            return

        print('ASKING CHATBOT')
        result = self.chatbot.get_response(self.data)
        if result != self.LAST:
            self.BUFFER.append(str(result))
            self.LAST = result

    def handleConnected(self):
        clients.append(self)
        print(self.address, 'connected')

    def handleClose(self):
        clients.remove(self)
        print(self.address, 'closed')

    def listen(self):
        while True:
            try:
                if self.BUFFER:
                    self.BUFFER = list(OrderedDict.fromkeys(self.BUFFER))
                    cmd = self.BUFFER.pop()
                    self.broadcast(str(cmd))
                sleep(0.1)
            except Exception as e:
                print('Error in listen thread:', e)

    def broadcast(self, message):
        for client in clients:
            try:
                client.sendMessage(message)
            except Exception as e:
                print('Broadcast error:', e)

