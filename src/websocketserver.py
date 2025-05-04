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
        if self.data == 'NEXT_PASSAGE':
            print("Triggering passage transition")
            self.sendMessage("DO_TRANSITION:Intro3")  # More explicit command
            return
        
        if self.data.startswith('TWINE_COMMAND:'):
            print(f"Forwarding Twine command: {self.data}")
            self.sendMessage(self.data)  # Forward exactly as received
            return

        if self.data.startswith('Intro'):
            print(f"PASSAGE DETECTED: {self.data}")
            self.sendMessage(f"ACK:{self.data}")
            return

        if self.data == 'connect':
            return
            
        if self.data == 'NEXT_PASSAGE':
            print("Received NEXT_PASSAGE command - sending to all clients")
            # Šaljemo posebnu poruku koja će jasno identificirati akciju
            self.sendMessage("ACTION:NEXT_PASSAGE")
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
