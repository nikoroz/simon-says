class SimonSays {
  constructor({ sounds = {}, buttons = {}, settings = {}, display = {} } = {}) {
    this.gameRunning = false
    this.currentIndex = 0
    this.score = 0
    this.sequence = []
    this.display = document.querySelector(display.score)
    this.colors = new Map([[0, 'green'], [1, 'red'], [2, 'yellow'], [3, 'blue']])
    this.buttons = {
      red:    this._getElement(buttons.red),
      blue:   this._getElement(buttons.blue),
      green:  this._getElement(buttons.green),
      yellow: this._getElement(buttons.yellow),
      start:  this._getElement(buttons.start),
      reset:  this._getElement(buttons.reset),
      next:   this._getElement(buttons.next),
    }
    this.buttons.red.addEventListener   ('click', this.buttonPress.bind(this, 'red'))
    this.buttons.blue.addEventListener  ('click', this.buttonPress.bind(this, 'blue'))
    this.buttons.green.addEventListener ('click', this.buttonPress.bind(this, 'green'))
    this.buttons.yellow.addEventListener('click', this.buttonPress.bind(this, 'yellow'))
    this.buttons.start.addEventListener ('click', this.startGame.bind(this))
    this.buttons.reset.addEventListener ('click', this.resetGame.bind(this))
    this.buttons.next.addEventListener  ('click', this.playRound.bind(this))
    this.buttons.next.disabled = true
    this.buttons.reset.disabled = true
    this._gameSpeed =  this._getElement(settings.gameSpeed)
    this._startIndex = this._getElement(settings.startingLevel)
    this.init(sounds)
  }

  get gameSpeed()  {
    const gameSpeed = Number(this?._gameSpeed?.value)
    if (isNaN(gameSpeed)) return 1000
    if (gameSpeed === -2) return 1600
    if (gameSpeed === -1) return 1300
    if (gameSpeed ===  0) return 1000
    if (gameSpeed ===  1) return 600
    if (gameSpeed ===  2) return 300
    return 1000
  }

  get startIndex() {
    return Number(this._startIndex?.value || 0)
  }

  get currentSequenceColor() {
    return this.sequence[this.currentIndex]
  }

  async init(sounds) {
    await this.loadHowler()
    this.sounds = {
      green:  window?.Howl && new window.Howl({ src: [sounds.green] }) 	|| new Audio(sounds.green),
      red:    window?.Howl && new window.Howl({ src: [sounds.red] }) 		|| new Audio(sounds.red),
      yellow: window?.Howl && new window.Howl({ src: [sounds.yellow] }) || new Audio(sounds.yellow),
      blue:   window?.Howl && new window.Howl({ src: [sounds.blue] }) 	|| new Audio(sounds.blue)
    }
  }

  _getElement(selector) {
    if (typeof selector === 'string')
      return document.querySelector(selector)
    return selector
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

  enableColors(action = 'remove') {
    if(action === false) action ='add'
    this.buttons.green.classList[action]('playing-sequence')
    this.buttons.red.classList[action]('playing-sequence')
    this.buttons.yellow.classList[action]('playing-sequence')
    this.buttons.blue.classList[action]('playing-sequence')
  }

  buttonPress(color) {
    console.log(`%c ${color} `, `background-color: ${color}; color: black; font-size: 20px; font-weight: bold;`);
    //clearInterval(this.sequenceInterval)
    this.playStep(color)
    if(!this.gameRunning)
      return
    if (!this.checkInput(color))
      return this.gameOver()
    if (this.currentIndex === this.score) {
      this.gameRunning = false
      this.currentIndex = 0
      this.buttons.next.disabled = false
      this.score++
      this.updateScore(this.score)
    }
    else this.currentIndex++
  }

  addStep() {
    const rand = Math.floor(Math.random() * 4)
    this.sequence.push(this.colors.get(rand))
    console.info('Step Added: ', this.colors.get(rand))
  }

  updateScore(score) {
    this.display.innerHTML = score
  }


  startGame() {
    this.buttons.reset.disabled = false
    this.buttons.start.disabled = true
    this._gameSpeed.disabled = true
    this._startIndex.disabled = true
    this.score = this.startIndex
    this.updateScore(this.score)
    for (let i = 0; i < this.startIndex; i++)
      this.addStep()
    this.playRound()
  }

  resetGame() {
    this.gameOver()
    this.updateScore(0)
  }

  playRound() {
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
    this.buttons.reset.disabled = true
    this._gameSpeed.disabled = false
    this._startIndex.disabled = false
    this.currentIndex = 0
    this.score = 0
    this.sequence = []
  }

  playSequence() {
    let stepToPlay = 0
    this.enableColors(false)
    this.sequenceInterval = setInterval(() => {
      if (stepToPlay === this.score + 1){
        clearInterval(this.sequenceInterval)
        this.gameRunning = true
        this.enableColors()
      }
      else {
        this.playStep(this.sequence[stepToPlay])
        stepToPlay++
      }
    }, this.gameSpeed)
  }

  playStep(color) {
    this.sounds[color].play()
    this.buttons[color].classList.add('pressed')
    setTimeout(() => this.buttons[color].classList.remove('pressed'), this.gameSpeed / 3)
  }
}

window.simon = new SimonSays({
  sounds: {
    red:    'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
    blue:   'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3',
    green:  'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
    yellow: 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
  },
  buttons: {
    red:    '#red',
    blue:   '#blue',
    green:  '#green',
    yellow: '#yellow',
    next:   '#nextRound',
    start:  '#startGame',
    reset:  '#resetGame',
  },
  settings: {
    startingLevel: '#settings-starting-level',
    gameSpeed:     '#settings-speed',
  },
  display: {
    score: '#score'
  }
})