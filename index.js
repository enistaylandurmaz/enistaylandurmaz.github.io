const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
let background;
let animationFrameId;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const pngWidth = 64*16;
const pngHeight = 180*16;
let chests = [
    new sprite({
        position: { x: 16, y: 16*178 },
        width: 16,
        height: 16,
        imageSrc: './img/closed_chest.png'
    }),
    new sprite({position:{x:16,y:169*16},width:16, height:16,imageSrc:'./img/closed_chest.png'}),
    new sprite({position:{x:16*62,y:166*16},width:16, height:16,imageSrc:'./img/closed_chest.png'})
]   
chests.forEach(chest => {
    chest.keySprite = new sprite({
        position: { x: chest.position.x, y: chest.position.y - 16 },
        imageSrc: './img/key.png',
        width: 16,
        height: 16
    });
    chest.opened = false;
    chest.keyCollected = false;
});

let doors = [
    new sprite({ position: { x: 16*8, y: 16*177 }, imageSrc: './img/closed_door.png', width: 16, height: 32 }),
    new sprite({position:{x:27*16,y:16*177},imageSrc:'./img/closed_door.png', width:16, height:32}),
    new sprite({position:{x:21*16,y:16*153},imageSrc:'./img/closed_door.png', width:16, height:32})
];
doors.forEach(door => {
    door.opened = false;
});
let enemySprite = new Image();
enemySprite.src = './img/VampireBat.png';


const scaled_canvas ={
    width: canvas.width/3,
    height: canvas.height/3
}

const collision2d = []
for (let i = 0; i < collisiondata.length; i+=64){
    collision2d.push(collisiondata.slice(i, i + 64))
}
const collisionblocks = []
collision2d.forEach((row, y)=>{
    row.forEach((Symbol, x)=>{
        if (Symbol === 356 || Symbol === 431 || Symbol === 461){
            collisionblocks.push(new collisionblock({position:{
            x:x*16,
            y:y*16
            }
        }))}
    })
})

const player = new Player({position:
    {x:16*3,
    y:pngHeight-16
    },
    collisionblocks
})

let enemies = [
    new enemy({position: { x: 14*16, y: 173*16 },speed: 0.9,collisionblocks,width: 16, height: 16}),
      new enemy({
        position: { x: 53*16, y: 169*16 },
        speed: 0.9,
        collisionblocks,
        width: 16, 
        height: 16
      }),
      new enemy({
        position: { x: 49*16, y: 158*16 },
        speed: 0.9,
        collisionblocks,
        width: 16, 
        height: 16
      }),
      new enemy({position: { x: 2*16, y: 154*16 },speed: 0.9,collisionblocks,width: 16, height: 16}),
      new enemy({position: { x: 4*16, y: 154*16 },speed: 0.9,collisionblocks,width: 16, height: 16}),
      new enemy({position: { x: 6*16, y: 154*16 },speed: 0.9,collisionblocks,width: 16, height: 16}),
      new enemy({position: { x: 8*16, y: 154*16 },speed: 0.9,collisionblocks,width: 16, height: 16}),
      new enemy({position: { x: 10*16, y: 154*16 },speed: 0.9,collisionblocks,width: 16, height: 16}),
      new enemy({position: { x: 12*16, y: 154*16 },speed: 0.9,collisionblocks,width: 16, height: 16}),
      new enemy({position: { x: 14*16, y: 154*16 },speed: 0.9,collisionblocks,width: 16, height: 16}),
]

background = new sprite({
    position: { x: 0, y: 0 },
    width: 1024,
    height: 576,
    imageSrc: './img/background.png',
});

let signs = [];

fetch('./js/data/texts.json')
    .then(response => response.json())
    .then(data => {
        signs = data.map(item => new sprite({
            position: { x: item.signPosition.x, y: item.signPosition.y },
            imageSrc: item.imageSrc,
            width: 16,
            height: 16,
            textContent: item.textContent,
            displayTextPosition: item.displayTextPosition,
            textStyle: item.textStyle,
            color: item.color,
            maxwidth: item.maxwidth,
            lineHeight: item.lineHeight
        }));         
    })
    .catch(error => {
        console.error("Error loading resources:", error);
    });
const camera ={
    position:{
        x:0,
        y:-pngHeight + scaled_canvas.height
    }
}
const fps = 230;  // Frames per second
const interval = 1000 / fps;  // Interval in milliseconds
let lastTime = 0;

function animate(timestamp) {
    requestAnimationFrame(animate);  // Continue the loop

    if (timestamp - lastTime < interval) {
        return;  // Skip the frame if the interval isn't passed
    }

    lastTime = timestamp - (timestamp % interval);  // Adjust lastTime by the frame slippage

    // Game updates and rendering
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.scale(3,3)
    c.translate(camera.position.x, camera.position.y);
    
    // Sub-function calls remain unchanged
    player.camera_to_right({scaled_canvas, camera, canvas});
    player.camera_to_left({scaled_canvas, camera, canvas});
    player.camera_to_up({scaled_canvas, camera, canvas});
    player.camera_to_down({scaled_canvas, camera, canvas});
    
    collisionblocks.forEach(collisionblock => {
        collisionblock.update();
    });
    background.update();
    chests.forEach(chest => {
        chest.update();
        if (chest.keyCollected) {
            chest.keySprite.update();
        }
    });
    doors.forEach(door => {
        door.update();
    });
    signs.forEach(sign => {
        sign.update();
    });
    enemies.forEach(enemy => {
        enemy.update();
    });
    player.update();
    
    c.restore();
}


window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            player.horizontalAcceleration = 0.046;
            break;
        case 'ArrowLeft':
            player.horizontalAcceleration = -0.046;
            break;
        case 'ArrowUp':
            player.jump();
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowRight':
        case 'ArrowLeft':
            player.horizontalAcceleration = 0; // Stop acceleration
            break;
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('startButton');

    startButton.addEventListener('click', startGame)
    
});

window.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const arrowSize = 30;
    const padding = 5;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const arrowBounds = {
        x: padding,
        y: padding,
        width: arrowSize,
        height: arrowSize
    };

    
    if (clickX >= arrowBounds.x && clickX <= arrowBounds.x + arrowBounds.width &&
        clickY >= arrowBounds.y && clickY <= arrowBounds.y + arrowBounds.height) {
        endGame(); 
    }
});
