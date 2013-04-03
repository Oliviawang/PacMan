/*
  Controller for Pacman
  Handles the current position of the Pacman as well as all the updates
  to the position

  A basic control loop works as follows:
    1.User presses right arrow
    2."direction" gets updated to equal "right"
    3.dI and dJ update to equal 1,0 due to "direction" changing
    4.move() gets called and sets new values of nextTileI and nextTileJ
    5.x and y get updated to new pixel positions based on nextTileI and nextTileJ
    6.As x and y change, animateMovement in the view gets called and animates the Pacman to move to the right tile
    7.Once Pacman arrives, arrived() in the controller gets called, calling move() again and going back to 4
*/
var count;
var record=[];
var progress;
App.PacmanController = Ember.Controller.extend({
  //Indices into the map that represent the current tile
  currentTileI:1,
  currentTileJ:1,
  //Tile towards which we are moving
  nextTileI:1,
  nextTileJ:1,
  mapBinding: "App.map",
  
  //Direction that we are moving in: up, down, left, right, stopped
  direction: "stopped",
keyCode:null,
  //Coordinates in pixels of the position we are moving towards
  //This is an example of the Ember.Computed property
  //Each time nextTileI is changed, x updates its value
  //nextTile is only changed in the move() function
  x: function(){
    return this.get('map').getXFromI(this.get('nextTileI'));
  }.property("nextTileI"),

  y: function(){
    return this.get('map').getYFromJ(this.get('nextTileJ'));
  }.property("nextTileJ"),

  //DeltaI-the delta of Pacmans movement in terms of map Indices
  //Ember.Computed that updates based on the value of direction property
  dI: function(){
    switch(this.get("direction")){
      case "left": return -1; break;
      case "right": return 1;  break;
      default: return 0;
    }
  }.property("direction"),

  dJ: function(){
	  //console.info("DJ"+this.get("direction"));
    switch(this.get("direction")){
      case "up": return -1;  break;
      case "down": return 1; break;
      default: return 0;
    }
  }.property("direction"),

  //canMove determines whether we should start animating the Pacman movement
  //We only want to move if we have a direction and we are not already moving
  canMove: function(nextTileI, nextTileJ, dI, dJ) {
	  //console.info("PathEnable"+this.get('map').tiles[this.get('map').getYFromJ(nextTileJ)/36][this.get('map').getXFromI(nextTileI)/36]);
   var enablePath=this.get('map').tiles[this.get('map').getYFromJ(nextTileJ)/36][this.get('map').getXFromI(nextTileI)/36];
	  var haveNonZeroDirection = ((dI !== 0) || (dJ!== 0))&&(enablePath==0);
	 // console.info("haveNonZeroDirection"+haveNonZeroDirection+dI+dJ);
	 //console.info("direction"+this.get('direction'));
	  /*if(this.get('direction')!=='stopped'){
		  if(this.get('direction')=='up'){
			  this.set("dJ",-1);
		  }
		  if(this.get('direction')=='down'){
			  
			  this.set("dJ",1); 
		  }
		  if(this.get('direction')=='left'){
			  this.set('dI',-1);
			  
		  }
		  
		  if(this.get('direction')=='right'){
			  this.set('dI',1);
			  
		  }
		  
	  }*/
    return haveNonZeroDirection && !this.get('moving');
  },
//moveFood
  
  moveFood:function(){
	
	    //var size = this.get('size');
	    var sprite = paper.rect(this.get('x'),this.get('y'),36,36);
	   
	  
	    sprite.attr('fill', "#000000");
	    sprite.attr('stroke', "#000000");
	    this.set("sprite", sprite);
	  
	  
	  
  },
  isFirst:function(nextTileI,nextTileJ){
	//  console.info("record"+record);
	 
	  
	  for(var i=0;i<record.length;i++){
		// console.info("record[i]"+record.indexOf(nextTileI+"_"+nextTileJ));
		 if(record.indexOf(nextTileI+"_"+nextTileJ)==-1){
			 record.push(nextTileI+"_"+nextTileJ);
			 return true;
			
		 }else{
			return false;
		 }
		
	  }
	 
	  
  },
  //Move function sets the nexTile positions based on changes in dI and dJ
  //This is an example of a Ember.Observer, which gets executed each time
  //dI or dJ are changed
  move: function(){
	  var dI = this.get("dI");
	   // console.info("dI"+dI);
	    
	    var dJ = this.get("dJ");
	   // console.info("dJ"+dJ);
	  if(this.get('direction')=='down'){
		 dJ=1;
		  
	  }else if(this.get('direction')=='up'){
	
		 dJ=-1;
	
}
    
    var nextTileI = this.get("currentTileI") + dI;
    var nextTileJ = this.get("currentTileJ") + dJ;
   
    if(this.canMove(nextTileI, nextTileJ, dI, dJ)){
    	if(this.isFirst(nextTileI,nextTileJ)){
    		
    		count++;
    		
    	}
    	//console.info("count"+count);
    
     // this.moveFood();
      this.set("nextTileI", nextTileI);
      this.set("nextTileJ", nextTileJ);
     
      this.set("moving", true);
      
      
    }else{
    	
    	this.set('direction','stopped');
    	//this.set("moving",false);
    }
    //var special_x=this.get('map').getYFromJ()
    //(7,0) pass through (7,29)
    if(this.get("currentTileI")==0&&this.get("currentTileJ")==6){
    	
    	 this.set("nextTileI", 28);
         this.set("nextTileJ", 6);
         this.set('direction','left');
         this.set("moving", true);
         
    	
    }
  }.observes('dI', 'dJ'),

  handleKeyDown: function(event) {
	this.keyCode=event.keyCode;
    switch(parseInt(event.keyCode)) {
      case 37: this.set("direction", "left"); break;
      case 38: this.set("direction", "up");   break;
      case 39: this.set("direction", "right"); break;
      case 40: this.set("direction", "down"); break;
    }
  },

  //Once we arrived to a new tile, we update the current tile
  //We call move again as we want the Pacman to continue moving
  //in the given direction
  arrived: function(){
    this.set("moving", false);
    this.set("currentTileI", this.get("nextTileI"));
    this.set("currentTileJ", this.get("nextTileJ"));
  
    this.move();
  }
});
var x;
var y;
var x1;
var y1;
var x2;
var y2;
var x3;
var y3;
//Base class for an Agent View that renders it
App.AgentView = App.RaphaelView.extend({
  xBinding: "controller.x",
  yBinding: "controller.y",
  x1Binding:"control.x",
 y1Binding:"control.y",
 x2Binding:"pinkControl.x",
 y2Binding:"pinkControl.y",
 x3Binding:"orangeControl.x",
 y3Binding:"orangeControl.y",
  openPacmanBinding: "App.openPacman",
  closedPacmanBinding: "App.closedPacman",
  ghostSvgBinding:"App.greenGhost",

  time: 300,
  stop:false,
  //Each time x or y are changed we animate the sprite to move
  //to the new position
  animateMovement: function(){
      //Once we finished moving we want to let the controller know we arrived, so we setup the callback
      var callback = _.bind(this.get("controller.arrived"), this.get("controller"));
 //   var cb=_.bind(this.get("control.arrived"), this.get("control"));
      //We use Raphael's transform property which allows us to both animate eating by changing the path, and animate
      //moving by changing the Translation
      if(!this.stop){
      var r=paper.rect(this.get('x'),this.get('y'),36,36);
      r.attr('fill', "#000000");
      r.attr('stroke', "#000000");
     //remove  shadow, directly set sprite opacity
   
        x=this.get('x');
        y=this.get('y');
      this.get("sprite").animate({"transform": ""+ ["T",this.get("x"), this.get("y")],'opacity':0},this.get('time'),callback);
      
     this.set("sprite", this.get('paper').path(this.get("openPacman")));
      this.get("sprite").attr({
       fill: '#201A00',
       stroke: '#FFCC00',
       opacity:0
      });
      
      if(this.get("controller.keyCode")=='38'){
    	  this.get("sprite").animate({"transform": ["r",-90]+ ["T",this.get("x"), this.get("y")],'opacity':1});
    	  
      }else if(this.get("controller.keyCode")=='37'){
    	  this.get("sprite").animate({"transform": ["r",-180]+ ["T",this.get("x"), this.get("y")],'opacity':1});
      
      }else if(this.get("controller.keyCode")=='40'){
    	  this.get("sprite").animate({"transform": ["r",90]+ ["T",this.get("x"), this.get("y")],'opacity':1});
      }else{
      this.get("sprite").animate({"transform": ""+ ["T",this.get("x"), this.get("y")],'opacity':1});}
      this.animateOpen();
      var p=(count/f.length)*100;
      p=p.toPrecision(2);
      if(p==100){
    	  
    	  p=100;
      }
      this.get('progress').animate({'opacity':0});
      this.set('progress',this.get('paper').text(this.get("x"),this.get("y"),p+"%").attr({
    	  fill: this.get('fillColor'),
          stroke: this.get('strokeColor'),
          'font-size':'13'
      })
      );
      
      if(p==100){
    	  var message=paper.text(500,250,"You are winner!");
  		message.attr({
  			'font-size':'40px',
  			'stroke':'red'
  			
  		}); 
  		 this.stop=true;
		   //this.get("sprite").animate({"transform": ""+ ["T",x, y],'opacity':0}); 
      }
      }else{
    	 
    	  this.get("sprite").animate({'opacity':0},300,null,callback);
    	  
      }
//this.get("food").animate({"transform": ""+ ["T",this.get("x"), this.get("y")]});
     
  }.observes("x","y"),
  animate: function(){
	  var cb=_.bind(this.get("control.arrived"), this.get("control"));
	    
	// first ghost animation
	 this.get('ghost').animate({"transform": ""+ ["T",this.get("x1"), this.get("y1")],'opacity':0},this.get('time'),cb);
	 this.ghostDraw("ghostSvg","ghost");
	
	   this.get('ghost').attr({'opacity':0});
	       this.get("ghost").animate({"transform": ""+ ["T",this.get("x1"), this.get("y1")],"opacity":1});
	      
	       x1=this.get("x1");
	       y1=this.get("y1");
	       
	       
  }.observes("x1","y1"),
  pinkanimate: function(){
	  var pink_cb=_.bind(this.get("pinkControl.arrived"), this.get("pinkControl"));
	// second ghost animation
		 this.get('pink').animate({"transform": ""+ ["T",this.get("x2"), this.get("y2")],'opacity':0},this.get('time'),pink_cb);
		 this.ghostDraw("pinkghost","pink");
		
		   this.get('pink').attr({'opacity':0});
		       this.get("pink").animate({"transform": ""+ ["T",this.get("x2"), this.get("y2")],"opacity":1});
		      
		       x2=this.get("x2");
		       y2=this.get("y2");
	  
  }.observes("x2","y2"),
  orangeanimate: function(){
	  var orange_cb=_.bind(this.get("orangeControl.arrived"), this.get("orangeControl"));
	// second ghost animation
		 this.get('orange').animate({"transform": ""+ ["T",this.get("x3"), this.get("y3")],'opacity':0},this.get('time'),orange_cb);
		 this.ghostDraw("orangeghost","orange");
		
		   this.get('orange').attr({'opacity':0});
		       this.get("orange").animate({"transform": ""+ ["T",this.get("x3"), this.get("y3")],"opacity":1});
		      
		       x3=this.get("x3");
		       y3=this.get("y3");
	  
  }.observes("x3","y3"),
  catchup: function(){

	  var hero_x=x;    console.info("hero_x"+hero_x);
	  var hero_y=y;   console.info("hero_y"+hero_y);
	  var monster_x1=x1;   console.info("m_x"+monster_x1);
	  var monster_y1=y1;    console.info("m_y"+monster_y1);
	  var monster_x2=x2;
	  var monster_y2=y2;
	  var monster_x3=x3;
	  var monster_y3=y3;
	  
	  if((hero_x==monster_x1&&hero_y==monster_y1)||(hero_x==monster_x2&&hero_y==monster_y2)||(hero_x==monster_x3&&hero_y==monster_y3)){
		
		
		  
		var message=paper.text(500,250,"You are ate by monster!");
		message.attr({
			'font-size':'40px',
			'stroke':'red'
			
		});
		
		 this.stop=true;
		 
		// this.get("sprite").animate({"transform": ""+ ["T",x, y],'opacity':0},300);
	
		//this.set('controller.direction','stopped');
		
	  }
	  
  }.observes("x1","y1","x","y","x2","y2","x3","y3"),
  
  animateOpen: function(){
	     var call = _.bind(this.animateClosed, this);
	     this.get("sprite").animate({"path":this.get("closedPacman")}, 300, null, call);
	   },
	   animateClosed: function(){
	     var call = _.bind(this.animateOpen, this);
	     this.get("sprite").animate({"path":this.get("openPacman")}, 300, null, call);
	   },
	   renderGhostEye: function(ghost,eyeSvg, color){
		    var eye = this.get("paper").circle(eyeSvg.x, eyeSvg.y, eyeSvg.r);
		    eye.attr("fill", color);
		    this.get(ghost).push(eye);
		  },
		  ghostDraw:function(ghostName,ghost){
				 var paper = this.get("paper");
				    //We use a Raphael Set to group body and the eyes of the ghost.
				    //Raphael sets have the same Api as the Elements themselves, so we can still keep our animation
				    //code from AgentView.
				    var sprite = paper.set();
				  
				    var ghostBody = paper.path(this.get(ghostName+".path"));
				    ghostBody.attr({
				       fill: this.get(ghostName+'.fillColor'),
				       stroke: this.get(ghostName+'.strokeColor')
				    });
				 
				    sprite.push(ghostBody);
				  //  sprite.push(scared);
				    this.set(ghost, sprite);
				    var eyeballColor = this.get(ghostName+".eyeballColor");
				    var eyeColor = this.get(ghostName+".eyeColor");
				    this.renderGhostEye(ghost,this.get(ghostName+".leftEyeball"), eyeballColor); 
				    this.renderGhostEye(ghost,this.get(ghostName+".leftEye"), eyeColor);
				    this.renderGhostEye(ghost,this.get(ghostName+".rightEyeball"), eyeballColor);
				    this.renderGhostEye(ghost,this.get(ghostName+".rightEye"), eyeColor);
				 
				 
			 }
	  
});


