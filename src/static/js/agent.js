var DONT = false;
var FIRST = true;
var STOP = false;
var transitioning = false;  // nova varijabla koja osigurava da se prijelaz izvrši samo jednom

$(window).on('load', function(){
    counter = 0;
    
    if (navigator.userAgent.indexOf('Firefox') > -1) {
        document.getElementById('notSupported').style.display = 'block';
        document.getElementById('startupute').style.display = 'none';
        document.getElementById('questions').style.display = 'none';
        document.getElementById('output').style.display = 'none';
        document.querySelector('.video-container').style.display = 'none';
    } else {
        const output = document.getElementById('output');
        const button = document.getElementById('start');
        const record = document.getElementById('record');
        window.output = output;
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        var init = function() {
            recognition = new SpeechRecognition();
            window.recognition = recognition;
            
            recognition.lang = 'hr-HR'; // Croatian
            recognition.continuous = true;
            recognition.interimResults = false;
            
            recognition.onresult = (event) => {
                const current = event.resultIndex;
                const transcript = event.results[current][0].transcript;
                
                recognition.stop();
                STOP = true;
                output.innerHTML = transcript + ' ';
                window.ws.send(transcript);
            };
            
            recognition.onspeechend = () => {
                recognition.stop();
                setTimeout(function(){ recognition.start(); }, 404);
            };
            
            recognition.onerror = (event) => {
                recognition.stop();
            };
        }
        init();
        
        button.onclick = () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
            document.querySelector('.video-container').style.display = 'block';
            if (!isMobileBrowser())
                recognition.start();
            document.getElementById('startupute').style.display = 'none';
            document.getElementById('questions').style.display = 'block';
            play_part('tisina');
            question('bok');
            if (isMobileBrowser()) {
                document.getElementById('record').style.display = 'block';
            }
        };
    }
    
    record.onclick = () => {
        recognition.start();
    }
    
    // EVENT: Ažuriranje vremena videa
    $('#agent')[0].ontimeupdate = function(){
        var agent = $('#agent')[0];
        var the_time = agent.currentTime;
        // Ako smo dosegli kraj segmenta
        if (the_time >= END && !transitioning) {
            transitioning = true; // označi da smo u procesu prijelaza
            agent.pause();
            // Ako je odgovor bio reproduciran (tj. CUR_PART nije 'tisina'), prebacujemo se na 'tisina'
            if (CUR_PART !== 'tisina') {
                play_part('tisina');
            }
            // Ako se reproducira 'tisina', opcionalno pokreni prepoznavanje
            if (CUR_PART === 'tisina' && !isMobileBrowser()) {
                try {
                    recognition.start();
                } catch(e){}
            }
        } else if (the_time < END) {
            transitioning = false;
        }
    }
    
    $('#agent')[0].loadedmetadata = function(){
        DONT = false;
        play_part('tisina');
    }
});

function connect() {
    ws = new WebSocket('ws://localhost:8009');
    window.ws = ws;
    ws.onopen = function() {
        ws.send('connect');
        DONT = false;
        play_part('tisina');
    };
    
    ws.onmessage = function(msg) {
        console.log(msg.data);
        play_part(msg.data.toString());
    };
    
    ws.onclose = function(e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function() {
            connect();
        }, 1000);
    };
    
    ws.onerror = function(err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        ws.close();
    };
}

connect();

right = { 
    'text-align': 'right',
    'width': '1000px',
    'margin-right': '-400px auto'
};

LAST_PART = '';
CUR_PART = 'tisina';
END = 278;

function play_part(part) {
    LAST_PART = CUR_PART;
    CUR_PART = part;
    var agent = $('#agent')[0];
    var start = 0, end = 0;
    
    // Zaustavimo prepoznavanje dok se reproducira animacija
    recognition.stop();
    
    // Odredi početak i kraj segmenta
    switch (part) {
        case '01':
            start = 2.1; end = 3.1;
            break;
        case '02':
            start = 5.2; end = 15.2;
            break;
        case '03':
            start = 17.2; end = 26.2;
            break;
        default: // 'tisina'
            start = 26.5; end = 27;
            break;
    }
    
    // Postavi početno vrijeme, definiraj kraj i pokreni reprodukciju
    agent.currentTime = start;
    END = end;
    agent.play();
    
    DONT = (part !== 'tisina');
    if (part === 'tisina') {
        FIRST = !FIRST;
        // Ako je segment 'tisina', pokreni prepoznavanje (ako nije mobilni preglednik)
        if (!isMobileBrowser()) {
            try { recognition.start(); } catch(e){}
        }
    }
}

function question(q) {
    recognition.stop();
    window.output.innerHTML = q + ' ';
    window.ws.send(q);
}

function isMobileBrowser() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
