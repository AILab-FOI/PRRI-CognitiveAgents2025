#!/usr/bin/env python3
import os
from chatterbot import ChatBot
from train import LOGIC_ADAPTER

FOLDER = os.path.dirname( os.path.abspath( __file__ ) )
chatbot = ChatBot( 'MICKO', read_only=True, logic_adapters=LOGIC_ADAPTER, database=os.path.join( FOLDER, 'db.sqlite3' ) )
print( 'Pozdrav! Ja sam Jura!' )

while True:
    print( chatbot.get_response( input( '> ' ) ) )    
    

