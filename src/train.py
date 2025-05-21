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
        ["Why choose this moment to initiate contact?",
        "010201"
    ])
    chatbot.train(
        ["Why initiate contact at this moment?",
        "010201"
    ])

    
    chatbot.train(
        ["Why should we trust you now after staying silent for so long?", 
        "010301"
    ])
    chatbot.train(
        ["Why should we trust you after all this silence?",
        "010301"
    ])
    chatbot.train(
        ["Why should we trust you?",
        "010301"
    ])

    
    #passage Prica1.2
    chatbot.train(
        ["How long have you been observing humanity?", 
        "010102"
    ])
    chatbot.train(
        ["How long have you observed us?",
        "010102"
    ])
    chatbot.train(
        ["How long have you been watching us?", 
        "010102"
    ])
    
    
    chatbot.train(
        ["Is there a hidden agenda behind your offer?", 
        "010202"
    ])
    chatbot.train(
        ["Is there more to your offer?", 
        "010202"
    ])
    chatbot.train(
        ["Any hidden motives?",
        "010202"
    ])
    
    chatbot.train(
        ["Are you planning to control us?", 
        "010302"
    ])
    chatbot.train(
        ["Do you want to control us?",
        "010302"
    ])
    chatbot.train(
        ["Are you going to control us?", 
        "010302"
    ])

    #passage Prica1.3
    chatbot.train(
        ["How can we benefit from your technology?", 
        "010103"
    ])
    chatbot.train(
        ["How does your technology help us?", 
        "010103"
    ])
    chatbot.train(
        ["How is your tech useful to us?", 
        "010103"
    ])


    chatbot.train(
        ["What exacty is your mission here?", 
        "010203"
    ])
    chatbot.train(
        ["What is your mission here?", 
        "010203"
    ])
    chatbot.train(
        ["What’s your goal here?",
        "010203"
    ])


    chatbot.train(
        ["Are you using us for something?", 
        "010303"
    ])
    chatbot.train(
        ["Are you using us?", 
        "010303"
    ])
    chatbot.train(
        ["Are you taking advantage of us?", 
        "010303"
    ])


    #passage Prica1.4
    chatbot.train(
        ["Why didn't you contact us sooner?", 
        "010104"
    ])
    chatbot.train(
        ["Why didn’t you reach out before?", 
        "010104"
    ])
    chatbot.train(
        ["Why didn't you contact us earlier?", 
        "010104"
    ])


    chatbot.train(
        ["How do we know you are telling the truth?", 
        "010204"
    ])
    chatbot.train(
        ["How do we know you're honest?",
        "010204"
    ])
    chatbot.train(
        ["How do we know this is true?", 
        "010204"
    ])


    chatbot.train(
        ["How do we know you won't betray us in the future?", 
        "010304"
    ])
    chatbot.train(
        ["How do we know you won't betray us?",
        "010304"
    ])
    chatbot.train(
        ["You won't betray us later?",
        "010304"
    ])

    #passage Prica1.5
    chatbot.train(
        ["Are there other species you have helped before?", 
        "010105"
    ])
    chatbot.train(
        ["Are there other species you have helped?",
        "010105"
    ])
    chatbot.train(
        ["Have you helped others before?",
        "010105"
    ])


    chatbot.train(
        ["Are there others out there besides you and us?", 
        "010205"
    ])
    chatbot.train(
        ["Are there others out there?", 
        "010205"
    ])
    chatbot.train(
        ["Are there more species out there?", 
        "010205"
    ])


    chatbot.train(
        ["How can we trust a species that's so fragile?", 
        "010305"
    ])
    chatbot.train(
        ["How do we trust a weak species?",
        "010305"
    ])
    chatbot.train(
        ["How do we trust something so fragile?",
        "010305"
    ])

    #passage Prica1.6
    chatbot.train(
        ["If we decline your offer now, will you ever return?", 
        "010106"
    ])
    chatbot.train(
        ["Will you come back if we say no?",
        "010106"
    ])
    chatbot.train(
        ["If we decline, will you return?",
        "010106"
    ])


    chatbot.train(
        ["Do you have enemies?", 
        "010206"
    ])
    chatbot.train(
        ["Have you made enemies?", 
        "010206"
    ])
    chatbot.train(
        ["Do you have any enemies?", 
        "010206"
    ])


    chatbot.train(
        ["Are you just here to observe our downfall?", 
        "010306"
    ])
    chatbot.train(
        ["Are you only here to see us fail?", 
        "010306"
    ])
    chatbot.train(
        ["Are you here to see our downfall?", 
        "010306"
    ])
    
    
     #passage Prica2.1
    chatbot.train(
        ["What do you want from us?", 
        "020101"
    ])


    chatbot.train(
        ["Is there any chance for peace?", 
        "020201"
    ])


    #passage Prica2.2
    chatbot.train(
        ["Have you done this to others?", 
        "020102"
    ])


    chatbot.train(
        ["What makes you think you’re stronger than us?", 
        "020202"
    ])


    #passage Prica2.3
    chatbot.train(
        ["Do you even care who we are?", 
        "020103"
    ])


    chatbot.train(
        ["What do you fear?", 
        "020203"
    ])


    #passage Prica2.4
    chatbot.train(
        ["You want a fight? Then come down and face us, not from orbit.", 
        "020104"
    ])


    chatbot.train(
        ["Why now? Why Earth?", 
        "020204"
    ])


    #passage Prica2.5
    chatbot.train(
        ["If you destroy us, what do you gain?", 
        "020105"
    ])


    chatbot.train(
        ["Are we just another trophy to you?", 
        "020205"
    ])