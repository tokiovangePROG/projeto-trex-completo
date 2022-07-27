var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, groundImage, invisibleGround;
var trex ,trex_running, trex_collided;

var cloud, cloudImage, cloudsGroup;
var obstacle, obstacle1,obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstaclesGroup;

var score;
var gameOver, restart, gameOverImg, restartImg;
var jumpSound, checkPointSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkpoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,windowHeight-90,20,50);
  trex.addAnimation("running",trex_running);  
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  trex.x = 50;
  trex.debug = false;
  
  ground = createSprite(windowWidth/2,windowHeight - 20,1200,10);
  ground.addImage("ground",groundImage);

  invisibleGround = createSprite(300,windowHeight+10,600,40);
  invisibleGround.visible = false;
  score = 0;

  gameOver = createSprite(windowWidth/2,windowHeight/2-20, 400, 20);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  restart = createSprite(windowWidth/2,windowHeight/2+20);
  restart.addImage(restartImg);
  restart.scale = 0.3;
  restart.visible = false;

  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
}

function draw(){
  background("black");
  stroke("blue")
  text("score:"+score,20,30);
  if(gameState === PLAY){
    if(ground.x < 200){
      ground.x = ground.width / 2;
      }
    ground.velocityX = -(2 + 3 * score/100);
    score = score + Math.round(getFrameRate()/60);
    if(score > 0 && score % 100 === 0){
      checkPointSound.play();
    }
      if (touches.length > 0 || keyDown("space") && trex.y >= windowHeight-40){
        trex.velocityY = -14;
        jumpSound.play();
        touches = [];
      }
      trex.velocityY = trex.velocityY + 0.7;
      spawnClouds();
      spawnObstacles();
      if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        gameState = END;
        dieSound.play();
      }
  }
  else if(gameState === END){
    ground.velocityX = 0;
    obstaclesGroup.velocityX = 0;

       gameOver.visible = true;
       restart.visible = true;
       ground.velocityX = 0;
       trex.velocityY = 0; 
       trex.changeAnimation("collided", trex_collided); 
       obstaclesGroup.setLifetimeEach(-1);
       cloudsGroup.setLifetimeEach(-1); 
       obstaclesGroup.setVelocityXEach(0); 
       cloudsGroup.setVelocityXEach(0);
       if(mousePressedOver(restart)){
        reset();
       }
  }

  trex.collide(invisibleGround);

  drawSprites();
}


function spawnClouds(){
  if(frameCount%30 === 0){
  cloud = createSprite(windowWidth,100,40,10);
  cloud.velocityX = -3;
  cloud.scale = 0.5;
  cloud.addImage(cloudImage);
  cloud.y = Math.round(random(30,300));
  cloud.depth = trex.depth;
  trex.depth= trex.depth+1;
  cloud.lifetime = 700;
  cloudsGroup.add(cloud);
}
}

  function spawnObstacles (){
     if(frameCount%60 === 0){
       var obstacle = createSprite(windowWidth,windowHeight-30,10,40);
        obstacle.velocityX = -(6 + score/100);
         obstacle.scale = 0.5;
    obstacle.lifetime= 500;
    var rand = Math.round(random(1,6));
     switch(rand){
       case 1:obstacle.addImage(obstacle1);
        break; 
        case 2: obstacle.addImage(obstacle2);
         break;
          case 3: obstacle.addImage(obstacle3); 
          break;
          case 4: obstacle.addImage(obstacle4);
           break;
            case 5: obstacle.addImage(obstacle5);
             break;
              case 6: obstacle.addImage(obstacle6);
               break;
                default: break; } 
                obstaclesGroup.add(obstacle);
              } }

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);
  
  score = 0;
}