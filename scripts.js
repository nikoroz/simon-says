//Indikator för om spelaren har startat spelet eller ej. Är det false kan man trycka hur mycket man vill på färgerna.
var gameRunning = false;
//Variabel som ändras till en visst värde när spelaren har tryckt på en färg:
var userClick = "";
//Indikerar om sekvensen var korrekt. Ändras variabeln till false så kommer spelet att avslutas.
var correctSequence = true;
//Array som skall lagra spelsekvensen.
var sequence = [];
//Knyter sekvensmätarens element i HTML-koden till en variabel.
var sequenceCountDisplay = document.getElementById("sequenceCountDisplay");
//Håller koll på vilket index i sekvensen som skall kontrolleras just nu:
var currentIndex = 0;

var startButton = document.getElementById("startButton");	//Knyter en variabel till startknappen i HTML-koden.
startButton.addEventListener("click", startGame);			//När användaren klickar på startknappen körs funktionen startGame.

//Deklarerar 4 variabler som kopplas till de 4 knapparna i HTML-koden och en specifik funktion som körs när man trycker på respektive knapp.
var buttonGreen = document.getElementById("buttonGreen");
buttonGreen.addEventListener("click", buttonPressGreen);
var buttonRed = document.getElementById("buttonRed");
buttonRed.addEventListener("click", buttonPressRed);
var buttonBlue = document.getElementById("buttonBlue");
buttonBlue.addEventListener("click", buttonPressBlue);
var buttonYellow = document.getElementById("buttonYellow");
buttonYellow.addEventListener("click", buttonPressYellow);

//Länkar 4 olika ljud till 4 olika variabler för varje färg.
var greenSound 	= new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
var redSound 	= new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
var yellowSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
var blueSound 	= new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");

//När användaren trycker på grön knapp:
function buttonPressGreen()
{	
	//Väntar 175 millisekunder och spelar sedan upp det färgspecifika ljudet.
	setTimeout(function(){greenSound.play();},175);
	//Ändrar userClick till färgen som har klickats
	userClick = "green";
	//Om spelet är igång så ska 'userClick' kontrolleras med funktionen 'inputCheck'
  	if (gameRunning) inputCheck();
}
//När användaren trycker på röd knapp:
function buttonPressRed()
{		
	setTimeout(function(){redSound.play();},175);
  	userClick = "red";
  	if (gameRunning) inputCheck();
}
//När användaren trycker på blå knapp:
function buttonPressYellow()
{	
	setTimeout(function(){yellowSound.play();},175);
  	userClick = "yellow";
  	if (gameRunning) inputCheck();
}
//När användaren trycker på gul knapp:
function buttonPressBlue()
{		
	setTimeout(function(){blueSound.play();},175);
  	userClick = "blue";
  	if (gameRunning) inputCheck();
}

//Funktion som genererar ett nytt steg i spelsekvensen:
function generateSequenceStep()
{
	//Slumpar ett heltal f.om. 0 t.om. 3
	var randomNumber = Math.floor(Math.random() * 4);
	
	//Beroende på vilket nummer som slumpats ovan pushas(läggs till i slutet) respektive färg till arrayen sequence.
	switch(randomNumber) 
	{
		case 0: sequence.push("green");
			break;
		case 1: sequence.push("red");
			break;
		case 2: sequence.push("yellow");
			break;
		case 3: sequence.push("blue");
			break;
	}
}

//Funktion för att spela upp den genererade sekvensen:
function playbackSequence()
{	
	//Lokal variabel för att hålla koll på vilket index i sequence som kontrolleras
	var tempCurrentIndex = 0;
	//Repeterar följande kod var 900e millisekund:
	setInterval(function()
	{
		//Beroende på vilket nuvarande index är ändras genomskinligheten för respektive färg och ett ljud spelas upp
		if (sequence[tempCurrentIndex] == "green")
		{
			buttonGreen.style.opacity = "0.4";
			greenSound.play();
		}else if(sequence[tempCurrentIndex] == "red")
		{
			buttonRed.style.opacity = "0.4";
			redSound.play();
		}else if(sequence[tempCurrentIndex] == "yellow")
		{
			buttonYellow.style.opacity = "0.4";
			yellowSound.play();
		}else if(sequence[tempCurrentIndex] == "blue")
		{
			buttonBlue.style.opacity = "0.4";
			blueSound.play();
		}
		//Ökar den lokala indexvariabeln med 1
		tempCurrentIndex++;
		//Väntar 750 millisekunder innan genomskinligheten återställs
		setTimeout(function()
		{	
			buttonGreen.style.opacity  = "1";
			buttonRed.style.opacity    = "1";
			buttonYellow.style.opacity = "1";
			buttonBlue.style.opacity   = "1";
		}, 750);
		//Om den lokala indexvariabeln nu är större än längden på arrayen sequence, avsluta repetition.
		if (tempCurrentIndex > sequence.length) clearInterval();
	}, 900);
}

//Funktion för kontroll av användarval(körs varje gång användaren trycker på en färg):
function inputCheck()
{	
	//Om userClick är detsamma som nuvarande index i sequence, öka index. Annars, indikera att sekvensen är inkorrekt.
	if (userClick == sequence[currentIndex]) currentIndex++; else correctSequence = false;
	//Om sekvensen var inkorrekt, kalla funktionen gameOver. Annars, kalla funktionen nextRound.
	if (!correctSequence) gameOver(); else if (currentIndex >= sequence.length) nextRound();
}

//Funktion för meddelande vid förlust:
function gameOver()
{
	if (!correctSequence)
	{
		alert("Game Over! You were able to remember " + (sequence.length - 1) + " steps!");
		//Återställer nuvarande index:
		currentIndex = 0;
		//Indikerar att spelet har tagit slut. Användaren kan leka med knapparna igen:
		gameRunning = false;
	}
}

//Funktion som kallas när användaren trycker på startknappen:
function startGame()
{
	//Indikerar att spelet har börjat:
	gameRunning = true;
	//Återställer nuvarande index:
	currentIndex = 0;
	//Återställer spelsekvensen:
	sequence = [];
	//Återställer variabel som indikerar att användaren har gjort fel val:
	correctSequence = true;
	//Kör funktionen som genererar en ny sekvens:
	generateSequenceStep();
	//Uppdaterar antalet steg i sekvensen till sekvensmätaren i HTML-dokumentet:
	sequenceCountDisplay.innerHTML = sequence.length;

	//Väntar 750ms och kallar sedan på funktionen som spelar upp den nya sekvensen:
	setTimeout(function(){playbackSequence();}, 750);
}

//Funktion som startar en ny runda efter en korrekt sekvens:
function nextRound()
{
	//Återställer nuvarande index:
	currentIndex = 0;
	//Kallar på funktionen som genererar nästa steg i sekvensen:
	generateSequenceStep();
	//Uppdaterar antalet steg i sekvensen till sekvensmätaren i HTML-dokumentet:
	sequenceCountDisplay.innerHTML = sequence.length;
	//Väntar 750ms och kallar sedan på funktionen som spelar upp den nya sekvensen:
	setTimeout(function(){playbackSequence();}, 750);
}