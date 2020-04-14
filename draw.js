// Load SPR files
let item_spr = new Image();
item_spr.src = "https://www.mysteralegacy.com/data/misc/item16.png?v=5.0.4";

let tile_spr = new Image();
tile_spr.src = "https://www.mysteralegacy.com/data/misc/tile16.png?v=5.0.4";

// Spritesheet Canvas
let mapCanvas = document.getElementById("map");
let mapContext = mapCanvas.getContext("2d");

// Config
let spriteSize = 8;

// Events
mapCanvas.addEventListener('mousemove', getCoordsFromMouse);

// Draw single Spr
function draw(spr, xMap = 0, yMap = 0){
  let file;

  if (isNaN(spr)){
    throw 'Trying to draw a NaN SPR.'
  }

  if (spr <= 0){
    file = tile_spr;
    spr *= -1;
  }
  else if (spr > 0) {
    file = item_spr
  }

  let sprCount = 0;
  for (let y = 0; y < 64; y++){
    for (let x = 0; x < 16; x++){
      if (sprCount === spr){
        // (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        mapContext.drawImage(file, 16*x, y*16, 16, 16, xMap * spriteSize, yMap * spriteSize, spriteSize, spriteSize);        
      }
      sprCount++;
    }
  }
}

// Print mouse sprX/sprY
function getCoordsFromMouse(event){
  let rect = mapCanvas.getBoundingClientRect();
  let trueX = event.clientX - rect.left;
  let trueY = event.clientY - rect.top;

  let sprX = Math.floor(trueX / spriteSize);
  let sprY = Math.floor(trueY / spriteSize);

  console.log({x: sprX, y: sprY});
}

// Connect to client and retreive screen data.
const socket = new WebSocket('ws://localhost:8080');
let map = [];

socket.onopen = function (event) {
  console.log('Websocket connected.');
}

socket.onmessage = function(message) {
  let data = JSON.parse(message.data);
  mapCanvas.width = data._width * spriteSize;
  mapCanvas.height = data._height * spriteSize;
  map = data._data;

  tile_spr.onload = () => {
    drawMapScreen();
  }
}

function buildComplexObject(object){
  if (!object.build){
    return false;
  }

  // Complex 'object' positions
  let sprX = object.x;
  let sprY = object.y;
  // Split the complex object data points
  let builds = object.build.split(",");
  // Used to hold splitted values.
  let splitData, splitBegin, splitEnd;
  // Unknown
  let iSomething, oSomething, oContent;

  // Start decoding the complex object
  for (let build in builds){
    if (builds[build] === "n")
      sprY--;
    else if (builds[build] === "s")
      sprY++;
    else if (builds[build] === "w")
      sprX--;
    else if (builds[build] === "e")
      sprX++;
    else {
      if (builds[build].includes("b")){
        object.can_block = 1;
        builds[build] = builds[build].replace("b", '')
      }

      if (builds[build].includes("f")){
        iSomething = 1;
        builds[build] = builds[build].replace("f", '')
      }

      if (builds[build].includes("a")){
        oSomething = 1;
        builds[build].replace("a", '')
        continue;
      }

      if (builds[build].includes("o")){
        splitData = builds[build].split("");
        splitBegin = splitData.indexOf("o");
        splitEnd = splitData.indexOf("|", splitBegin);
        oContent = splitData.splice(splitBegin, splitEnd - splitBegin + 1);
        oContent.pop();
        oContent.shift();
        oContent = Number(oContent.join(""));
        builds[build] = splitData.join("");
      }

      if (builds[build].includes("t")){
        splitData = builds[build].split("");
        splitBegin = splitData.indexOf("t");
        splitEnd = splitData.indexOf("|", splitBegin);
        let tContent = splitData.splice(splitBegin, splitEnd - splitBegin + 1);
        tContent.pop();
        tContent.shift();
        tContent = Number("0x" + tContent.join(""))
        builds[build] = splitData.join("");
      }

      if (builds[build].includes("q")){
        splitData = builds[build].split("");
        splitBegin = splitData.indexOf("q");
        splitEnd = splitData.indexOf("|", splitBegin);
        let qData = splitData.splice(splitBegin, splitEnd - splitBegin + 1);
        qData.pop();
        qData.shift();
        qData = Number(qData.join(""));
        builds[build] = splitData.join("")
        continue;
      }

      // Get build value
      builds[build] = Number(builds[build]);

      if (isNaN(builds[build]))
        builds[build] = 858;

      // Replace the main 'object' SPR
      object.sprite = builds[build];
      
      // Draw complex object SPR
      if (builds[build] < 0)
        builds[build] = -builds[build];

      draw(builds[build], object.x, object.y);
    }
  }

  return true;
}

function drawMapScreen(){
  // clear
  mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

  // Draw screen data.
  for (let tile in map){
    let tileData = map[tile];
    // Draw tile
    if (map[tile].sprite !== 0){
      draw(-map[tile].sprite, map[tile].x, map[tile].y)
    }

    // Build objects with build
    for (let object in map[tile].objects){
      // This will modify map[tile].objects[object].sprite
      buildComplexObject(map[tile].objects[object]);

      // Draw objects
      draw(map[tile].objects[object].sprite, map[tile].objects[object].x, map[tile].objects[object].y);
    }
  }
}