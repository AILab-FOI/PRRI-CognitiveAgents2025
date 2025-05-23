var DONT = false;
var FIRST = true;
var STOP = false;
var trenutniPassage="";
let corti;

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
	//document.getElementById('questions').style.display = 'block';
	play_part('tisina');
	//question('bok');
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
				trenutniPassage = msg.data.split(':')[1];
				console.log("Ajs Trenutni passage:", trenutniPassage); // ← korisno za debug
				corti = new Agent(sessionStorage.getItem("corti"));		
				playVideoOnPassageLoad();
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

	function playVideoOnPassageLoad()
	{
		switch(trenutniPassage)
		{
			case '000101':	//passage Federacija 1
			case '000103':	//passage Odabir1 => skeptical federacija
			case '000203':	//passage Odabir2 => neutral federacija
			case '000303':	//passage Odabir3 => optimistic federacija
			case '030101':  //passage Prica3.0 => Vraxili dolaze
			case '050505':	//passage Prica3.1 => grananje prema trustu
			case '030102': 	//passage Prica3.1a => corti will help
			case '030202':  //passage Prica3.1b => corti wont help
			case '040107': 	//passage Prica4.5 => zavrsetak prema odlukama strategije
			case '040108': 	//good ending, we won
			case '050101': 	//passage Prica5.1 =>we are alone and they are coming 
			case '050107': 	//bad ending
			play_part(trenutniPassage);
			break;

			case '040101': //passage Prica4.2
			case '040103': //passage Prica4.3
			case '040105': //passage Prica4.5
			case '050102': //passage Prica5.2
			case '050104': //passage Prica5.3
			case '050106': //passage Prica5.4
			play_part(trenutniPassage.substring(0,2) + "00" + trenutniPassage.substring(4,6));
			break;

			default:;
		}
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

    switch (part) 
	{
		//ON_PASSAGE_LOAD

		//passage Federacija1	
		case '000101':
			playVideoAtTimestamp(535,552);
			switchToNextPassage("Federacija2");
			break;

		//passage Odabir1 => skeptical federacija
		case '000103':
			playVideoAtTimestamp(554,563);
			switchToNextPassage("Prica1.1");
			break;
		
		//passage Odabir2 => neutral federacija
		case '000203':
			playVideoAtTimestamp(565, 575);
			switchToNextPassage("Prica1.1");
			break;

		//passage Odabir3 => optimistic federacija
		case '000303':
			playVideoAtTimestamp(578,586);
			switchToNextPassage("Prica1.1");
			break;
			
		//passage Prica3.0 => Vraxili dolaze
		case '030101':
			playVideoAtTimestamp(593,616);
			switchToNextPassage("Prica3.1");
			break;

		//passage Prica3.1 => grananje prema trust ranku
		case "050505":
			playVideoAtTimestamp(624,635);
			if(corti.getTrustRank()=="Trusted")
				switchToNextPassage("Prica3.1a");
			else 
				switchToNextPassage("Prica3.1b");
			break;
		
		//passage Prica3.1a => corti will help
		case '030102':
			playVideoAtTimestamp(642,655);
			switchToNextPassage("Prica4.2");
			break;	

		//passage Prica3.1b => corti wont help
		case '030202':
			playVideoAtTimestamp(656, 665);
			switchToNextPassage("Prica5.1");
			break;

		//passage Prica4.2
		case '040001':
			playVideoAtTimestamp(674,680);
			break;
				
		//passage Prica4.3
		case '040003':
			playVideoAtTimestamp(683,691);
			break;

		//passage Prica4.4
		case '040005':
			playVideoAtTimestamp(693,700);
			break;

		//passage Prica4.5 => strategija bitke je win ili ne bas win
		case '040107':
			//if then switch to dobar passage
			switchToNextPassage("Prica4.5a");
			break;

		//passage Prica4.5a
		case '040108':
			playVideoAtTimestamp(703,737);
			switchToNextPassage("Prica4.6a");
			break;

		//passage Prica5.1
		case '050101':
			playVideoAtTimestamp(766,778);
			switchToNextPassage("Prica5.2");
			break;

		//passage Prica5.2
		case '050002':
			playVideoAtTimestamp(778,784);
			break;

		//passage Prica5.3
		case '050004':
			playVideoAtTimestamp(785,791);
			break;
		
		//passage Prica5.4
		case '050006':
			playVideoAtTimestamp(791,801);
			break;

		//passage Prica5.4a
		case '050107':
			playVideoAtTimestamp(803,827);
			break;

		//ON_QUESTION_ASKED
		
		//passage Federacija2
		case '000102':
			if (isWrongPassage(part)) break;
			switchToNextPassage("Prica4.5a"); //krivo napisano u twine ali svejedno radi
			break;

		case '000202':
			if (isWrongPassage(part)) break;
			switchToNextPassage("Prica4.5b");  //krivo napisano u twine ali svejedno radi
			break;

		case '000302':
			if (isWrongPassage(part)) break;
			switchToNextPassage("Prica4.5c");  //krivo napisano u twine ali svejedno radi
			break;

		//passage Prica1.1
        case '010101':
			if (isWrongPassage(part)) break;
			corti = new Agent();  // mislim da ne moram jer onMessage kreira ali da budem siguran da se uvijek kreće ispočetka, jer ne znam kad se briše StorageSession
			corti.IncreaseTrust();
			playVideoAtTimestamp(0,13);
			switchToNextPassage("Prica1.2");
			break;
			
		case '010201':   
			if (isWrongPassage(part)) break;
			corti = new Agent();	// mislim da ne moram jer onMessage kreira ali da budem siguran da se uvijek kreće ispočetka, jer ne znam kad se briše StorageSession
			playVideoAtTimestamp(123,135);
			switchToNextPassage("Prica1.2");
            break;

		case '010301':   
			if (isWrongPassage(part)) break;
			corti = new Agent();	// mislim da ne moram jer onMessage kreira ali da budem siguran da se uvijek kreće ispočetka, jer ne znam kad se briše StorageSession
			corti.DecreaseTrust();
			playVideoAtTimestamp(238,247);
			switchToNextPassage("Prica1.2");
            break;

		//passage Prica1.2
		case '010102':
			if (isWrongPassage(part)) break;
			corti.IncreaseTrust();
			playVideoAtTimestamp(21,33);
			switchToNextPassage("Prica1.3");
            break;

		case '010202': 
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(143,153);
			switchToNextPassage("Prica1.3");
			break;

		case '010302':
			if (isWrongPassage(part)) break;   
			corti.DecreaseTrust();
			playVideoAtTimestamp(255,265);
			switchToNextPassage("Prica1.3");
			break;

		//passage Prica1.3
		case '010103':
			if (isWrongPassage(part)) break;
			corti.IncreaseTrust();
			playVideoAtTimestamp(42,56);
			switchToNextPassage("Prica1.4");
            break;

		case '010203':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(161,172);
			switchToNextPassage("Prica1.4");
            break;

		case '010303':
			if (isWrongPassage(part)) break;
			corti.DecreaseTrust();
			playVideoAtTimestamp(273,284);
			switchToNextPassage("Prica1.4");
            break;

		//passage Prica1.4
		case '010104':
			if (isWrongPassage(part)) break;
			corti.IncreaseTrust();
			playVideoAtTimestamp(64,76);
			switchToNextPassage("Prica1.5");
			break;

		case '010204':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(181,193);
			switchToNextPassage("Prica1.5");
            break;

		case '010304':
			if (isWrongPassage(part)) break;
			corti.DecreaseTrust();
			playVideoAtTimestamp(292,303);
			switchToNextPassage("Prica1.5");
            break;

		//passage Prica1.5
		case '010105':
			if (isWrongPassage(part)) break;
			corti.IncreaseTrust();
			playVideoAtTimestamp(85,96);
			switchToNextPassage("Prica1.6");
            break;

		case '010205':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(202,213);
			switchToNextPassage("Prica1.6");
            break;

		case '010305':
			if (isWrongPassage(part)) break;
			corti.DecreaseTrust();
			playVideoAtTimestamp(311,323);
			switchToNextPassage("Prica1.6");
            break;

		//passage Prica1.6	
		case '010106':
			if (isWrongPassage(part)) break;
			corti.IncreaseTrust();
			playVideoAtTimestamp(105,114);
			switchToNextPassage("Prica1.7");
			break;

		case '010206':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(221,229);
			switchToNextPassage("Prica1.7");
			break;

		case '010306':
			if (isWrongPassage(part)) break;
			corti.DecreaseTrust();
			playVideoAtTimestamp(331,343);
			switchToNextPassage("Prica1.7");
			break;

		//passage Prica2.1
		case '020101':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(368,379);
			switchToNextPassage("Prica2.2");
			break;

		case '020201':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(387,395);
			switchToNextPassage("Prica2.2");
			break;

		//passage Prica2.2
		case '020102':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(404,412);
			switchToNextPassage("Prica2.3");
			break;

		case '020202':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(421,430);
			switchToNextPassage("Prica2.3");
			break;

		//passage Prica2.3
		case '020103':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(438,445);
			switchToNextPassage("Prica2.4");
			break;

		case '020203':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(453,459);
			switchToNextPassage("Prica2.4");
			break;

		//passage Prica2.4
		case '020104':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(467,473);
			switchToNextPassage("Prica2.5");
			break;

		case '020204':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(481,489);
			switchToNextPassage("Prica2.5");
			break;

		//passage Prica2.5
		case '020105':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(498,505);
			switchToNextPassage("Prica3.0");
			break;
		
		case '020205':
			if (isWrongPassage(part)) break;
			playVideoAtTimestamp(513,519);
			switchToNextPassage("Prica3.0");
			break;

		
		//passage Prica4.2
			case '040101':
				//promjena varijable tactics
				switchToNextPassage("Prica4.2a");
				switchToNextPassage("Prica4.3");
				break;

			case '040201':
				//promjena varijable tactics
				switchToNextPassage("Prica4.2a");
				switchToNextPassage("Prica4.3");
				break;

		//passage Prica4.3
			case '040103':
				//promjena varijable tactics
				switchToNextPassage("Prica4.3a");
				switchToNextPassage("Prica4.4");
				break;
			
			case '040203':
				//promjena varijable tactics
				switchToNextPassage("Prica4.3a");
				switchToNextPassage("Prica4.4");
				break;
			
		//passage Prica4.4
		case '040105':
			//promjena varijable tactics
			switchToNextPassage("Prica4.4a");
			switchToNextPassage("Prica4.5");
			break;

		case '040205':
			//promjena varijable tactics
			switchToNextPassage("Prica4.4a");
			switchToNextPassage("Prica4.5");
			break;

		//passage Prica5.2
			case '050102':
			//nema varijable tactics
			switchToNextPassage("Prica5.2a");
			switchToNextPassage(("Prica5.3"));
			break;

		case '050202':
			//nema varijable tactics
			switchToNextPassage("Prica5.2b");
			switchToNextPassage(("Prica5.3"));
			break;

		//passage Prica5.3
		case '050104':
			//nema varijable tactics
			switchToNextPassage("Prica5.3a");
			switchToNextPassage(("Prica5.4"));
			break;

		case '050204':
			//nema varijable tactics
			switchToNextPassage("Prica5.3b");
			switchToNextPassage("Prica5.4");
			break;
		
		//passage Prica5.4
		case '050106':
		case '050206':
			//nema varijable tactics
			switchToNextPassage("Prica5.4a");
			break;

		// 'tisina'
        default: 
			playVideoAtTimestamp(522,527);
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
	function switchToNextPassage(passageName)
	{
		let delay = (end - agent.currentTime) * 1000;
		setTimeout( ()=> 
			{
				if (window.ws && window.ws.readyState === WebSocket.OPEN) 
					window.ws.send("TWINE_COMMAND:DO_TRANSITION:" + passageName);
				else
					console.log("error kod slanja passagea \"" + passageName + "\".");
			}
		, delay); 
		sessionStorage.setItem("corti", corti.exportForSessionStorage());
		console.warn("trust: " + corti.getTrustRank() + "\nvalue: " + corti.exportForSessionStorage()); //debug info
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

	function playVideoAtTimestamp(startPoint, endPoint)
	{
		agent.currentTime = startPoint;
		end = endPoint;
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