App.PacmanView = App.AgentView.extend({
   //Controller that corresponds to this particular view
   //This is an Ember.Computed because if we did not evaluate it each time it would be a static property
   //and one controller would be used for each view
   controller: function(){return App.PacmanController.create();}.property(),
   openPacmanBinding: "App.openPacman",
   closedPacmanBinding: "App.closedPacman",
   fillColor:   "#201A00",
   strokeColor: "#FFCC00",
    //This is called when we insert the view into the DOM
   didInsertElement: function() {
      var _this = this;
      $('body').keydown(function(event) {
        _this.get("controller").handleKeyDown(event);
      });
      //We render the Pacman by calling Raphael.Paper path method which draws a path we setup before in svg.js
var food = this.get("paper").rect(this.get('x'),this.get('y'),36,36);
	
	  
      food.attr('fill', "#000000");
      food.attr('stroke', "#000000");
     this.set('food',food);
      
      this.set("sprite", this.get('paper').path(this.get("openPacman")));
      this.get("sprite").attr({
       fill: this.get('fillColor'),
       stroke: this.get('strokeColor')
      });
      //Move the Pacman to its starting x,y
      this.get("sprite").transform(""+ ["T",this.get("x"), this.get("y")]);
      this.animateOpen();
      var p=count/f.length;
    p=0;
      this.set('progress',this.get('paper').text(this.get("x"),this.get("y"),p+"%"));
      this.get('progress').attr({
    	  fill: '#fff',
          stroke: '#fff',
    	  'font-size':'13'
      });
      count=1;
      record.push(1+"_"+1);
    //  console.log( this.get("x"));
   },

   //These two functions animate between an open and a closed pacman
   animateOpen: function(){
     var callback = _.bind(this.animateClosed, this);
     this.get("sprite").animate({"path":this.get("closedPacman")}, 300, null, callback);
   },
   animateClosed: function(){
     var callback = _.bind(this.animateOpen, this);
     this.get("sprite").animate({"path":this.get("openPacman")}, 300, null, callback);
   }
});

