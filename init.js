// Code'mon 0.0.3
// Created by Brandon T. Wood on May 1st, 2016
/*var stage;
var renderer;
var blocks=[];
var menu;
var game;
var monster_object;*/
var running = false;
var id_counter = 1;

//Calls all the initial methods needed to setup and play the game.
/*function init(){

	// Setup Pixi.js stage
	console.log("Attempting Setup");
	stage = new PIXI.Stage(0x66FF99);
	var canvas = document.getElementById("game");
	var renderer = PIXI.autoDetectRenderer(800, 300,{view: canvas});
	document.body.appendChild(renderer.view);

	// Time to setup!
	//Here is where the game will be placed.
	game = new PIXI.Graphics();
        game.beginFill(0x33ccff);
        game.drawRect(400, 0, 500, 300);
        stage.addChild(game);	

        var challenge = new PIXI.Text('Make Oba sing La three times',{font : '28px Arial', fill : 0xff1010, align : 'center'});
        challenge.position.x = 410;
        challenge.position.y = 20; 
        game.addChild(challenge);

	//The monster object in the game.
	monster_object = new monster();
	monster_object.place();

	//Here is the menu that will hold the blocks.
	menu = new PIXI.Graphics();
	menu.beginFill(0xFFFF00);
	menu.drawRect(0, 0, 80, 300);
	stage.addChild(menu);

	// This bar is the interpreter, as it moves from top to bottom it's collisions will trigger events on the game.
        var bar = new PIXI.Graphics();
        bar.beginFill(0xFF0000);
        bar.drawRect(80, 0, 320, 15);

	// Circle button that launches the interpreter.
	var run_button = new PIXI.Graphics();
        run_button.beginFill(0xFFF000);
	run_button.drawCircle(240, 7, 15);
        run_button.buttonMode = true;
        run_button.interactive = true;
        run_button.click = run_button.tap = function(data){
		run_interpreter();	
	}
	bar.addChild(run_button);
        stage.addChild(bar);

	//var block_button = new new_block();
	blocks.push(new block());
	stage.addChild(blocks[blocks.length-1].block);

	console.log("Setup successful!\nGame Start!");
	update();

	// Main game loop!
	//function update(){
		// Loop that moves the interpreter.
		if(running){
			if(bar.position.y > 290){
				// We have hit bottom, reset and turn off running.
				running = false;
				bar.position.y = 0;
			}else{
				// Increment y position of bar.
				//console.log("Running");
				bar.position.y += 1;
				for(var i=0; i<blocks.length; i++){
					//console.log("Checking..");
					if(hitTest(blocks[i].block, bar)){
						monster_object.action();
					}
				}
			}
		}
		renderer.render(stage);
		requestAnimFrame(update);
	}
}*/

//Generic monster object.
function monster(){

	var sprite_open = new PIXI.Sprite.fromImage('res/codemonster_2.png');
        //sprite_open.scale.x = 0.2;
        //sprite_open.scale.y = 0.2;
	var sprite_closed = new PIXI.Sprite.fromImage('res/codemonster_1.png');


	var sprite = sprite_closed;

	this.place = function(){
	        //var sprite = sprite_closed;
        	sprite.position.x = 500;
        	sprite.position.y = 75;
        	sprite.scale.x = 0.2;
        	sprite.scale.y = 0.2;
        	game.addChild(sprite);
	};

        this.action = function() {
                console.log("La");
		game.removeChild(sprite);
		sprite = sprite_open;
		this.place();
		setTimeout(function(){ game.removeChild(sprite); sprite = sprite_closed; monster_object.place(); }, 380);
		//console.log("END");
        };
}


//Basically will just drag a red bar graphic down from top to bottom and when it collides with a block it will 
function run_interpreter(){
	running = true;
}


// Clears all blocks from board, but not the buttons.
function clear_board(){
	blocks.reverse();
	var length = blocks.length-1;
	for(var i=length; i>0; i--){
		stage.removeChild(blocks[i].block);
		blocks.pop();
	}
}


function hitTest(a, b){
	if(Math.abs(a.position.y - b.position.y) < 1){
	//if(a.position.x <= (b.position.x + b.width)){
		//if(a.position.y <= (b.position.y + b.height)){
			return true;
		//}
	}
	return false;
}


// This creates the basic block that the game will use to create all other blocks later on by changing their graphics and adding special affects.
function block(name){

	// Need ot give them id for removal purposes, may make array in hash map later.
	var id = id_counter;
	this.id = id;
	this.name = name;
	id_counter++;

	// Generic square from pixi graphics.
        this.block = new PIXI.Graphics();
        this.block.beginFill(0xFFFFFF);
        this.block.drawRect(10, 10, 60, 20);
        this.block.buttonMode = true;
        this.block.interactive = true;
	//stage.addChild(block);

	// Whatever the name of the block is.
        this.text = new PIXI.Text(this.name,{font : '13px Arial', fill : 0xff1010, align : 'center'});
	this.text.position.x = 30;
	this.text.position.y = 15; 
	this.block.addChild(this.text);
        //stage.addChild(block);

	// Basicaly is button is true to spawn a new button when the old block is moved.
	var isButton = true;
	this.block.mousedown = this.block.touchstart = function(data){
		// store a refference to the data
		// The reason for this is because of multitouch
		// we want to track the movement of this particular touch
		if(isButton){

			// This is how new blocks are spawned, new block becomes the button and old block gets dragged on to play screen.
			isButton = false;
			//console.log("Printing new button underneath! " + blocks + " length:"+blocks.length);
			blocks.push(new block());
			stage.addChild(blocks[blocks.length-1].block);
		}
		this.data = data;
		this.alpha = 0.9;
		this.dragging = true;
	};
	// set the events for when the mouse is released or a touch is released
	this.block.mouseup = this.block.mouseupoutside = this.block.touchend = this.block.touchendoutside = function(data){
		this.alpha = 1
		this.dragging = false;
		// set the interaction data to null
		this.data = null;
		// Gotta check if dragged back to menu. If so delete block.
		if(this.position.x < (80 + menu.position.x) || this.position.x > (85+300)){
			if(this.position.y < (menu.position.y + 300)){
				stage.removeChild(this);
				//Now must find block in the array and remove it, a tricky thing in javascript.
				for(var i=0; i<blocks.length; i++){
					//console.log("Found this!" + blocks[i].id + " = " +id);
					if(blocks[i].id == id){
						//console.log("Found");
						blocks.splice(i, 1);
					}
				}
			}
		}
	};

	// set the callbacks for when the mouse or a touch moves
	this.block.mousemove = this.block.touchmove = function(data){

		if(this.dragging){

			// need to get parent coords..
			var newPosition = this.data.getLocalPosition(this.parent);
			this.position.x = newPosition.x;
			this.position.y = newPosition.y;
		}
	};
}

