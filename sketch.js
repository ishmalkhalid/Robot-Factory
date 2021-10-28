//set canvas
// let canvas;

// arrow graphics
let rightArr, leftArr, upArr, downArr;

//arrow directions 
let arrDirecs = ["up", "right", "down", "left"]

//clicked
let clicked = false;

// robot array
let robots = [];

// arrow array
let arrows = [];

//width and height
let width = 800;
let height = 600;

//w and h for creating arrows
let w = width/8;
let h = height/8;

//arrow count
let arrCount = 0;

// points
let points = 0;
let p = true;

let state = 0;
// robots
// let robotCount = 0;

// preload functiom
function preload() {

	// load images
	rightArr = loadImage("media/arrow_right.png");
	leftArr = loadImage("media/arrow_left.png");
	upArr = loadImage("media/arrow_up.png");
	downArr = loadImage("media/arrow_down.png");
}

//setup function
function setup() {
	//set up canvas
    var canvas = createCanvas(width,height);

	// set the ID on the canvas element
	canvas.id("my_p5_canvas_element");

	// set the parent of the canvas element to the element in the DOM with an id of #center
	canvas.parent("#center");


}

//draw function
function draw() {

	background(230);

	//draw the exit
	fill(255,0,0);
    rect(width-50, height-200, 50, 200);
    fill(0);
    textSize(14);
    text("EXIT", width-50, height-200);

    //add points text
    textSize(24);
    text("Points: " + points, 10, 20)

    //add robot count text
    text("Num of Robots: " + robots.length, width- 250, 20)

    if (robots.length >= 10) {
    	state = 1
    	points = 0;
    	arrCount = 0;
    	robots = []
    	arrows = []
    	w = width/8;
		h = height/8;
    }

    else{
    	state = 0;
	    //add robots with intervals
		if (frameCount % 120 == 0){
			temp = new Robot(10, height/2, "right");
			robots.push(temp)
		}

		//loop through robots array
		// p = true;
		for (let i = 0; i < robots.length; i++){

			//delete robots from array if they leave screen
			if (robots[i].x <= 0
			|| robots[i].x >= width
			|| robots[i].y <= 0
			|| robots[i].y >= height){
				robots.splice(i, 1)
			}

			//move and display robots
			else{
				robots[i].move();
				robots[i].display()
			}

			// increase points if robots reach exit
			if (robots[i].x == width-50
			&& robots[i].y >= height - 200){
				points += 1;
				// p = false;
			}
		}

		//add arrows with intervals and position them
		if (frameCount % 8 == 0  && arrCount < 49){
			arr = new Arrow(w, h);
			//ensure first arrow is never locked
			// if (w == width/8 && h == width/4){
			// 	arr.count = 10
			// 	consol.log("Arrow");
			// }
			arrows.push(arr);
			arrCount += 1;
			w += width/8;
			//height intervals of height/8 and width intervals of width/8
			if (w >= width){
				h += height/8;
				w = width/8;
			}
		}

		//display all arrows
		for (let i = 0; i < arrows.length; i++){
			arrows[i].display();
		}
    }

   
}

// class robot
class Robot {

	//initiate a robot
	constructor (x, y, direc){
		this.x = x;
		this.y = y;
		this.headSize = random(25, 50);
		this.bodySize = this.headSize + 8;
		//ensure the head and the body color is never the same
		while (this.headColor == this.bodyColor) {
			this.headColor = color(random(50, 150), random(50, 150), random(50, 150));
			this.bodyColor = color(random(50, 150), random(50, 150), random(50, 150));
		}
		this.eyes = random();
		this.direction = direc;
		this.speed = 1;
		//yellow light indicator
		this.indicator = 255;
		//alpha value for opacity
		this.a = -1;
		this.ears = random();
	}

	//display the robots
	display () {
		noStroke();
		// rectMode(CENTER);
		//set up the head
		fill(this.headColor);
		square(this.x, this.y, this.headSize);
		//set up the body
		fill(this.bodyColor);
		square(this.x - (this.bodySize - this.headSize)/2, this.y + this.headSize, this.bodySize);
		fill(255);

		//eyes
		if (this.eyes < 0.3) {
			//long rectangualr eyes
			rect(this.x + this.headSize*0.15, (this.headSize*0.15) + this.y, this.headSize*0.70, this.headSize*0.25);
		}
		else if (this.eyes > 0.3 && this.eyes < 0.6) {
			//two white rectangles eyes
			rect(this.x + this.headSize*0.20, (this.headSize*0.15) + this.y, this.headSize*0.10, this.headSize*0.25);
			rect(this.x + this.headSize*0.70, (this.headSize*0.15) + this.y, this.headSize*0.10, this.headSize*0.25);
		}
		else {
			// 2 circular eyes
			ellipse(this.x + this.headSize*0.25, (this.headSize*0.25) + this.y, this.headSize*0.35);
			ellipse(this.x + this.headSize*0.75, (this.headSize*0.25) + this.y, this.headSize*0.35);
		}

		//ears
		if (this.ears < 0.5) {
			fill(0);
			rect(this.x - this.headSize*0.15, (this.headSize*0.15) + this.y, this.headSize*0.15, this.headSize*0.25);
			rect(this.x + this.headSize, (this.headSize*0.15) + this.y, this.headSize*0.15, this.headSize*0.25);
		}

		//else add extra features to eyes
		else{
			fill(0);
			rect(this.x + this.headSize*0.20, (this.headSize*0.15) + this.y, this.headSize*0.10, this.headSize*0.25);
			rect(this.x + this.headSize*0.70, (this.headSize*0.15) + this.y, this.headSize*0.10, this.headSize*0.25);
		}

	}

