var DONT = false;
var FIRST = true;
var STOP = false;

$(window).on('load', function () {
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
	ws = new WebSocket('ws://localhost:8009');
	window.ws = ws;
	ws.onopen = function () {
		ws.send('connect');
		DONT = false;
		play_part('tisina');
	};

	//Nisam siguran ako nam ovo treba?!
	ws.onmessage = function (msg) {
		console.log(msg.data);
		console.log(msg.data.toString());
		play_part(msg.data.toString());
		//Tu je bilo ono sve dugo zakomentirano
	};

	ws.onclose = function (e) {
		console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
		setTimeout(function () {
			connect();
		}, 1000);
	};

	ws.onerror = function (err) {
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

LAST_PART = ''
CUR_PART = 'tisina';
END = 278;

function play_part(part) {
	LAST_PART = CUR_PART;
	CUR_PART = part;
	var agent = $('#agent')[0];
	var end = 0;

	agent.play()

	DONT = (part !== 'tisina') ? true : false;
	if (part === 'tisina') FIRST = !FIRST

	recognition.stop();

	switch (part) {
		case '01':
			agent.currentTime = 0;
			end = 1;
			break;
		case '02':
			agent.currentTime = 1;
			end = 4;
			break;
		case '03':
			agent.currentTime = 4;
			end = 6;
			break;
		default: // 'tisina'
			agent.currentTime = 6;
			end = 12;
			try {
				if (!isMobileBrowser())
					window.recognition.start();
			}
			catch (e) { }
			break;
	}

	END = end;
}


function question(q) {
	window.recognition.stop();
	window.output.innerHTML = q + ' ';
	window.ws.send(q);
}


function isMobileBrowser() {
	return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}