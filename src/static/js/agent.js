var DONT = false;
var FIRST = true;
var STOP = false;
var trenutniPassage="";

// Na početak agent.js dodajte
var RECONNECT_DELAY = 1000;
var MAX_RETRIES = 5;
var retryCount = 0;

function safeStyleSet(id, property, value) {
    const el = document.getElementById(id);
    if (el) el.style[property] = value;
}

function safeGetElement(id) {
    var el = document.getElementById(id);
    if (!el) {
        console.warn("Element not found:", id);
    }
    return el;
}

$(window).on('load', function () {
	safeStyleSet('notSupported', 'display', 'none');
    safeStyleSet('startupute', 'display', 'none');

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

		var init = function () {
			recognition = new SpeechRecognition(); 

			window.recognition = recognition;

			recognition.lang = 'en-US'; // Engleski jer je igra na engleskom
			recognition.continuous = true;
			recognition.interimResults = false;

			recognition.onresult = (event) => {
				const current = event.resultIndex;
				const transcript = event.results[current][0].transcript;

				window.recognition.stop();
				STOP = true;
				output.innerHTML = transcript + ' ';
				window.ws.send(transcript);
			};

			recognition.onspeechend = () => {
				window.recognition.stop();
				//setTimeout(function(){ recognition.start(); }, 400);
			};

			recognition.onerror = (event) => {
				window.recognition.stop();
				//setTimeout(function(){ recognition.start(); }, 400);
			};
		}
		init();
	}

	record.onclick = () => {
		window.recognition.start();
	}

	$('#agent')[0].ontimeupdate = function () {
		var agent = $('#agent')[0];
		var the_time = agent.currentTime;
		if (the_time >= END) {
			agent.pause();
			play_part('tisina');
			if (!FIRST)
				DONT = true;
		}
		else {
			DONT = false;
		}
	}
	$('#agent')[0].loadedmetadata = function () {
		DONT = false;
		play_part('tisina');
	}
	//AUTo PLAY

	/* Ovo je dio za fullscreen
	if (document.documentElement.requestFullscreen) {
		document.documentElement.requestFullscreen();
	} else if (document.documentElement.mozRequestFullScreen) { // Firefox
		document.documentElement.mozRequestFullScreen();
	} else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
		document.documentElement.webkitRequestFullscreen();
	} else if (document.documentElement.msRequestFullscreen) { // IE/Edge
		document.documentElement.msRequestFullscreen();
	}*/
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
});

function connect() {
    try {
        ws = new WebSocket('ws://localhost:8009');
        window.ws = ws;
        
        ws.onopen = function() {
            console.log("Ajs WebSocket connected");
            retryCount = 0;
            ws.send('connect');
            DONT = false;
            play_part('tisina');
        };

        ws.onmessage = function(msg) 
		{
			console.log('Ajs #Received:', msg.data);
			console.log('Ajs $: ', msg.data.toString());
		
			if (msg.data.startsWith('PASSAGE:')) 
			{
				const passageName = msg.data.split(':')[1];
				console.log("Ajs Trenutni passage:", passageName); // ← korisno za debug
				trenutniPassage=passageName;
				return;
			}
		
			play_part(msg.data.toString());
		};
		

        ws.onclose = function(e) {
            console.log('Ajs WebSocket closed:', e.reason);
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(connect, RECONNECT_DELAY);
            }
        };

        ws.onerror = function(err) {
            console.error('Ajs WebSocket error:', err.message);
            ws.close();
        };
    } catch (e) {
        console.error("Ajs Connection error:", e);
    }
}

connect();

right = {
	'text-align': 'right',
	'width': '1000px',
	'margin-right': '-400px auto'
};

LAST_PART = ''
CUR_PART = 'tisina';
END = 278;

