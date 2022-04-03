let totype = readTextFile('typetext/hammer.txt');
let inputbox = document.getElementById("typebox");
let accept = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,;.:-#'+*!\"â‚¬$%&/()=? Backspace";
let typed = "";
let mistakes = new Set([]);
let textbox = document.getElementById("textbox");
let curr_word = 0;
reset();

function readTextFile(file)
{
	fetch(file)
	.then(response => response.text())
	.then(text => console.log(text))
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
			calculatewpm(typedtext, mistakes);
			reset()
		}
	}
}, 1000);

function reset() {
	gamestart = false;
	mistakes = new Set([]);
	secondsLeft = 60;
	typedtext = "";
	curr_word = 0;
	textbox.scrollTop = 0;
	document.getElementById("timer").innerHTML = "Wikitype";
	transformText(totype);
	inputbox.value = '';
	inputbox.focus();
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
function calculatewpm(typed, mistakes) {
	let words = typed.split(" ").length;
	let accuracy = 100 - mistakes.size / words;
	console.log(words + ' ' + accuracy);
	return words * accuracy;
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
				curr_word += 1;
				typedtext += typebox.value;
				typebox.value = null;
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
