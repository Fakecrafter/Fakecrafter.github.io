let totype = "";
const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
let inputbox = document.getElementById("typebox");
let accept = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,;.:-#'+*!\"â‚¬$%&/()=? Backspace";
let typed = "";
let secondsLeft = 60;
let seconds = 60;
let mistakes = new Set([]);
let textbox = document.getElementById("textbox");
let wpmbox = document.getElementById("wpm");
let curr_word = 0;
reset();

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

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


// TODO: read text files into memory
// TODO: calculate speed
// TODO: colors

let timer = setInterval(() => {
	if (gamestart == true) {
		document.getElementById("timer").innerHTML = secondsLeft;
		secondsLeft--;
		if (secondsLeft == 0) {
			endgame(typedtext, mistakes, seconds - secondsLeft);
			reset()
		}
	}
}, 1000);

async function reset() {
	gamestart = false;
	mistakes = new Set([]);
	secondsLeft = seconds;
	totype = "";
	typedtext = "";
	curr_word = 0;
	textbox.scrollTop = 0;
	textbox.innerHTML = "";
	document.getElementById("endcontainer").style.display = "none";
	document.getElementById("container").style.display = "block";
	document.getElementById("timer").innerHTML = "Wikitype";
	inputbox.value = '';
	inputbox.focus();
	totype = await getRandomQuote();
	transformText(totype);
}

// this needs some improvement
// still some bugs
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

typebox.addEventListener('input', updateValue);

function updateValue(event) {
	if (gamestart == false) {
		document.getElementById("timer").innerHTML = secondsLeft;
		gamestart = true;
	}
	if (event.inputType == "insertText") {
		if (event.data == " ") {
			if (compare(typebox.value, document.getElementById(curr_word).innerText + ' ', true) == true) mistakes.add(curr_word);
			if (typebox.value == '') {
				typebox.value = '';
				return;
			} else {
				typedtext += typebox.value;
				typebox.value = null;
				console.log(totype.split(" ").length);
				console.log(curr_word);
				curr_word += 1;
				if (totype.split(" ").length == curr_word) {
					console.log("the end");
					endgame(typedtext, mistakes, seconds - secondsLeft);
				}
			}
		}
	} 
	if (compare(typebox.value, document.getElementById(curr_word).innerText) == true) {
		mistakes.add(curr_word);
	} else if (mistakes.has(curr_word)) {
		mistakes.delete(curr_word);
	}
	transformText(totype);
	let myElement = document.getElementById(curr_word);
	myElement.scrollIntoView();
}
