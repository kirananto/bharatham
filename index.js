
Vue.component('page', {
  template: '#page',
  data: function(){
    return dat;
  }
})

var dat = {
  menu: [
    { icon: 'mbri-touch',title:'Get in Touch',class:'.gtouch'},
    { icon: 'mbri-login', title: 'Register',class:'.Register' }
  ],
  title: 'BHARATHAM\
          2k17',
  register: true,
  logo: false
};

var app = new Vue({
  el: '#app',
  data: dat,
  methods: {
         retrunval : function (){
           if(logo == true ) {
             return true;
           }
         }
   }

})



// Data
var text = [
  "Bhavam",
  "Ragam",
  "Thalam",
  "Bharatham",
  "2K17"
];

// density


//


var scrollDelay = 2000; // delay for accepting the next scroll event
var autoScrollDelay = 5000;
// uncomment to override the defaults

 var colors = ["#ffffff","#684073", "#ffffff","#b35552", "#ffffff"];

// particle-text init

var lock = true;
var textOnDisplay = 0;

var font = "Rubik";

var canvas = document.querySelector("#scene");
ctx = canvas.getContext("2d");
particles = [];
amount = 0;
mouse = {x:0,y:0};
radius = 0.7;

var lastPosX = [];
var lastPosY = [];


var lasttext = ""; // for resize()
// var copy = document.querySelector("#copy");

var ww = canvas.width = window.innerWidth;
var wh = canvas.height = window.innerHeight;


var densityFactor =  ww > 768?150:130;
 var densityFactor = 130;
var fontSizeFactor = ww > 768?null:1.3;

var radiusFactor = ww > 768?2500:3000;

ww = ww > wh? ww: wh;
wh = ww > wh? wh: ww;

function Particle(x, y, lastX, lastY){
	this.x =  lastX;
	this.y =  lastY;
	this.dest = {
		x : x,
		y: y
	};
	this.r =  Math.random()*5*(ww/radiusFactor) + 2;
	this.vx = (Math.random()-0.5)*20;
	this.vy = (Math.random()-0.5)*20;
	this.accX = 0;
	this.accY = 0;
	this.friction = Math.random()*0.05 + 0.9;

	this.color = colors[Math.floor(Math.random()*(colors.length + 1))];
}

Particle.prototype.render = function() {
	this.accX = (this.dest.x - this.x)/300;
	this.accY = (this.dest.y - this.y)/300;
	this.vx += this.accX;
	this.vy += this.accY;
	this.vx *= this.friction;
	this.vy *= this.friction;

	this.x += this.vx;
	this.y +=  this.vy;

	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
	ctx.fill();

	var a = this.x - mouse.x;
	var b = this.y - mouse.y;

	var distance = Math.sqrt( a*a + b*b );
	if(distance<(radius*70)){
		this.accX = (this.x - mouse.x)/100;
		this.accY = (this.y - mouse.y)/100;
		this.vx += this.accX;
		this.vy += this.accY;
	}
}

function onMouseMove(e){
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}

function onTouchMove(e){
	console.log("moved");
	if(e.touches.length > 0 ){
		mouse.x = e.touches[0].clientX;
		mouse.y = e.touches[0].clientY;
	}
}

function onTouchEnd(e){
	console.log("ended");
	mouse.x = -9999;
	mouse.y = -9999;
}

function onMouseUp(e){
	console.log("mu");
	setTimeout(()=>{
		mouse.x = -9999;
		mouse.y = -9999;
	},50);
}

function initScene(text){

  lasttext = text; // for resize

  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold "+Math.floor((ww/10)*(text.length >14 || fontSizeFactor === null ?14/text.length:fontSizeFactor))+"px " + font;
	// console.log(ctx.font);
	ctx.textAlign = "center";
	ctx.fillText(text, ww/2, wh/2);

	var data  = ctx.getImageData(0, 0, ww, wh).data;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.globalCompositeOperation = "screen";

	console.log("length" + lastPosX.length);
	particles = [];
	var count = 0;
	for(var i=0;i<ww;i+=Math.round(ww/densityFactor)){
		for(var j=0;j<wh;j+=Math.round(ww/densityFactor)){

			if(data[ ((i + j*ww)*4) + 3] > 150){
				count = count + 1;

				if (lastPosX.length < count) {
					lastPosX.push(Math.random()*ww);
					lastPosY.push(Math.random()*wh);

				}

				particles.push(new Particle(i, j, lastPosX[count-1], lastPosY[count-1]));
			}
		}
	}
	amount = particles.length;


	console.log("no.of parts: " + amount)
}

function onMouseClick(){
	//radius++;
	console.log("click");
	if(radius ===5){
		radius = 0;
	}
}

function render(a) {
	requestAnimationFrame(render);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < amount; i++) {
		particles[i].render();
		lastPosX[i] = particles[i].x;
		lastPosY[i] = particles[i].y;
	}
};

// copy.addEventListener("keyup", initScene);
window.addEventListener("resize", () => initScene(lasttext));
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("mouseup", onMouseUp);
// window.addEventListener("click", onMouseClick);
window.addEventListener("touchend", onTouchEnd);

setTimeout(() => { // prevent the user from scrolling too soon
  lock = false;
  console.log("init scene");
  initScene(text[0]);
  console.log("render scene");
  requestAnimationFrame(render);
  setInterval(() => {
    console.log("set interval!");
    // while(lock){
    //   console.log("while loop");
    // }
    if (lock === false){
      lock = true;
      textOnDisplay = (textOnDisplay + 1) % text.length;
      console.log("------TEXTONDISPLAY---"+textOnDisplay);
      if(textOnDisplay < 5) {
        initScene(text[textOnDisplay]);
      setTimeout(() => { // prevent the user from scrolling too soon
        lock = false;
      },scrollDelay+autoScrollDelay);
    }
    }
  },scrollDelay + autoScrollDelay);

},scrollDelay);








// scroll reveal

window.sr = ScrollReveal();

(() => {

  Rx.Observable.fromEvent(window,'mousewheel')
    .map( e => e.wheelDelta > 0)
    .filter( () => lock === false )
    .subscribe( (delta) => {
      lock = true;
      var t = delta?(textOnDisplay > 1 ? textOnDisplay - 1: 0 ): (textOnDisplay < text.length -1? textOnDisplay + 1:textOnDisplay)
      console.log(delta,textOnDisplay);
      if (t != textOnDisplay){
        textOnDisplay = t;
        initScene(text[textOnDisplay]);
      }
      setTimeout(() => {
        lock = false;
      },scrollDelay);
    });

  // sr.reveal('#e2017',{ duration: 2000,origin: "bottom",distance: "200px"});
  // sr.reveal('#e2016',{ duration: 2000,delay:200,origin: "bottom",distance: "200px"});
  // sr.reveal('#e2015',{ duration: 2000,delay:400,origin: "bottom",distance: "200px"});
  // sr.reveal('#e2014',{ duration: 2000,delay:800,origin: "bottom",distance: "200px"});
  //
  // // sr.reveal('.copyrt',{duration:2000,origin: "bottom"});
  //
  // sr.reveal('.facebook',{ duration: 2000,delay:400,origin: "bottom",distance: "100px"});
  // sr.reveal('.gplus',{ duration: 2000,delay:200,origin: "bottom",distance: "100px"});
  // sr.reveal('.insta',{ duration: 2000,origin: "bottom",distance: "100px"});
  //
  // sr.reveal('.mec-logo',{ duration: 2000, origin:"left",distance:"100px"});
  // sr.reveal('.excel-logo',{ duration: 2000, origin: "right",distance:"100px"});
})()