//GhostView is almost the same as the Pacman view, however because the ghosts consist of mulitple
//svg elements, we need to have additional logic to create all of them
App.GhostView = App.AgentView.extend({
  ghostSvgBinding: "App.greenGhost",
  orangeghostBinding:"App.orangeGhost",
  pinkghostBinding:"App.pinkGhost",
  control: function(){return App.GhostController.create();}.property(),
  pinkControl:function(){return App.PinkController.create();}.property(),
  orangeControl:function(){return App.OrangeController.create();}.property(),
  didInsertElement: function() {
	  var _this = this;
	  // random direction
	  $('body').keydown(function(event) {
   _this.get("control").handleKeyDown(Math.floor(Math.random()*3+1));
   _this.get("pinkControl").handleKeyDown(Math.floor(Math.random()*3+1));
   _this.get("orangeControl").handleKeyDown(Math.floor(Math.random()*3+1));
    });
	 // first ghost: green Ghost 
   this.ghostDraw("ghostSvg","ghost");
   
    //The Translation transform will be applied to each element in the set
    this.get("ghost").transform(""+ ["T", 14*36, 10*36]);
    //second ghost: pink Ghost
    this.ghostDraw("pinkghost","pink");
    this.get("pink").transform(""+ ["T", 5*36, 6*36]);
    // third ghost:scared Ghost
    this.ghostDraw("orangeghost","orange");
    this.get("orange").transform(""+ ["T", 23*36, 6*36]);
  }
 
 
});
App.OrangeController = Ember.Controller.extend({
	currentTileI:23,
	  currentTileJ:6,
	  //Tile towards which we are moving
	  nextTileI:23,
	  nextTileJ:6,
mapBinding: "App.map",
	  
	  //Direction that we are moving in: up, down, left, right, stopped
	  direction: "stopped",
directions:[],
	  //Coordinates in pixels of the position we are moving towards
	  //This is an example of the Ember.Computed property
	  //Each time nextTileI is changed, x updates its value
	  //nextTile is only changed in the move() function
	  x: function(){
	    return this.get('map').getXFromI(this.get('nextTileI'));
	  }.property("nextTileI"),

	  y: function(){
	    return this.get('map').getYFromJ(this.get('nextTileJ'));
	  }.property("nextTileJ"),

	  dI: function(){
		    switch(this.get("direction")){
		      case "left": return -1; break;
		      case "right": return 1;  break;
		      default: return 0;
		    }
		  }.property("direction"),

		  dJ: function(){
			  console.info("DJ"+this.get("direction"));
		    switch(this.get("direction")){
		      case "up": return -1;  break;
		      case "down": return 1; break;
		      default: return 0;
		    }
		  }.property("direction"),

	
		  canMove: function(nextTileI, nextTileJ, dI, dJ) {
			  console.info("PathEnable"+this.get('map').tiles[this.get('map').getYFromJ(nextTileJ)/36][this.get('map').getXFromI(nextTileI)/36]);
		   var enablePath=this.get('map').tiles[this.get('map').getYFromJ(nextTileJ)/36][this.get('map').getXFromI(nextTileI)/36];
			  var haveNonZeroDirection = ((dI !== 0) || (dJ!== 0))&&(enablePath==0);
			  console.info("haveNonZeroDirection"+haveNonZeroDirection+dI+dJ);
			  
		    return haveNonZeroDirection;
		  },	  
		  move: function(){
			  var dI = this.get("dI");
			    console.info("dI"+dI);
			    
			    var dJ = this.get("dJ");
			    console.info("dJ"+dJ);
			  if(this.get('direction')=='down'){
				 dJ=1;
				  
			  }else if(this.get('direction')=='up'){
			
				 dJ=-1;
			
		}
		    
		    var nextTileI = this.get("currentTileI") + dI;
		    var nextTileJ = this.get("currentTileJ") + dJ;
		   
		    if(this.canMove(nextTileI, nextTileJ, dI, dJ)){
		    	
		    
		     // this.moveFood();
		      this.set("nextTileI", nextTileI);
		      this.set("nextTileJ", nextTileJ);
		      this.directions=[];
		      this.set("moving",true);

		  
		      
		    }else{
		    	this.directions.push(this.get('direction'));
		   console.info("currentD"+this.get('direction'));
		        console.info("directions"+this.directions);
		       
		        	this.set('direction','stopped');
		        	if(this.directions.indexOf('left')==-1){
		        		this.set('direction','left');
		        		this.move();
		        		
		        	
		        	}else if(this.directions.indexOf('right')==-1){
		        		this.set('direction','right');
		        		this.move();
		        	
		        	}else  if(this.directions.indexOf('up')==-1){
		        		this.set('direction','up');
		        		this.move();
		        	
		        	}else if(this.directions.indexOf('down')==-1){
		        		this.set('direction','down');
		        		this.move();
		        	
		        
		        }else if(this.get('direction')=='stopped'){
		        	this.set("moving",false);

		        	
		        	
		        }
		    }	
		    	//this.set("moving",false);
		    
		  }.observes('dI', 'dJ'),
		  handleKeyDown: function(random) {
			console.info("random"+random);
		    switch(random) {
		      case 1: this.set("direction", "left");console.info("keydwon"+this.get("direction")); break;
		      case 2: this.set("direction", "up");   console.info("keydwon"+this.get("direction")); break;
		      case 3: this.set("direction", "right");console.info("keydwon"+this.get("direction")); break;
		      case 4: this.set("direction", "down");console.info("keydwon"+this.get("direction")); break;
		      //default:this.set("direction", "left");
		    }
		  },

		  //Once we arrived to a new tile, we update the current tile
		  //We call move again as we want the Pacman to continue moving
		  //in the given direction
		  arrived: function(){
			

		    this.set("currentTileI", this.get("nextTileI"));
		    this.set("currentTileJ", this.get("nextTileJ"));
		
	

		    this.move();
		  }
	
	
	
	
});
App.PinkController = Ember.Controller.extend({
	 currentTileI:5,
	  currentTileJ:6,
	  //Tile towards which we are moving
	  nextTileI:5,
	  nextTileJ:6,
 mapBinding: "App.map",
	  
	  //Direction that we are moving in: up, down, left, right, stopped
	  direction: "stopped",
directions:[],
	  //Coordinates in pixels of the position we are moving towards
	  //This is an example of the Ember.Computed property
	  //Each time nextTileI is changed, x updates its value
	  //nextTile is only changed in the move() function
	  x: function(){
	    return this.get('map').getXFromI(this.get('nextTileI'));
	  }.property("nextTileI"),

	  y: function(){
	    return this.get('map').getYFromJ(this.get('nextTileJ'));
	  }.property("nextTileJ"),

	  dI: function(){
		    switch(this.get("direction")){
		      case "left": return -1; break;
		      case "right": return 1;  break;
		      default: return 0;
		    }
		  }.property("direction"),

		  dJ: function(){
			  console.info("DJ"+this.get("direction"));
		    switch(this.get("direction")){
		      case "up": return -1;  break;
		      case "down": return 1; break;
		      default: return 0;
		    }
		  }.property("direction"),

	
		  canMove: function(nextTileI, nextTileJ, dI, dJ) {
			  console.info("PathEnable"+this.get('map').tiles[this.get('map').getYFromJ(nextTileJ)/36][this.get('map').getXFromI(nextTileI)/36]);
		   var enablePath=this.get('map').tiles[this.get('map').getYFromJ(nextTileJ)/36][this.get('map').getXFromI(nextTileI)/36];
			  var haveNonZeroDirection = ((dI !== 0) || (dJ!== 0))&&(enablePath==0);
			  console.info("haveNonZeroDirection"+haveNonZeroDirection+dI+dJ);
			  
		    return haveNonZeroDirection;
		  },	  
		  move: function(){
			  var dI = this.get("dI");
			    console.info("dI"+dI);
			    
			    var dJ = this.get("dJ");
			    console.info("dJ"+dJ);
			  if(this.get('direction')=='down'){
				 dJ=1;
				  
			  }else if(this.get('direction')=='up'){
			
				 dJ=-1;
			
		}
		    
		    var nextTileI = this.get("currentTileI") + dI;
		    var nextTileJ = this.get("currentTileJ") + dJ;
		   
		    if(this.canMove(nextTileI, nextTileJ, dI, dJ)){
		    	
		    
		     // this.moveFood();
		      this.set("nextTileI", nextTileI);
		      this.set("nextTileJ", nextTileJ);
		      this.directions=[];
		      this.set("moving",true);

		  
		      
		    }else{
		    	this.directions.push(this.get('direction'));
		   console.info("currentD"+this.get('direction'));
		        console.info("directions"+this.directions);
		       
		        	this.set('direction','stopped');
		        	if(this.directions.indexOf('left')==-1){
		        		this.set('direction','left');
		        		this.move();
		        		
		        	
		        	}else if(this.directions.indexOf('right')==-1){
		        		this.set('direction','right');
		        		this.move();
		        	
		        	}else  if(this.directions.indexOf('up')==-1){
		        		this.set('direction','up');
		        		this.move();
		        	
		        	}else if(this.directions.indexOf('down')==-1){
		        		this.set('direction','down');
		        		this.move();
		        	
		        
		        }else if(this.get('direction')=='stopped'){
		        	this.set("moving",false);

		        	
		        	
		        }
		    }	
		    	//this.set("moving",false);
		    
		  }.observes('dI', 'dJ'),
		  handleKeyDown: function(random) {
			console.info("random"+random);
		    switch(random) {
		      case 1: this.set("direction", "left");console.info("keydwon"+this.get("direction")); break;
		      case 2: this.set("direction", "up");   console.info("keydwon"+this.get("direction")); break;
		      case 3: this.set("direction", "right");console.info("keydwon"+this.get("direction")); break;
		      case 4: this.set("direction", "down");console.info("keydwon"+this.get("direction")); break;
		      //default:this.set("direction", "left");
		    }
		  },

		  //Once we arrived to a new tile, we update the current tile
		  //We call move again as we want the Pacman to continue moving
		  //in the given direction
		  arrived: function(){
			

		    this.set("currentTileI", this.get("nextTileI"));
		    this.set("currentTileJ", this.get("nextTileJ"));
		
	

		    this.move();
		  }
	
	
	
});
App.GhostController = Ember.Controller.extend({
	 currentTileI:14,
	  currentTileJ:10,
	  //Tile towards which we are moving
	  nextTileI:14,
	  nextTileJ:10,
	  mapBinding: "App.map",
	  
	  //Direction that we are moving in: up, down, left, right, stopped
	  direction: "stopped",
directions:[],
	  //Coordinates in pixels of the position we are moving towards
	  //This is an example of the Ember.Computed property
	  //Each time nextTileI is changed, x updates its value
	  //nextTile is only changed in the move() function
	  x: function(){
	    return this.get('map').getXFromI(this.get('nextTileI'));
	  }.property("nextTileI"),

	  y: function(){
	    return this.get('map').getYFromJ(this.get('nextTileJ'));
	  }.property("nextTileJ"),

	  dI: function(){
		    switch(this.get("direction")){
		      case "left": return -1; break;
		      case "right": return 1;  break;
		      default: return 0;
		    }
		  }.property("direction"),

		  dJ: function(){
			  console.info("DJ"+this.get("direction"));
		    switch(this.get("direction")){
		      case "up": return -1;  break;
		      case "down": return 1; break;
		      default: return 0;
		    }
		  }.property("direction"),

	
		  canMove: function(nextTileI, nextTileJ, dI, dJ) {
			  console.info("PathEnable"+this.get('map').tiles[this.get('map').getYFromJ(nextTileJ)/36][this.get('map').getXFromI(nextTileI)/36]);
		   var enablePath=this.get('map').tiles[this.get('map').getYFromJ(nextTileJ)/36][this.get('map').getXFromI(nextTileI)/36];
			  var haveNonZeroDirection = ((dI !== 0) || (dJ!== 0))&&(enablePath==0);
			  console.info("haveNonZeroDirection"+haveNonZeroDirection+dI+dJ);
			  
		    return haveNonZeroDirection;
		  },	  
		  move: function(){
			  var dI = this.get("dI");
			    console.info("dI"+dI);
			    
			    var dJ = this.get("dJ");
			    console.info("dJ"+dJ);
			  if(this.get('direction')=='down'){
				 dJ=1;
				  
			  }else if(this.get('direction')=='up'){
			
				 dJ=-1;
			
		}
		    
		    var nextTileI = this.get("currentTileI") + dI;
		    var nextTileJ = this.get("currentTileJ") + dJ;
		   
		    if(this.canMove(nextTileI, nextTileJ, dI, dJ)){
		    	
		    
		     // this.moveFood();
		      this.set("nextTileI", nextTileI);
		      this.set("nextTileJ", nextTileJ);
		      this.directions=[];
		      this.set("moving",true);

		  
		      
		    }else{
		    	this.directions.push(this.get('direction'));
		   console.info("currentD"+this.get('direction'));
		        console.info("directions"+this.directions);
		       
		        	this.set('direction','stopped');
		        	if(this.directions.indexOf('left')==-1){
		        		this.set('direction','left');
		        		this.move();
		        		
		        	
		        	}else if(this.directions.indexOf('right')==-1){
		        		this.set('direction','right');
		        		this.move();
		        	
		        	}else  if(this.directions.indexOf('up')==-1){
		        		this.set('direction','up');
		        		this.move();
		        	
		        	}else if(this.directions.indexOf('down')==-1){
		        		this.set('direction','down');
		        		this.move();
		        	
		        
		        }else if(this.get('direction')=='stopped'){
		        	this.set("moving",false);

		        	
		        	
		        }
		    }	
		    	//this.set("moving",false);
		    
		  }.observes('dI', 'dJ'),
		  handleKeyDown: function(random) {
			console.info("random"+random);
		    switch(random) {
		      case 1: this.set("direction", "left");console.info("keydwon"+this.get("direction")); break;
		      case 2: this.set("direction", "up");   console.info("keydwon"+this.get("direction")); break;
		      case 3: this.set("direction", "right");console.info("keydwon"+this.get("direction")); break;
		      case 4: this.set("direction", "down");console.info("keydwon"+this.get("direction")); break;
		      //default:this.set("direction", "left");
		    }
		  },

		  //Once we arrived to a new tile, we update the current tile
		  //We call move again as we want the Pacman to continue moving
		  //in the given direction
		  arrived: function(){
			

		    this.set("currentTileI", this.get("nextTileI"));
		    this.set("currentTileJ", this.get("nextTileJ"));
		
	

		    this.move();
		  }

});