	//move the robots
	move() {

		//radius of the indicator light
		let hradius = this.headSize*0.5;
		
		//change alpha value at 255 and 50
		if (this.indicator < 50 || this.indicator > 255){
			this.a *= -1;
		}

		fill(255,255, 0, this.indicator);
		// ellipseMode(CENTER);

		//move the robot in its direction and add a corresponding yellow light
		//right movement
		if (this.direction == "right") {
			ellipse(this.x - this.bodySize*0.05, this.y + this.headSize + this.bodySize/2, hradius);
			this.x += this.speed;
		}
		//left movemnet
		else if (this.direction == "left") {
			ellipse(this.x + this.bodySize*0.85, this.y + this.headSize + this.bodySize/2, hradius);
			this.x -= this.speed;
		}
		//up movement
		else if (this.direction == "up") {
			ellipse(this.x + this.bodySize*0.4, this.y + this.headSize + this.bodySize, hradius);
			this.y -= this.speed;
		}
		//down movement
		else if (this.direction == "down") {
			ellipse(this.x + this.headSize/2, this.y, hradius);
			this.y += this.speed;
		}
		// ellipseMode(CORNER);
		//decrease indicator opacity by 5
		this.indicator += this.a*5;

		//detect collisions with arrows and draw lines
		for (let i = 0; i < arrows.length; i++){
			if (dist(arrows[i].x, arrows[i].y, this.x + this.headSize/2, this.y + this.headSize/2) <= 85) {
				//map stroke weight depending on distance
				let strk = map(dist(arrows[i].x, arrows[i].y, this.x, this.y), 85, 25, 1, 10);
				strokeWeight(strk);
				stroke(0);
				//draw line
				line(this.x, this.y, arrows[i].x, arrows[i].y);
			}
			//detect collision and change direction
			if (dist(arrows[i].x, arrows[i].y, this.x + this.headSize/2, this.y + this.headSize/2) <= 25){
				this.direction = arrows[i].direction;
			}

		}

	}

}

//arrow class
class Arrow {

	//arrow constructor
	constructor (x, y) {
		this.x = x;
		this.y = y;
		this.direction = random(arrDirecs);
		this.locked = random();
		if (this.locked <= 0.2) {
			this.count = 0;
		}
		else if (this.locked > 0.2 && this.locked < 0.4) {
			this.count = 2;
		}
		else {
			this.count = 10;
		}
	}

	//display the arrows
	display() {
		fill(0);
		textSize(10);

		//fully locked arrpws
		if (this.count == 0) {
			text("FULL LOCKED", this.x - 30, this.y - 25);
		}
		//partially locked arrows
		else if (this.count < 4) {
			text("PARTIAL LOCKED", this.x - 40, this.y - 25);
		}
		imageMode(CENTER);

		//show iamges of arrow in their respective directions
		//right arrow
		if (this.direction == "right") {
			image(rightArr, this.x, this.y);
		}
		//left arrow
		else if (this.direction == "left") {
			image(leftArr, this.x, this.y);
		}
		//up arrow
		else if (this.direction == "up") {
			image(upArr, this.x, this.y);
		}
		//down arrow
		else if (this.direction == "down") {
			image(downArr, this.x, this.y);
		}

		imageMode(CORNER);
	}

	//check if an arrow has been clicked
	checkClick() {
		//click is only possible if count > 0 and within distance
		if (dist(mouseX, mouseY, this.x, this.y) <= 25 && this.count > 0) {
			//change arrow directions
			if (this.direction == "up") {
				this.direction = "right";
			}
			else if (this.direction == "right") {
				this.direction = "down";
			}
			else if (this.direction == "down") {
				this.direction = "left";
			}
			else if (this.direction == "left") {
				this.direction = "up";
			}
			this.count -= 1;
		}

	}
}

//mouse pressed function
function mousePressed() {
	//check clicks for all arrows
	for (let i = 0; i < arrows.length; i++){
		arrows[i].checkClick();
	}
}
