const button = {   
    red:    document.getElementById("red"),
    blue:   document.getElementById("blue"),
    green:  document.getElementById("green"),
    yellow: document.getElementById("yellow"),
    start:  document.getElementById("start")
}

let score = document.getElementById("score").value;

const sound = {
    red:    new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    blue:   new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
    green:  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3")
}

const playSound = color => sound[color].play();

const playColor = (color) => {
    button[color].setAttribute('active', true);
}

let sequence = [];

const newColor = () => {
    const getRandomColor = () => {
        let rnd = Math.floor(Math.random() * 4);
        if (rnd === 0) return 'red';
        if (rnd === 1) return 'blue';
        if (rnd === 2) return 'green';
        if (rnd === 3) return 'yellow';
    }
    sequence.push(getRandomColor());
}

const playSequence = () => {
    sequence.forEach((color, i) => {
        setTimeout(() => {
            playSound(color);
            playColor(color);
        }, i * 1000);
    })
}

const start = () => {
    sequence = [];
    score = 0;
    newColor();
    playSequence();
}

button.start .addEventListener('click',     () => start());
button.red   .addEventListener('mousedown', () => playSound('red'));
button.blue  .addEventListener('mousedown', () => playSound('blue'));
button.green .addEventListener('mousedown', () => playSound('green'));
button.yellow.addEventListener('mousedown', () => playSound('yellow'));