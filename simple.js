var canvas = document.getElementById("canvas");

canvas.width = innerWidth;
canvas.height = innerHeight;
var c = canvas.getContext('2d');
var keys = [];
addEventListener('keydown', function(e) {
	keys[e.keyCode] = true;
});
addEventListener('keyup', function(e){
	keys[e.keyCode] = false;
});
var mycar = new Image();
var obs = new Image();
obs.src = 'obs.png';
var bg = new Image();
bg.src = 'road2.jpg';
mycar.src = 'mycar.png';
var loadedImages = 0;
var myScore = 0.0;
var xinged = 0;
mycar.onload = function() {
	loadedImages++;
}
bg.onload = function() {
	loadedImages++;
}
obs.onload = function() {
	loadedImages++;
	for(var i=0;i<carCount;i++)
		obstacles[i] = new Obstacles(i);
}
var carCount = 4;
var obsSpeed = 6;
function Obstacles(order) {
	this.order = order;
	this.x = (Math.random()*(innerWidth-100))+50;
	this.y = -250*this.order-300;
	this.draw = function() {
		this.y += obsSpeed;
		if(this.y >= innerHeight){
			xinged++;
			while(true) {
				this.x = (Math.random()*(innerWidth-100))+50;
				this.y = -400*Math.random()-300;
				var overlapping = false;
				for(var i=0;i<carCount ;i++){
					if(i!=this.order){
						if((Math.abs(obstacles[i].x-this.x)<100) && 
							(Math.abs(obstacles[i].y-this.y)<200)){
							overlapping = true;
							break;
						}
					}
				}
				if(overlapping == false){
					break;
				}
			}
		}
		c.drawImage(obs,this.x,this.y,100,200);
	}
}
var obstacles = [];
var bgy1=0;
var bgy2=-innerHeight;
var dbgy = 3;
var myCarX = innerWidth/2-50;
function update() {
	if(loadedImages == 3){
		bgy1+=dbgy;
		bgy2+=dbgy;
		if(keys[37]){
			myCarX -= 4;
		}
		if(keys[39]){
			myCarX += 4;
		}
		c.clearRect(0,0,innerWidth,innerHeight);
		myScore += 0.1;
		if(myScore > 100){
			dbgy+=0.05;
			obsSpeed+=0.05;
		}

		document.getElementById('score').innerHTML = "Score: " 
			+ parseInt(myScore);
		if(bgy2 >= 0 ) {
			bgy1 = 0;
			bgy2 = -innerHeight;
		}
		c.drawImage(bg,0,bgy1,innerWidth,innerHeight);
		c.drawImage(bg,0,bgy2,innerWidth,innerHeight);
		c.drawImage(mycar,myCarX,innerHeight-220,100,200);
		for(var i=0;i<carCount;i++){
			obstacles[i].draw();
		}
		var overlapping = false;
		for(var i=0;i<carCount ;i++){
			if((Math.abs(obstacles[i].x-myCarX)<95) && 
				(obstacles[i].y >= innerHeight-400)){
				overlapping = true;
				break;
			}
		}
		if(overlapping == true){
			loadedImages = -1;
			cancelAnimationFrame(animate);
			alert("Stats:\n========\nDistance: " + parseInt(myScore)+
				"\nCars Avoided: "+xinged);
			
		}
	} 
}

function animate() {
	requestAnimationFrame(animate);
	update();
}
animate();
