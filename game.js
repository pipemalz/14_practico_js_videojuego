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
let startPosition = {};
const playerPosition = {
        x : 0,
        y : 0,
        xIndex : null,
        yIndex : null
};

const positions = {};

function setPositions(){
    for(let i = 0; i < 10; i++){
        positions[i] = (canvas.width / 10) * i;
    }
    console.log(positions);
}

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

//FUNCIONES DE RENDERIZADO

function drawGame(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvas();
    drawGrid();
    setPositions();
    drawElement(2);
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

    map.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            const x = positions[colIndex];
            const y = positions[rowIndex];
            context.fillText(emojis[col], x, y);
            if(col == 'O'){
                if(startPosition != null){
                    startPosition = {
                        x : x,
                        y : y
                    };
                    playerPosition.x = x;
                    playerPosition.y = y;
                    playerPosition.xIndex = colIndex;
                    playerPosition.yIndex = rowIndex;
                    drawPlayer();
                }
            };
        });
    });
};

function drawPlayer(){
    context.fillText(emojis['PLAYER'], positions[playerPosition.xIndex], positions[playerPosition.yIndex] );
}

//FUNCIONES DE MOVIMIENTO

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
    const size = canvas.width / 10;
    if(direccion){
        startPosition = null;
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
