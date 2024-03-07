// Always starts with a O
// When the game starts, it activates a function in the Game Class, that starts the timer and get's ready for the first click
class Game
{
  timerSpan;
  timer;
  timerInterval;
  squares;
  currentPlayer;
  x;
  o;
  winningPositions;
  playCount;
  gameStatus;
  startButton;
  stopButton;
  resumeButton;
  restartButton;
  buttonsRow;
  winningAlert;
  winningSequence;

  constructor()
  {
    // Set the game status as 'notStarted' for overall control
    this.gameStatus = 'notStarted';

    // Sets the squares
    this.squares = {
      'tl': {
        'element': document.getElementById('tl'),
        'occupied': false,
        'occupiedBy': null
      },
      'tc': {
        'element': document.getElementById('tc'),
        'occupied': false,
        'occupiedBy': null
      },
      'tr': {
        'element': document.getElementById('tr'),
        'occupied': false,
        'occupiedBy': null
      },
      'cl': {
        'element': document.getElementById('cl'),
        'occupied': false,
        'occupiedBy': null
      },
      'cc': {
        'element': document.getElementById('cc'),
        'occupied': false,
        'occupiedBy': null
      },
      'cr': {
        'element': document.getElementById('cr'),
        'occupied': false,
        'occupiedBy': null
      },
      'bl': {
        'element': document.getElementById('bl'),
        'occupied': false,
        'occupiedBy': null
      },
      'bc': {
        'element': document.getElementById('bc'),
        'occupied': false,
        'occupiedBy': null
      },
      'br': {
        'element': document.getElementById('br'),
        'occupied': false,
        'occupiedBy': null
      },
    };

    // Sets the timer
    this.timerSpan = document.getElementById('timer');
    this.timer = 0;

    // Creates the winnings positions (8)
    this.winningPositions = [
      ['tl', 'tc', 'tr'],
      ['cl', 'cc', 'cr'],
      ['bl', 'bc', 'br'],
      ['tl', 'cl', 'bl'],
      ['tc', 'cc', 'bc'],
      ['tr', 'cr', 'br'],
      ['tl', 'cc', 'br'],
      ['tr', 'cc', 'bl'],
    ];

    // Define the start button
    this.startButton = document.getElementById('startButton');
    this.startButton.addEventListener('click', this.gameStarted.bind(this));

    // Define the stop button
    this.stopButton = document.getElementById('stopButton');
    this.stopButton.addEventListener('click', this.gameStop.bind(this));

    // Define the resume button
    this.resumeButton = document.getElementById('resumeButton');
    this.resumeButton.addEventListener('click', this.gameResume.bind(this));

    // Define the restart button
    this.restartButton = document.getElementById('restartButton');
    this.restartButton.addEventListener('click', this.gameRestart.bind(this));

    // Defines the winning alert element
    this.winningAlert = document.getElementById('winningAlert');
    
    // Defines the buttons row div
    this.buttonsRow = document.getElementById('buttonsRow');
  }

  gameStop()
  {
    // Sets the game status as stopped
    this.gameStatus = 'stopped';

    // Stop the interval    
    clearInterval(this.timerInterval);

    // Hides the stop button and shows the resume button
    this.resumeButton.classList.remove('hidden');
    this.stopButton.classList.add('hidden');
  }

  gameResume()
  {
    // Sets the game status as resumed
    this.gameStatus = 'resumed';

    // Continius the timer
    this.timerInterval = setInterval(this.timerOneSec.bind(this), 10);

    // Hides the stop button and shows the resume button
    this.resumeButton.classList.add('hidden');
    this.stopButton.classList.remove('hidden');
  }

  gameRestart()
  {
    // Reloads the page 🤣
    location.reload();
  }

  gameStarted()
  {
    // Starts the timer
    this.timerInterval = setInterval(this.timerOneSec.bind(this), 10);

    // Defines that the gameStatus is 'started'
    this.gameStatus = 'started';

    // Sets the first player
    this.x = {
      'id': 'x',
      'icon': '<i class="fa-solid fa-xmark text-6xl played"></i>'
    }
    this.o = {
      'id': 'o',
      'icon': '<i class="fa-solid fa-o text-5xl played"></i>'
    }
    this.currentPlayer = this.o;

    // Makes the squares clickable
    for(var key in this.squares)
      this.squares[key].element.addEventListener('click', this.squareClicked.bind(this));

    // Sets the playCount to zero
    this.playCount = 0;

    // Changes the buttons visibilities
    this.startButton.classList.add('hidden');
    this.stopButton.classList.remove('hidden');
    this.restartButton.classList.remove('hidden');
  }

