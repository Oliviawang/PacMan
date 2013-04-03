//Simple map where 1s are walls and 0s are empty tiles
var mapData=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1],
             [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
             [1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1],
             [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,1,1,0,1,0,1,0,1,0,0,1],
             [1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,1,1,0,1],
             [0,0,0,0,0,0,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
             [1,0,1,1,1,0,1,0,0,0,0,0,1,1,0,1,1,0,1,0,1,1,0,1,1,1,1,0,1],
             [1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
             [1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1],
             [1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,1,0,1,0,1,1,0,1],
             [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1],
             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
var f=new Array();
/*
  Map object that contains information about the world, right now
  it just contains tile size and location of the walls
*/
App.map = Ember.Object.create({
  tileSize: 36,
  tiles:    $.extend(true,[],mapData),
  getXFromI: function(index) { return index * this.get('tileSize'); },
  getYFromJ: function(index) { return index * this.get('tileSize'); },
  food:function(index){
	  if(this.tiles[index]===0){
		  var food=paper.path("M15.5,3.029l-10.8,6.235L4.7,21.735L15.5,27.971l10.8-6.235V9.265L15.5,3.029zM15.5,7.029l6.327,3.652L15.5,14.334l-6.326-3.652L15.5,7.029zM24.988,10.599L16,15.789v10.378c0,0.275-0.225,0.5-0.5,0.5s-0.5-0.225-0.5-0.5V15.786l-8.987-5.188c-0.239-0.138-0.321-0.444-0.183-0.683c0.138-0.238,0.444-0.321,0.683-0.183l8.988,5.189l8.988-5.189c0.238-0.138,0.545-0.055,0.684,0.184C25.309,10.155,25.227,10.461,24.988,10.599z");
          food.attr({
              fill: "#00A9E9",
              stroke:"F2F2F2" 
           });
          food.transform(["T",this.get('getXFromI'),this.get('getYFromJ')]);
		return food;  
	  }
	  
	  
  }
});

/*
  View that renders a single tile on the screen
*/
App.TileView = App.RaphaelView.extend({

  //Binding to the map data, example of Ember bindings
  mapBinding: 'App.map',
  wallColor:  '#1e1e1e',
  floorColor: '#000000',

  //Ember computed that given our horizontal index, computes the horizontal
  //coordinate. It uses contentIndex property of Ember.CollectionView
  positionX: function() {
    return this.get('map').getXFromI(this.get('contentIndex'));
  }.property('contentIndex'),

  //We get the Y coordinate by using the contentIndex of our parent
  positionY: function() {
    return this.get('map').getYFromJ(this.get('parentView.contentIndex'));
  }.property('parentView.contentIndex'),

  size: function(){
    return this.get('map.tileSize');
  }.property('map.tileSize'),

  // Render sprite with Raphael
  didInsertElement: function() {
    var paper = this.get('paper');
    var size = this.get('size');
    var sprite = paper.rect(this.get('positionX'),this.get('positionY'),size,size);
   
    var color = this.get("content") === 1 ? this.get('wallColor') : this.get('floorColor');
    sprite.attr('fill', color);
    sprite.attr('stroke', color);
    this.set("sprite", sprite);
    //this.set("food",food);
    if(this.get("content")===0){
        var food=paper.path("M15.5,3.029l-10.8,6.235L4.7,21.735L15.5,27.971l10.8-6.235V9.265L15.5,3.029zM15.5,7.029l6.327,3.652L15.5,14.334l-6.326-3.652L15.5,7.029zM24.988,10.599L16,15.789v10.378c0,0.275-0.225,0.5-0.5,0.5s-0.5-0.225-0.5-0.5V15.786l-8.987-5.188c-0.239-0.138-0.321-0.444-0.183-0.683c0.138-0.238,0.444-0.321,0.683-0.183l8.988,5.189l8.988-5.189c0.238-0.138,0.545-0.055,0.684,0.184C25.309,10.155,25.227,10.461,24.988,10.599z");
           food.attr({
               fill: "#00A9E9",
               stroke:"F2F2F2" 
            });
           food.transform(["T",this.get('positionX'),this.get('positionY')]);
           f.push(food);
         //  this.set("food",f);
       //  food.node.setAttribute(this.get('contentIndex'),food);
         this.set("food",food);
           //console.info("f1"+f);
        }
  }
});

//Ember CollectionView that keeps one row of tiles
App.TileRowView = Ember.CollectionView.extend({
  itemViewClass: App.TileView
});

/*
  Ember CollectionView that keeps the 2d collection of TilesView
  Based on itemViewClass, Ember automatically creates a TileRowView
  for each row in mapData
*/
App.TilesView = Ember.CollectionView.extend({
  content: App.map.get("tiles"),
  itemViewClass: App.TileRowView,
  
});
App.Progress= App.RaphaelView.extend({
	itemViewClass: function(){ return this.get("paper").text(1300,700,"Hero finish ..").attr({'fill':'red','stroke':'red'});}
	
	
});
//Basic MapView that contains TilesView and any other views we might need
//It is referenced from index.html
App.MapView = Ember.View.extend();