function play_part(part) 
{
    LAST_PART = CUR_PART;
    CUR_PART = part;
    var agent = $('#agent')[0];
    var end = 0;

    agent.play()

    DONT = (part !== 'tisina') ? true : false;
    if (part === 'tisina') FIRST = !FIRST

    recognition.stop();

    switch (part) {
      //test prebaci na next passage
		case '01':
			nextPassage("Intro3", 1000);
			break;

		//passage Prica1.1
        case '010101':
			if (isWrongPassage(part)) break;
            agent.currentTime = 0;
            end = 13;
            break;
			
		case '010201':   
			if (isWrongPassage(part)) break;
            agent.currentTime = 123;
            end = 135;
            break;

		case '010301':   
			if (isWrongPassage(part)) break;
            agent.currentTime = 238;
            end = 247;
            break;

		//passage Prica1.2
		case '010102':
			if (isWrongPassage(part)) break;
            agent.currentTime = 21;
            end = 33;
            break;

		case '010202': 
			if (isWrongPassage(part)) break;
			agent.currentTime = 143;
			end = 153;
			break;

		case '010302':
			if (isWrongPassage(part)) break;   
			agent.currentTime = 255;
			end = 265;
			break;

		//passage Prica1.3
		case '010103':
			if (isWrongPassage(part)) break;
            agent.currentTime = 42;
            end = 56;
            break;

		case '010203':
			if (isWrongPassage(part)) break;
            agent.currentTime = 161;
            end = 172;
            break;

		case '010303':
			if (isWrongPassage(part)) break;
            agent.currentTime = 273;
            end = 284;
            break;

		//passage Prica1.4
		case '010104':
			if (isWrongPassage(part)) break;
			agent.currentTime = 64;
			end = 76;
			break;

		case '010204':
			if (isWrongPassage(part)) break;
            agent.currentTime = 181;
            end = 193;
            break;

		case '010304':
			if (isWrongPassage(part)) break;
            agent.currentTime = 292;
            end = 303;
            break;

		//passage Prica1.5
		case '010105':
			if (isWrongPassage(part)) break;
            agent.currentTime = 85;
            end = 96;
            break;

		case '010205':
			if (isWrongPassage(part)) break;
            agent.currentTime = 202;
            end = 213;
            break;

		case '010305':
			if (isWrongPassage(part)) break;
            agent.currentTime = 311;
            end = 323;
            break;

		//passage Prica1.6	
		case '010106':
			if (isWrongPassage(part)) break;
			agent.currentTime = 105;
			end = 114;
			break;

		case '010206':
			if (isWrongPassage(part)) break;
			agent.currentTime = 221;
			end = 229;
			break;

		case '010306':
			if (isWrongPassage(part)) break;
			agent.currentTime = 331;
			end = 343;
			break;

		// 'tisina'
        default: 
            agent.currentTime = 14;
            end = 19;
            try 
			{
                if (!isMobileBrowser())
                    window.recognition.start();
            }
            catch (e) { }
            break;
    }

    END = end;

	//pomocne funkcije
	function nextPassage(passageName, delay)
	{
		setTimeout( ()=> 
			{
				if (window.ws && window.ws.readyState === WebSocket.OPEN) 
					window.ws.send("TWINE_COMMAND:DO_TRANSITION:" + passageName);
				else
					console.log("error kod slanja passagea \"" + passageName + "\".");
			}
		, delay); 
	}

	function isWrongPassage(passage)
	{
		//example '010203' => 01 - agent, 02 - choice of answer, 03 - passage
		//if agent == agent && passage == passage => passage is not wrong, otherwise it is
		let startTrenutni = trenutniPassage.substring(0,2);
		let endTrenutni = trenutniPassage.substring(4,6);
		let startPassage = passage.substring(0,2);
		let endPassage = passage.substring(4,6);

		if(startTrenutni === startPassage && endTrenutni === endPassage)
			return false;
		else 
			return true;
	}

}


function question(q) {
	window.recognition.stop();
	window.output.innerHTML = q + ' ';
	window.ws.send(q);
}


function isMobileBrowser() {
	return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}