  squareClicked(square)
  {
    // Checks if the square is occupied or if it has a placed piece in there or if the game has ended
    if(square.target.classList.contains('played') || this.squares[square.target.id].occupied || this.gameStatus == 'finished' || this.gameStatus == 'stopped') return;

    // Indicates that the played was counted
    this.playCount++;

    // Sets the icon for the current square
    square.target.innerHTML = this.currentPlayer.icon;

    // Sets the occupiedBy value to the correct player
    this.squares[square.target.id].occupiedBy = this.currentPlayer;

    // Checks if the player has won 
    if(this.checksForWin()) return this.winner(this.currentPlayer);

    // Checks if it's a draw (all squares occupied)
    if(this.playCount == 9) return this.draw();

    // Changes the current player
    this.currentPlayer = (this.currentPlayer.id == 'o') ? this.x : this.o;

    // Defines the square as occupied
    this.squares[square.target.id].occupied = true;
  }

  checksForWin()
  {
    // If the game has less than 5 plays it is impossible to win
    if(this.playCount < 5) return false;

    // For me to check if someone won, i first have to get all the X's and O's positions
    let currentOPosition = [];
    let currentXPosition = [];
    for(var square in this.squares){
      if(this.squares[square].occupiedBy == this.o) currentOPosition.push(this.squares[square].element.id);
      if(this.squares[square].occupiedBy == this.x) currentXPosition.push(this.squares[square].element.id);
    }

    // Checks if any X or O case is a winning position
    for(let i = 0; i < this.winningPositions.length; i++)
    {
      if(this.isWinning(currentOPosition, this.winningPositions[i])) return true;
      if(this.isWinning(currentXPosition, this.winningPositions[i])) return true;
    }

    return false;
  }

  winner(player)
  {
    // Stop the timer
    clearInterval(this.timerInterval);

    // Set the game status as finished to not be able to play anymore in this game
    this.gameStatus = 'finished';
    
    // Changes the buttons visibilities
    this.stopButton.classList.add('hidden');
    this.buttonsRow.classList.add('flex-col');
    this.winningAlert.innerHTML = 'The '+player.icon+' player won!';

    // Highlights the winning sequence
    document.getElementById('winningSection').classList.remove('hidden');
    console.log(this.winningSequence);
    document.getElementById(this.winningSequence).classList.remove('hidden');
  }

  draw()
  {
    // Stop the timer
    clearInterval(this.timerInterval);

    // Set the game status as finished to not be able to play anymore in this game
    this.gameStatus = 'finished';
    
    // Changes the buttons visibilities
    this.stopButton.classList.add('hidden');
    this.buttonsRow.classList.add('flex-col');
    this.winningAlert.innerHTML = 'It was a draw!';
  }

  isWinning(currentPosition, winningPosition)
  {
    // And currentPosition as ['bc', 'bl', 'cc', 'tl'] for example
    // We have the winningPosition as any winning position ['tl', 'tc', 'tr'] for example

    // Sort both arrays
    currentPosition = currentPosition.sort();
    winningPosition = winningPosition.sort();

    // Each time it has a winning square, it saves one point, if it have 3 points it wins
    let points = 0;
    for(let current in currentPosition)
      if(winningPosition.includes(currentPosition[current]))
        points++;

    if(points == 3) this.winningSequence = winningPosition.join('-');

    return points == 3;
  }

  timerOneSec()
  {
    // Increments the timer for 1
    this.timer++;

    // Creates a seconds and minutes variables for us to work with
    let milisec = 0;
    let secs = 0;
    let minutes = 0;

    // Defines the values of minutes and secs
    if(this.timer < 100) milisec = this.timer
    else if(this.timer < 60*100)
    {
      secs = Math.floor(this.timer / 100);
      milisec = this.timer % 100
    }
    else if(this.timer < 60*60*100)
    {
      minutes =  Math.floor(this.timer / (60*100));
      secs = Math.floor(this.timer / 100) % 60;
      milisec = this.timer % 100;
    }
    else
    {
      minutes = 'XX'
      secs = 'XX'
      milisec = 'XX'
    }

    // Ads the 0X:0X to secs and minutes
    if(minutes < 10) minutes = '0'+minutes;
    if(secs < 10) secs = '0'+secs;
    if(milisec < 10) milisec = '0'+milisec;

    // Displays the timer
    this.timerSpan.innerHTML = minutes+':'+secs+':'+milisec;
  }
}

document.addEventListener('DOMContentLoaded', function(){
  var game = new Game();
});
