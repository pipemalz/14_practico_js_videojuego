//DECLARACION DE VARIABLES

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const checkboxGrid = document.getElementById('grid');
const rangeGridWidth = document.getElementById('gridWidth');
const settingsIcon = document.getElementById('settings-icon');
const settingsItems = document.getElementById('settings-items');
const botones = {
    'Arriba' : document.getElementById('up'),
    'Abajo' : document.getElementById('down'),
    'Izquierda' : document.getElementById('left'),
    'Derecha' : document.getElementById('right'),
};
let startPosition = true;
const playerPosition = {
        x : 0,
        y : 0,
        xIndex : null,
        yIndex : null
};
const positions = {};
let level = 0;
function setListener(){
    //Listerners de renderizado
    window.addEventListener('resize', drawGame);
    checkboxGrid.addEventListener('click', drawGame);
    rangeGridWidth.addEventListener('input', drawGame);

    //Listeners de movimiento
    document.addEventListener('keydown',detectarMovimiento);
    for(let boton in botones){
        botones[boton].addEventListener('click', detectarMovimiento);
    };

    //Listeners de configuraciones
    settingsIcon.addEventListener('click', function(){
        settingsItems.classList.toggle('settings-active');
    });
}
const bombPositions = []
let giftPosition = {}

//FUNCIONES DE RENDERIZADO

function drawGame(){
    detectarColision();
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvas();
    drawGrid();
    setPositions();
    drawElement(level);
    drawPlayer();
};

function drawCanvas(){
    let size = 800;
    if(window.innerWidth < 900 || window.innerHeight < 900){
        size = window.innerWidth - 100;
        if(window.innerHeight < window.innerWidth){
            size = window.innerHeight - 150;
        };
        if(window.innerHeight < 300 || window.innerWidth < 300){
            size = 200;
        };
    };
    canvas.width = size;
    canvas.height = size;
};

function drawGrid(){
    let size = canvas.width / 10;
    context.lineWidth = rangeGridWidth.value;
    
    if(checkboxGrid.checked){
        context.strokeStyle='indigo';
    }else{
        context.strokeStyle='transparent';
    };
    while(size < canvas.width){
        context.beginPath();
        context.moveTo(size, 0);
        context.lineTo(size, canvas.height);
        context.stroke();
        context.beginPath();
        context.moveTo(0, size);
        context.lineTo(canvas.width, size);
        context.stroke();
        size += canvas.width / 10;
    };
};

function getMap(index){
    const rows = maps[index].match(/[XIO\-]+/g);
    return rows.map(row=> row.split(''));
}

function drawElement(lvl){
    const size = canvas.width / 10;
    const map = getMap(lvl);
    context.font=`${size * 0.75}px sans-serif`;
    context.textAlign='left';
    context.textBaseline='top';

    let responsiveY = 5;
    if(canvas.width > 600){
        responsiveY = 15;
    }
    let bombCount = 0;
    map.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            const x = positions[colIndex];
            const y = positions[rowIndex];
            context.fillText(emojis[col], x, y + responsiveY);
            if(col == 'O'){
                if(startPosition){
                    playerPosition.x = x;
                    playerPosition.y = y;
                    playerPosition.xIndex = colIndex;
                    playerPosition.yIndex = rowIndex;
                    drawPlayer();
                }
            }else if(col == 'X'){
                bombPositions[bombCount] = {x: x, y: y, xIndex: colIndex, yIndex: rowIndex};
                bombCount++;
            }else if(col == 'I'){
                giftPosition = {x: x, y: y, xIndex: colIndex, yIndex: rowIndex};
            };
        });
    });
};

function drawPlayer(){
    let responsiveY = 5;
    if(canvas.width > 600){
        responsiveY = 15;
    }
    
    // const state = detectarColision();

    let emoji = null;

    // if(state === 'DEAD'){
    //     emoji = 'BOMB_COLLISION';
    // }else if(state === 'WIN'){
    //     emoji = 'WIN';
    // }else{
        emoji = 'PLAYER';
    // }

    context.fillText(emojis[emoji], positions[playerPosition.xIndex], positions[playerPosition.yIndex] + responsiveY );
}

//FUNCIONES DE MOVIMIENTO
function detectarColision(){
    let collision = false;
    if(playerPosition.xIndex === giftPosition.xIndex && playerPosition.yIndex === giftPosition.yIndex){
        winLevel();
    }else{
        bombPositions.forEach(bomb => {
            if(bomb.xIndex === playerPosition.xIndex && bomb.yIndex === playerPosition.yIndex){
                loseLevel();
            }
        });
    }
    return collision;
}

function winLevel(){
    if(level < (maps.length-1)){
        bombPositions.splice(0, bombPositions.length);
        level++;
        startPosition = true;
    }else if (level == (maps.length - 1)){
        winGame();
    }
}

function loseLevel(){
    bombPositions.splice(0, bombPositions.length);
    startPosition = true;
}

function winGame(){
    alert('TERMINASTE EL JUEGO, FELICIDADES.')
}


function setPositions(){
    for(let i = 0; i < 10; i++){
        positions[i] = (canvas.width / 10) * i;
    }
}

function detectarMovimiento(e){
    if(e.code){
        const keys = {
            'ArrowUp' : 'Arriba',
            'ArrowRight' : 'Derecha',
            'ArrowDown' : 'Abajo',
            'ArrowLeft' : 'Izquierda'
        };
        if(keys.hasOwnProperty(e.code)){
        };
        moverJugador(keys[e.code]);
    }else if(e.target){
        for(let boton in botones){
            if(e.target == botones[boton]){
                moverJugador(boton);
            };
        };
    };
};
    
function moverJugador(direccion){
    if(direccion){
        startPosition = false;
        if(direccion == 'Arriba'){
            if(playerPosition.yIndex > 0){
                playerPosition.yIndex--;
            }
        }else if(direccion == 'Abajo'){
            if(playerPosition.yIndex < 9){
                playerPosition.yIndex++;
            }
        }else if(direccion == 'Derecha'){
            if(playerPosition.xIndex < 9){
                playerPosition.xIndex++;
            }
        }else if(direccion == 'Izquierda'){
            if(playerPosition.xIndex > 0){
                playerPosition.xIndex--;
            }
        }
    };
    drawGame();
};

function startGame() {
    setListener();
    drawGame();
};

window.addEventListener('load', startGame);

let bombCount = 0;