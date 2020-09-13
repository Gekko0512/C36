var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState;
var deadDogImg,dogVaccinationImg,gardenImg,injectionImg,lazyDogImg,livingRoomImg,milkImg,runningRightImg,runningleftImg,vaccinationImg;
var washRoomImg,bedroomImg;    
var changeGameState,readGameState;

function preload(){
sadDog=loadImage("virtual pet images/Dog.png");
happyDog=loadImage("virtual pet images/happy dog.png");
deadDogImg = loadImage("virtual pet images/deadDog.png");
dogVaccinationImg = loadImage("virtual pet images/dog");
gardenImg = loadImage("virtual pet images/garden.png");
injectionImg = loadImage("virtual pet images/injection.png");
lazydogImg = loadImage("virtual pet images/lazyDog.png");
livingRoomImg = loadImage("virtual pet images/living room.png");
milkImg = loadImage("virtual pet images/milk.png");
runningRightImg = loadImage("virtual pet images/running.png");
runningLeftImg = loadImage("virtual pet images/runningLeft.png");
vaccinationImg = loadImage("virtual pet images/vaccination.png");
washroomImg = loadImage("virtual pet images/washroom.png");
bedroomImg = loadImage("virtual pet images/bedroom.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readGameState = database.ref('gameState');
  readGameState.on("value",function(data){gameState=data.val();});
  
}

function draw() {
  

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  
  currentTime=hour();
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
    if(currentTime==(lastFed+1)){
       update("playing");
      foodObj.garden();
    }else if(currentTime==lastFed+2){
              update("sleeping");
     foodObj.bedroom();
    }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){}
          
          fill(255,255,254);
  
 
  drawSprites();
        
}

  


//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}