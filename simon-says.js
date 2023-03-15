class SimonSays {
	constructor({ startIndex, sounds = {}, buttons = {}, display = {} } = {}) {
		this.gameRunning = false
		this.currentIndex = 0
		this.sequence = []
		this.display = document.querySelector(display.score)
		this.colors = new Map([[0, 'green'], [1, 'red'], [2, 'yellow'], [3, 'blue']])
		this.buttons = {
			start: document.querySelector(buttons.start),
			green: document.querySelector(buttons.green),
			red: document.querySelector(buttons.red),
			yellow: document.querySelector(buttons.yellow),
			blue: document.querySelector(buttons.blue)
		}
		this.buttons.start.addEventListener('click', this.startGame.bind(this))
		this.buttons.green.addEventListener('click', this.buttonPress.bind(this, 'green'))
		this.buttons.red.addEventListener('click', this.buttonPress.bind(this, 'red'))
		this.buttons.yellow.addEventListener('click', this.buttonPress.bind(this, 'yellow'))
		this.buttons.blue.addEventListener('click', this.buttonPress.bind(this, 'blue'))
		if (typeof startIndex !== 'undefined') {
			for (let i = 0; i < startIndex; i++)
				this.addStep()
		}
		this.init(sounds)
	}

	get currentScore() {
		return this.sequence.length
	}

	get currentSequenceColor() {
		return this.sequence[this.currentIndex]
	}

	async init(sounds) {
		await this.loadHowler()
		this.sounds = {
			green: new window.Howl({ src: [sounds.green] }) || new Audio(sounds.green),
			red: new window.Howl({ src: [sounds.red] }) || new Audio(sounds.red),
			yellow: new window.Howl({ src: [sounds.yellow] }) || new Audio(sounds.yellow),
			blue: new window.Howl({ src: [sounds.blue] }) || new Audio(sounds.blue)
		}
	}

	async loadHowler() {
		const howlerScript = document.createElement('script')
		howlerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.3/howler.min.js'
		return new Promise((resolve, reject) => {
			howlerScript.onload = resolve
			howlerScript.onerror = reject
			document.body.appendChild(howlerScript)
		})
	}

	buttonPress(color) {
		console.log('Button Pressed: ', color)
		clearInterval(this.sequenceInterval)
		this.playStep(color)
		if (this.gameRunning) this.inputCheck(color)
	}

	addStep() {
		const rand = Math.floor(Math.random() * 4)
		this.sequence.push(this.colors.get(rand))
		this.updateScore()
		console.info('Step Added: ', this.colors.get(rand))
	}

	updateScore() {
		this.display.innerHTML = this.currentScore
	}

	startGame() {
		this.gameRunning = true
		this.addStep()
		this.playSequence()
		console.log('Game Started')
	}

	nextRound() {
		console.log('Next Round')
		this.currentIndex = 0
		this.addStep()
		this.playSequence()
	}

	inputCheck(clickedColor) {
		if (clickedColor !== this.currentSequenceColor)
			return this.gameOver()
		this.currentIndex++
		if (this.currentIndex === this.currentScore)
			this.nextRound()
	}

	gameOver() {
		clearInterval(this.sequenceInterval)
		this.currentIndex = 0
		this.sequence = []
		this.updateScore()
		this.gameRunning = false
	}

	playSequence() {
		let stepToPlay = 0
		this.sequenceInterval = setInterval(() => {
			this.playStep(this.sequence[stepToPlay])
			stepToPlay++
			if (stepToPlay === this.currentScore)
				clearInterval(this.sequenceInterval)
		}, 1000)
	}

	playStep(color) {
		this.sounds[color].play()
		this.buttons[color].classList.add('pressed')
		setTimeout(() => {
			this.buttons[color].classList.remove('pressed')
		}, 500)
	}
}

window.simon = new SimonSays({
	startIndex: 3,
	sounds: {
		green: '/sounds/green.mp3',
		red: '/sounds/red.mp3',
		yellow: '/sounds/yellow.mp3',
		blue: '/sounds/blue.mp3',
	},
	buttons: {
		start: '#startButton',
		green: '#green',
		red: '#red',
		yellow: '#yellow',
		blue: '#blue',
	},
	display: {
		score: '#score'
	}
})