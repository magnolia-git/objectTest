//A constant work in progress. Will eventually add song selection, with each song accompanied by a text file containing the bpm and array of beats (probably 2 text files for normal and hard). Song is hard-coded for now, more or less!

// This array is where scheduled beats go.
const array = [];

//beattable holds the beats initially. Their value is how long it takes to show up. (8 = 8 beats until it shows up)
let beattable = [8,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,40/12,8/12,30/12,10/12,2/3,40/12,14/12,1,1,10/12,8/12,1,1/2,1/2,1,1/2,1/2,1,1/2,1/2,1,1/2,1/2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1/2,1/2,1,1,1,1,1,1,1,1/2,1/2,1,1,1,1,1,1,1,1/2,1/2,1,1,1];

//beattype holds the type of notes. Either 0 for white notes or 1 for red notes (some are like 0.000 just for readability. Having this right next to beattable helped me keep track of both tables)
let beattype =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.000,0.00,0.000,0.000,0.0,0.000,0.000,0,0,0.000,0.00,1,1.0,0.0,1,1.0,0.0,1,1.0,0.0,1,1.0,0.0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1.0,0.0,0,0,0,0,0,0,1,1.0,0.0,0,0,0,0,0,0,1,1.0,0.0,0,0,0];

//y'know, the bpm of a song.
let bpm = 138;

//let beattable = [8,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
//let beattype =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
//let bpm = 134.290;

let cnvs, ctx, song;
let score = 0;
let bestChain = 0;
let playing = false;
let redChain = false;

//masterLocation helps with placing the beats where they need to be, starting at x position of 40.
let masterLocation = 40;

    //////////////////////////////////// keyEvent //////////////////////////////////////////////////////
  // handles some initial setup when the page loads, such as defining the canvas and its context. ////
////////////////////////////////////////////////////////////////////////////////////////////////////
function keyEvent() {
	cnvs = $("myCanvas");
	ctx = cnvs.getContext("2d");
	window.addEventListener("keydown", testHit);
	//translated the context so that the center of the canvas's x position is 0.
	ctx.translate(cnvs.width * 0.5, 0);
	song = $("myAudio");
}

    //////////////////////////////////// BeatMarker ////////////////////////////////////////////////////
  // class. Makes an object out of a beat. ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class BeatMarker {
	constructor(length, type, pos) {
		this.state = {
			value: 0,
			length: length,
			type: type,
			pos: pos,
			previousType: 0,
			nextType: 0
		};
		// notes are placed 90 pixels apart, multiplied by the beat's length.
		masterLocation = masterLocation + 90 * this.state.length;
		// stored in the beat's value.
		this.state.value = masterLocation;
	}
}

    ///////////////////////////////////// make /////////////////////////////////////////////////////////
  // creates the objects and pushes them to an array, named array. ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
function make() {
	beattable.forEach((element, index) => {
		let newGuy = new BeatMarker(element, beattype[index], array.length);
		if (index - 1 >= 0) {
			// store the type of the previous note. used for the red notes primarily.
			newGuy.state.previousType = beattype[index - 1];
		}
		if (index + 1 != beattable.length) {
			// store the type of the next note. used for the red notes primarily.
			newGuy.state.nextType = beattype[index + 1];
		}
		array.push(newGuy);

	});
}

    ///////////////////////////////////// remove ///////////////////////////////////////////////////////
  // I have no clue what this does. //////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
function remove() {
	if (array.length == 0) {
		console.log("Array is empty, no beats!");
	} else {
		array.shift();
	}
}

    ///////////////////////////////////// testHit //////////////////////////////////////////////////////
  // to be renamed later on. runs every time a key is pressed. checks the 1st beat's value. //////////
////////////////////////////////////////////////////////////////////////////////////////////////////
function testHit() {
	let val2 = 0;
	let val = array[0].state.value;
	if (array.length > 1) val2 = array[1].state.value;

	if (val >= 10.0 && val < 25.0) onLate();
	else if (val >= 25.0 && val <= 55.0) onTime();
	else if (val2 >= 25.0 && val2 <= 55.0) {
		remove();
		onTime();
	}
	else if (val > 55.0 && val <= 70.0) onEarly();
	else onMiss();
	$("score").innerHTML = score;
	remove();
}

function redCode() {
	let val = array[0].state;
	if (val.previousType == 0 || (redChain == true && val.nextType == 1)) {
		return 1;
	} else if (val.nextType == 0 && redChain == true) {
		return 2;
	} else {
		return 0;
	}
}

function onTime() {

	if (array[0].state.type == 1) {
		let decision = redCode();
		if (decision == 0) {
			redChain = false;
			onMiss();
		} else if (decision == 1) {
			redChain = true;
			playSound("great");
		} else if (decision == 2) {
			$("rank").innerHTML = "GREAT";
			if (score == bestChain) {
				score++;
				bestChain = score;
				$("best").innerHTML = bestChain;
			} else {
				score++;
			}
			playSound("great");
			redChain = false;
		}
	} else {
		$("rank").innerHTML = "GREAT";
		if (score == bestChain) {
			score++;
			bestChain = score;
			$("best").innerHTML = bestChain;
		} else {
			score++;
		}
		playSound("great");
	}
}

function onLate() {
	$("rank").innerHTML = "LATE";
	score = 0;
	playSound("late");
}

function onEarly() {
	$("rank").innerHTML = "EARLY";
	score = 0;
	playSound("early");
}

function onMiss() {
	$("rank").innerHTML = "MISS";
	score = 0;
	playSound("miss");
}

function clearCanvas() {
	ctx.clearRect(-500,0, cnvs.width, cnvs.height);
	ctx.drawImage(pressPointRight, 41, 10);
	ctx.drawImage(heart, 0, 10);
	ctx.drawImage(pressPointLeft, -41, 10);
}

function redrawCanvas() {
	if (array.length !== 0) {
			array.forEach(element => {
				// subtracts a certain amount from each beat's value, which acts as its position on screen
				element.state.value-= bpm / 60 * 1.5;
				// beat will be drawn if its value is 40 or greater
				if (element.state.value >= 40) {
					// drawing white beats
					if (element.state.type === 0) {
						ctx.drawImage(markerRight, element.state.value, 10);
						ctx.drawImage(markerLeft, element.state.value * -1, 10);
					// drawing red beats
					} else if (element.state.type === 1 && element.state.nextType === 1){
						ctx.drawImage(redMarkerRight, element.state.value, 10);
						ctx.drawImage(redMarkerLeft, element.state.value * -1 - 38, 10);
					} else {
						ctx.drawImage(redMarkerRight2, element.state.value, 10);
						ctx.drawImage(redMarkerLeft2, element.state.value * -1, 10);
					}
				}
				ctx.drawImage(fadeInRight, 260, 10);
				ctx.drawImage(fadeInLeft, -260 * 2, 10);
			});
	}
}

function start() {
	document.addEventListener("visibilitychange", handleVisibilityChange, false);
	make();
	song.play();
	playing = true;
	fly();
}

function handleVisibilityChange() {
	if (document.hidden) {
		song.pause();
		playing = false;
	} else {
		song.play();
		playing = true;
	}
}

function fly() {
		requestAnimationFrame(fly);
		if (playing == true) {
			if (array.length >= 1 && array[0].state.value <= 0) {
				remove();
				redChain = false;
			}
			clearCanvas();
			redrawCanvas();
		}
}

function $(arg) {
	return document.getElementById(arg);
}

function playSound(sound) {
	$(sound).load();
	$(sound).play();
}
