var player;
var enemies = new Array;
var rainDrops = new Array;

var isPaused;
var shouldGen;
var difficulty;
var firstTime = true;
var score = 0;
var hits = 0;


var playerImage;
var rainImage;
var bugImage;
var background;

var b1;
var b2;
var b3;
var b1s;
var b2s;
var b3s;

var buzzSound;
var dropSound;
var loseSound;
var winSound;

var baseSpeed = 1;
var baseSpeedE = 1;

var won = false;
var lost = false;
var myCanvas;

function preload(){
	playerImage = loadImage('./images/flower.png');
	background = loadImage('./images/background.png');
	bugImage = loadImage('./images/bug.png');
	rainImage = loadImage('./images/raindrop.png');

	b1 = loadImage("./images/b1.png");
	b2 = loadImage("./images/b2.png");
	b3 = loadImage("./images/b3.png");

	b1s = loadImage("./images/b1s.png");
	b2s = loadImage("./images/b2s.png");
	b3s = loadImage("./images/b3s.png");
	soundFormats('ogg');

	buzzSound = loadSound('./sound/buzz.ogg');
	dropSound = loadSound('./sound/plop.ogg');
	loseSound = loadSound('./sound/wahwah.ogg');
	winSound = loadSound('./sound/yay.ogg');
}
function setup(){
	myCanvas = createCanvas(750, 750);
	myCanvas.style('display', 'block');
	myCanvas.style('margin', 'auto');
	myCanvas.parent('sketch-holder');
	player = new Player();
}
function draw(){
	image(background,0,0);
	if(lost){
		fill(0,0,0,20);
		rect(0, 0, 750, 750);
		fill(255);
		textSize(100);
		text("YOU LOSE", 100, 350);
	}
	else if(won){
		fill(0,0,0,20);
		rect(0, 0, 750, 750);
		fill(255);
		textSize(100);
		text("YOU WIN!", 100, 350);
	}
	else if(firstTime){
		//If the player has started up the game for the first time, display
		//a menu with difficulty settings.  Game will start once difficulty is chosen
		fill(0);
		textSize(32);
		text("Water the flower!  Be sure not to run into any bugs!", 10, 50);
		textSize(27);
		text("Use the 'A' and 'D' keys to move, and the 'enter' key to pause", 10, 100);
		text("Collect 50 drops to win; get bit more than 5 times and lose", 10, 140);
		text("Select your difficulty using the mouse", 150, 300);
		if(mouseX > 100 && mouseX < 250 && mouseY > 350 && mouseY < 450){
			image(b1s, 100, 350);
			if(mouseIsPressed){
				difficulty = 0;
				firstTime = false;
			}
		}
		else{
			image(b1, 100, 350);
		}
		if(mouseX > 300 && mouseX < 450 && mouseY > 350 && mouseY < 450){
			image(b2s, 300, 350);
			if(mouseIsPressed){
				difficulty = 1;
				firstTime = false;
			}
		}
		else{
			image(b2, 300, 350);
		}
		if(mouseX > 500 && mouseX < 650 && mouseY > 350 && mouseY < 450){
			image(b3s, 500, 350);
			if(mouseIsPressed){
				difficulty = 2;
				firstTime = false;
			}
		}
		else{
			image(b3, 500, 350);
		}
	}
	else if(isPaused){
		//If the player has pressed the escape key, the game will enter a paused state.
		fill(0,0,0,20);
		rect(0, 0, 750, 750);
		fill(255);
		textSize(100);
		text("PAUSED", 150, 350);
	}
	else{
		//Easy (enemies are slower, generate less enemies)
		if(difficulty === 0){
			shouldGen = random(200);
			if(shouldGen < 1){
				if(enemies.length < 10){
					enemies.push(new Enemy(1 * baseSpeedE));
				}
			}
			var genRainDrop = random(100);
			if(genRainDrop < 1){
				if(rainDrops.length < 15){
					rainDrops.push(new Raindrop(baseSpeed * random(2) + 0.75));
				}
			}
		}
		//Medium (enemies are random speeds ranging from slow to medium, generate a normal amount of enemies)
		else if(difficulty === 1){
			shouldGen = random(200);
			if(shouldGen < 2){
				if(enemies.length < 13){
					enemies.push(new Enemy(baseSpeedE * random(2) + 1));
				}
			}
			var genRainDrop = random(100);
			if(genRainDrop < 4){
				if(rainDrops.length < 25){
					rainDrops.push(new Raindrop(baseSpeed * random(2) + 1.2));
				}
			}
		}
		//Hard (enemies are random speeds, generate a larger amount of enemies)
		else if(difficulty === 2){
			shouldGen = random(200);
			if(shouldGen < 4){
				if(enemies.length < 17){
					enemies.push(new Enemy(baseSpeedE * random(4) + 1));
				}
			}
			var genRainDrop = random(100);
			if(genRainDrop < 5){
				if(rainDrops.length < 30){
					rainDrops.push(new Raindrop(baseSpeed * random(4) + 1.2));
				}
			}
		}
		//Cycle through array of enemies, display and move them
		for(let i = 0; i < enemies.length; i++){
			enemies[i].move();
			enemies[i].display();
			//If the enemy has passed the bottom of the screen, remove them from the array
			if(enemies[i].yPos > 750){
				enemies.splice(i, 1);
				i--;
			}
		}
		//Cycle through array of raindrops, invoke display and fall methods
		for(let i = 0; i < rainDrops.length; i++){
			rainDrops[i].fall();
			rainDrops[i].display();
			//Remove from array if it passes the bottom of the screen
			if(rainDrops[i].yPos > 750){
				rainDrops.splice(i, 1);
				i--;
			}
		}
		checkForCollisions();
		player.move();
		player.display();

		fill(255);
		textSize(32);
		text("Score: " + score, 30,30);
		text("Damage Taken: " + hits, 30, 60);
	}
}
function checkForCollisions(){
	var xMid = player.xPos + 55;
	var yMid = player.yPos + 50;

	for(let i = 0; i < enemies.length; i++){
		if(dist(xMid, yMid, enemies[i].xPos+10, enemies[i].yPos+10) <50){
			buzzSound.play();
			player.takeDamage();
			hits++;
			enemies.splice(i, 1);
			i--;
		}
	}
	for(let i = 0; i < rainDrops.length; i++){
		if(dist(xMid, yMid, rainDrops[i].xPos+10, rainDrops[i].yPos+10) < 50){
			dropSound.play();
			score++;
			if(score >= 50){
				won = true;
				winSound.play();
			}
			rainDrops.splice(i, 1);
			i--;
		}
	}
}
function Player(){
	this.xPos = 300;
	this.yPos = 575;
	this.bugbites = 0;

	this.display = function(){
		image(playerImage, this.xPos, this.yPos);
	};
	this.move = function(){
		//A key
		if(keyIsDown(65)){
			if(this.xPos > 0){
				this.xPos-=7.5;
			}
		}
		//D key
		if(keyIsDown(68)){
			if(this.xPos < 650){
				this.xPos+=7.5;
			}
		}
	};
	this.takeDamage = function(){
		this.bugbites += 1;
		if(this.bugbites >= 5){
			lost = true;
			loseSound.play();
		}
	};
}
function Enemy(speed){
	this.speed = speed;
	this.xPos = random(600) + 50;
	this.xOrigin = this.xPos;
	this.maxMovement = random(50) + 10;
	this.xDir = random(2);
	this.yPos = 0;

	this.display = function(){
		image(bugImage, this.xPos, this.yPos);
	}

	this.move = function(){
		//Move left
		if(this.xDir <= 0){
			if(this.xPos <= this.xOrigin - this.maxMovement){
				this.xDir = 1;
			}
			else{
				this.xPos -=2;
			}
		}
		//Move right
		else{
			if(this.xPos >= this.xOrigin + this.maxMovement){
				this.xDir = 0;
			}
			else{
				this.xPos += 2;
			}
		}
		this.yPos += 2*this.speed;
	};
}
function Raindrop(speed){
	this.speed = speed;
	this.xPos = random(600) + 50;
	this.yPos = 0;

	this.fall = function(){
		this.yPos += 1*this.speed;
	};
	this.display = function(){
		image(rainImage, this.xPos, this.yPos);
	};
}
function speedUpDrop(){
	baseSpeed += 1;
}
function speedUpEnemy(){
	baseSpeedE += 1;
}
function startOver(){
	lost = false;
	won = false;
	firstTime = true;
	score = 0;
	hits = 0;
	player = new Player();
	rainDrops = [];
	enemies = [];
}
function keyPressed(){
	if(keyCode === ENTER){
		if(isPaused){
			isPaused = false;
		}
		else{
			isPaused = true;
		}
	}
}