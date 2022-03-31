let totype = "what if this is even longer and longer and much more longer bla bla bla bla bla hey how are you today i want to know how much you flex today so lets gooooooootype this text or you die this needs to be a bit longer and just a little bit. now we got it";
let inputbox = document.getElementById("typebox");
let accept = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,;.:-#'+*!\"â‚¬$%&/()=? Backspace";
let mistakes = [];
let textbox = document.getElementById("textbox");
let curr_word = 0;
reset();

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
		if (curr_word != i) {
			word.classList.add('word');
		}
		if (mistakes.includes(i) == true) {
			console.log(mistakes);
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
			clearInterval(timer);
			reset()
		}
	}
}, 1000);

function reset() {
	gamestart = false;
	mistakes = [];
	secondsLeft = 60;
	typedtext = "";
	curr_word = 0;
	document.getElementById("timer").innerHTML = "Wikitype";
	transformText(totype);
	inputbox.value = '';
	inputbox.focus();
}

// this needs some improvement
// still some bugs
function compare(typed, totype) {
	for (var x = 0; x < typed.length; x++) {
		var a = typed.charAt(x);
		var b = totype.charAt(x);
		if (a != b) {
			if (mistakes.includes(curr_word) == false) {
				mistakes.push(curr_word)
				return;
			}
		} else {
			if (mistakes.includes(curr_word) == true) {
				mistakes.pop();
			}
		}
	}
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
			curr_word = curr_word + 1;
			inputbox.value = null;
		}
	} 
	compare(typebox.value, document.getElementById(curr_word).innerText);
	transformText(totype);
}
