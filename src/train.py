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

    chatbot.train([
        'Who are you?',
        '01'
    ])
    chatbot.train([
        'What is your name?',
        '01'
    ])
    chatbot.train([
        'Who are you?',
        '01'
    ])
    chatbot.train([
        'What is your name?',
        '01'
    ])
    



    chatbot.train([
        'What exactly do you want from us?',
        '02'
    ])
    chatbot.train([
        'Why come to Earth now?',
        '02'
    ])
    chatbot.train([
        'What do you want from us?',
        '02'
    ])
    chatbot.train([
        'Why did you come to Earth now?',
        '02'
    ])


    

    chatbot.train([
        'What do you want?',
        '03'
    ])
    chatbot.train([
        'What does your species want?',
        '03'
    ])
    chatbot.train([
        'What do you want from us?',
        '03'
    ])
    chatbot.train([
        'What does your king want?',
        '03'
    ])


