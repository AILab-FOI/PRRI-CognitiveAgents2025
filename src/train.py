from chatterbot.trainers import ListTrainer

LOGIC_ADAPTER = [
        {
            'import_path': 'chatterbot.logic.BestMatch'
        },
        {
            'import_path': 'chatterbot.logic.LowConfidenceAdapter',
            'threshold': 0.66,
            'default_response': 'ponovi'
        }
    ]

def train(bot):
    bot.set_trainer(ListTrainer)
    chatbot = bot

    #passage Prica1.1
    chatbot.train(
        ["What exactly do you want from us? Why come to Earth now?",     
        "010101"
    ])
    chatbot.train(
        ["What exactly do you want from us?",                            
        "010101"
    ])
    chatbot.train(
        ["Why come to Earth now?",   #stari kod breaka ovo
        "010101"
    ])

    
    chatbot.train(
        ["Why did you choose this moment to initate contact with us?", 
        "010201"
    ])

    
    chatbot.train(
        ["Why should we trust you now after staying silent for so long?", 
        "010301"
    ])
    
    #passage Prica1.2
    chatbot.train(
        ["How long have you been observing humanity?", 
        "010102"
    ])
    
    
    chatbot.train(
        ["Is there a hidden agenda behind your offer?", 
        "010202"
    ])
    
    
    chatbot.train(
        ["Are you planning to control us?", 
        "010302"
    ])

    #passage Prica1.3
    chatbot.train(
        ["How can we benefit from your technology?", 
        "010103"
    ])


    chatbot.train(
        ["What exacty is your mission here?", 
        "010203"
    ])


    chatbot.train(
        ["Are you using us for something?", 
        "010303"
    ])

    #passage Prica1.4
    chatbot.train(
        ["Why didn't you contact us sooner?", 
        "010104"
    ])


    chatbot.train(
        ["How do we know you are telling the truth?", 
        "010204"
    ])


    chatbot.train(
        ["How do we know you won't betray us in the future?", 
        "010304"
    ])

    #passage Prica1.5
    chatbot.train(
        ["Are there other species you have helped before?", 
        "010105"
    ])


    chatbot.train(
        ["Are there others out there besides you and us?", 
        "010205"
    ])


    chatbot.train(
        ["How can we trust a species that's so fragile?", 
        "010305"
    ])

    #passage Prica1.6
    chatbot.train(
        ["If we decline your offer now, will you ever return?", 
        "010106"
    ])


    chatbot.train(
        ["Do you have enemies?", 
        "010206"
    ])


    chatbot.train(
        ["Are you just here to observe our downfall?", 
        "010306"
    ])
    
    
     #passage Prica2.1
    chatbot.train(
        ["What do you want from us?", 
        "020101"
    ])


    chatbot.train(
        ["Is there any chance for peace?", 
        "020102"
    ])


    #passage Prica2.2
    chatbot.train(
        ["Have you done this to others?", 
        "020103"
    ])


    chatbot.train(
        ["What makes you think you’re stronger than us?", 
        "020104"
    ])


    #passage Prica2.3
    chatbot.train(
        ["Do you even care who we are?", 
        "020105"
    ])


    chatbot.train(
        ["What do you fear?", 
        "020106"
    ])


    #passage Prica2.4
    chatbot.train(
        ["You want a fight? Then come down and face us, not from orbit.", 
        "020107"
    ])


    chatbot.train(
        ["Why now? Why Earth?", 
        "020108"
    ])


    #passage Prica2.5
    chatbot.train(
        ["If you destroy us, what do you gain?", 
        "020109"
    ])


    chatbot.train(
        ["Are we just another trophy to you?", 
        "020110"
    ])