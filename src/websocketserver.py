from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from collections import OrderedDict
import sys, os
from time import sleep
import _thread
from chatterbot import ChatBot
from train import LOGIC_ADAPTER

FOLDER = os.path.dirname(os.path.abspath(__file__))


class NLPController( WebSocket ) :
    def __init__( self, *args, **kwargs ):
        WebSocket.__init__( self, *args, **kwargs )
        self.BUFFER = [ 'tisina' ]
        self.LAST = None
        self.chatbot = ChatBot( 'MICKO', read_only=True, logic_adapters=LOGIC_ADAPTER, database=os.path.join( FOLDER, 'db.sqlite3' ) )
        print( self.chatbot.get_response( 'tko te napravio' ) )
        _thread.start_new_thread( self.listen, () )
        
    def listen( self ):
        while True:
            try:
                if self.BUFFER:
                    self.BUFFER = list( OrderedDict.fromkeys( self.BUFFER ) )
                    print( 'BUFFER:', self.BUFFER )
                    cmd = self.BUFFER.pop()
                    print( 'Sending', str( cmd ) )
                    self.sendMessage( str( cmd ) )
                sleep( 0.1 )
            except Exception as e:
                print( 'NLPController: There was an error!', e )

    def handleMessage(self):
        print('RAW DATA:', self.data)

        if self.data.startswith('Intro'):
            print(f"PASSAGE DETECTED: {self.data}")
            self.sendMessage(f"ACK:{self.data}")
            return

        if self.data != 'connect':
            if self.data.startswith('Intro'):
                print(f"Received passage name: {self.data}")
                return
                
            print('ASKING CHATBOT')
            result = self.chatbot.get_response(self.data)
            print('RESULT', result)
            if result != self.LAST:
                print(self.data, result)
                self.BUFFER.append(str(result))
                self.LAST = result
        
    def handleConnected(self):
        print( self.address, 'connected' )

    def handleClose( self ):
        print( self.address, 'closed' )
        sys.exit()
