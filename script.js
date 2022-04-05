let randomwords = ["denken", "bauen", "aber", "alle", "alt", "Auto", "finden", "Hand", "heute", "hoch", "halten", "schreiben", "werden", "von", "vor", "die", "der", "das", "wie", "warum", "Menschen", "Mann", "Frau", "also", "lesen", "gerade", "so", "zwischen", "in", "hier", "Deutschland", "Weltall", "Leben", "dass", "Problem", "genau", "gegen", "dem", "sowie", "den", "jetzt", "immer", "wurde", "dann", "beim", "ins", "habe", "haben", "eins", "zwei", "drei", "vier", "alles", "beiden", "seinen", "seine", "könnte", "können", "Schule", "tun", "Zeit", "schnell", "spielen"];
// plain text: what to write
let totype = "";
// wiki-entries or quotes?
let quoteMode = false;
// the text comes from the API_URL
// const API_URL_WIKI = 'https://de.wikipedia.org/w/api.php?action=query&prop=extracts&titles=Richard_Stallman&formatversion=2&explaintext=true&exsectionformat=plain&format=json&origin=*';
const API_URL = 'https://api.quotable.io/random';
// where you type
let inputbox = document.getElementById("typebox");
// only let the user type this characters
let accept = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,;.:-#'+*!\"â‚¬$%&/()=? Backspace";
// what did the user already type
let typed = "";
// how many seconds are left
let secondsLeft = 30;
// reset-value
let seconds = 30;
// where did you make mistakes
let mistakes = new Set([]);
let textbox = document.getElementById("textbox");
let wpmbox = document.getElementById("wpm");
// the word that you are typing right now
let curr_word = 0;
reset();

function get_random (list) {
  return list[Math.floor((Math.random()*list.length))];
}

// get text from API_URL
async function getRandomQuote() {
	let response = await fetch(API_URL);
	if (!response.ok) {
		throw Error(response.statusText);
	}
	const json = response.json();
	return json;
}


// format plain text into textbox (include mistakes)
// pretty inefficient because it runs every character
// ... who cares ...
function transformText(text) {
	let textlist = text.split(" ");
	textbox.innerHTML = '';
	for (i=0; i < textlist.length; i++) {
		let word = document.createElement('span');
		word.innerText = textlist[i];
		word.id = i;
		if (curr_word == i) {
			word.classList.add('curr_word');
		}
		if (curr_word < i) {
			word.classList.add('word');
		}
		if (curr_word > i) {
			word.classList.add('word');
			word.classList.add('typed_word');
		}
		if (mistakes.has(i) == true) {
			word.classList.add('error');
		}
		textbox.appendChild(word);
		let space = document.createElement('span');
		space.innerText = " ";
		space.classList.add('word');
		textbox.appendChild(space);
	}
}

function toggleQuoteMode() {
	quoteMode = !quoteMode;
	reset();
}


// set the timer
let timer = setInterval(() => {
	if (gamestart == true) {
		document.getElementById("timer").innerHTML = secondsLeft;
		secondsLeft--;
		if (secondsLeft == 0) {
			endgame(typedtext, mistakes, seconds - secondsLeft);
		}
	}
}, 1000);

// reset the whole thing
async function reset() {
	gamestart = false;
	mistakes = new Set([]);
	secondsLeft = seconds;
	totype = "";
	typedtext = "";
	curr_word = 0;
	textbox.innerHTML = "";
	document.getElementById("endcontainer").style.display = "none";
	document.getElementById("container").style.display = "block";
	document.getElementById("timer").innerHTML = "Wikitype";
	inputbox.value = '';
	inputbox.focus();
	if (quoteMode) {
		totype = await getRandomQuote();
		totype = totype.content;
	}
	if (!quoteMode) {
		for (i=0; i<300; i++) {
			totype += get_random(randomwords);
			totype += ' ';
		}
		totype.trim();
	}
	textbox.scrollTop = 0;
	transformText(totype);

}

// compare different strings
// complete means that the word is already finished so it checks if the word is complete
// pretty self-explanatory
function compare(typed, totype, complete) {
	if (complete == true) {
		if (typed != totype) {
			return true;
		}
	}
	if (typed != totype.slice(0, typed.length)) {
		return true;
	} else {
		return false;
	}
}

// end game and show speed and accuracy
// include time into calculation
function endgame(typed, mistakes, time) {
	let timecalc = 60/time;
	let words = typed.split(" ").length;
	let accuracy = 1 - mistakes.size / words;
	console.log(words + ' ' + accuracy + ' ' + timecalc);
	let wpm = Math.floor(words * accuracy * timecalc);
	document.getElementById('container').style.display = "none";
	document.getElementById("timer").innerHTML = "Wikitype";
	document.getElementById("endcontainer").style.display = "block";
	document.getElementById("wpm").innerHTML = "WPM: " + wpm;
	document.getElementById("accuracy").innerHTML = "ACCURACY: " + Math.floor(accuracy * 100) + "%";
	gamestart = false;
}



// you can restart the game with tab
// very handy
// this listens for tab
document.addEventListener("keydown", function (event) {
	var TABKEY = 9;
    if(event.keyCode == TABKEY) {
		if(event.preventDefault) {
			event.preventDefault();
		}
		reset();
		return false;
	}
	if (event.defaultPrevented) {
		return; // Do nothing if the event was already processed
	}
}, true);

// this listens for input in the eventbox
typebox.addEventListener('input', updateValue);

function updateValue(event) {
	if (gamestart == false) {
		document.getElementById("timer").innerHTML = secondsLeft;
		gamestart = true;
	}
	if (event.inputType == "insertText") {
		// clear inputbox if space is pressed
		if (event.data == " ") {
			// check for mistakes
			if (compare(typebox.value, document.getElementById(curr_word).innerText + ' ', true) == true) mistakes.add(curr_word);
			// this doesnt work
			if (typebox.value == '') {
				typebox.value = '';
				return;
			} else {
				typedtext += typebox.value;
				typebox.value = null;
				curr_word += 1;
				// end the game
				if (totype.split(" ").length == curr_word) {
					console.log("the end");
					endgame(typedtext, mistakes, seconds - secondsLeft);
				}
			}
		}
	} 
	// now you can correct things
	if (compare(typebox.value, document.getElementById(curr_word).innerText) == true) {
		mistakes.add(curr_word);
	} else if (mistakes.has(curr_word)) {
		mistakes.delete(curr_word);
	}
	transformText(totype);
	let myElement = document.getElementById(curr_word);
	// always "focus" the current word
	myElement.scrollIntoView();
}
