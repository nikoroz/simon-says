class SimonSays {
  constructor({ startLevel, sounds = {}, buttons = {}, display = {} } = {}) {
    this.gameRunning = false
    this.startLevel = startLevel || 0
    this.score = 0
    this.currentIndex = 0
    this.sequence = []
    this.display = document.querySelector(display.score)
    this.colors = new Map([[0, 'green'], [1, 'red'], [2, 'yellow'], [3, 'blue']])
    this.buttons = {
      start:  document.querySelector(buttons.start),
      next:   document.querySelector(buttons.next),
      green:  document.querySelector(buttons.green),
      red:    document.querySelector(buttons.red),
      yellow: document.querySelector(buttons.yellow),
      blue:   document.querySelector(buttons.blue)
    }
    this.buttons.start.addEventListener('click', this.playRound.bind(this))
    this.buttons.next.addEventListener('click', this.playRound.bind(this))
    this.buttons.green.addEventListener('click', this.buttonPress.bind(this, 'green'))
    this.buttons.red.addEventListener('click', this.buttonPress.bind(this, 'red'))
    this.buttons.yellow.addEventListener('click', this.buttonPress.bind(this, 'yellow'))
    this.buttons.blue.addEventListener('click', this.buttonPress.bind(this, 'blue'))
    this.buttons.next.disabled = true
    if (this.startLevel) {
      for (let i = 0; i < startLevel + 1; i++)
        this.addStep()
    }
    this.init(sounds)
  }

  get currentSequenceColor() {
    return this.sequence[this.currentIndex]
  }

  async init(sounds) {
    await this.loadHowler()
    this.sounds = {
      green:  new window.Howl({ src: [sounds.green] }) 	|| new Audio(sounds.green),
      red:    new window.Howl({ src: [sounds.red] }) 		|| new Audio(sounds.red),
      yellow: new window.Howl({ src: [sounds.yellow] }) || new Audio(sounds.yellow),
      blue:   new window.Howl({ src: [sounds.blue] }) 	|| new Audio(sounds.blue)
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

  enableColors(setting = true) {
    const action = setting ? 'remove' : 'add'
    this.buttons.green.classList[action]('playing-sequence')
    this.buttons.red.classList[action]('playing-sequence')
    this.buttons.yellow.classList[action]('playing-sequence')
    this.buttons.blue.classList[action]('playing-sequence')
  }

  buttonPress(color) {
    console.log('Button Pressed: ', color)
    //clearInterval(this.sequenceInterval)
    this.playStep(color)
    if(!this.gameRunning) return
    if (this.checkInput(color)){
      if (this.currentIndex === this.score) {
        this.gameRunning = false
        this.currentIndex = 0
        this.buttons.next.disabled = false
        this.score++
        this.updateScore(this.score)
      }
      else this.currentIndex++
    }
    else this.gameOver()
  }

  addStep() {
    const rand = Math.floor(Math.random() * 4)
    this.sequence.push(this.colors.get(rand))
    console.info('Step Added: ', this.colors.get(rand))
  }

  updateScore(score) {
    this.display.innerHTML = score
  }

  playRound() {
    this.buttons.start.disabled = true
    this.buttons.next.disabled = true
    this.addStep()
    this.playSequence()
  }

  checkInput(clickedColor) {
    return this.currentSequenceColor === clickedColor
  }

  gameOver() {
    clearInterval(this.sequenceInterval)
    this.gameRunning = false
    this.buttons.start.disabled = false
    this.currentIndex = 0
    this.sequence = []
  }

  playSequence() {
    let stepToPlay = 0
    this.enableColors(false)
    this.sequenceInterval = setInterval(() => {
      this.playStep(this.sequence[stepToPlay])
      if (stepToPlay === this.score){
        clearInterval(this.sequenceInterval)
        this.gameRunning = true
        this.enableColors(true)
      }
      stepToPlay++
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
  startLevel: 0,
  sounds:     {
    green:  'https://github.com/nikoroz/simon-says/blob/master/sounds/green.mp3?raw=true',
    red:    'https://github.com/nikoroz/simon-says/blob/master/sounds/red.mp3?raw=true',
    yellow: 'https://github.com/nikoroz/simon-says/blob/master/sounds/yellow.mp3?raw=true',
    blue:   'https://github.com/nikoroz/simon-says/blob/master/sounds/blue.mp3?raw=true',
  },
  buttons: {
    start:  '#startButton',
    next:   '#playNext',
    green:  '#green',
    red:    '#red',
    yellow: '#yellow',
    blue:   '#blue',
  },
  display: {
    score: '#score'
  }
})