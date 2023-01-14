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
        y : 0
};

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

    map.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            const x = colIndex * size;
            const y = rowIndex * size;
            context.fillText(emojis[col], x, y + responsiveY);
            if(col == 'O'){
                if(startPosition != null){
                    startPosition = {
                        x : x,
                        y : y
                    };
                    playerPosition.x = x;
                    playerPosition.y = y;
                    drawPlayer(x,y);
                }
            };
        });
    });
};

function drawPlayer(x, y){
    let responsiveY = 5;
    if(canvas.width > 600){
        responsiveY = 15;
    }
    context.fillText(emojis['PLAYER'], x, y + responsiveY);
}

function drawGame(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvas();
    drawGrid();
    drawElement(1);
    drawPlayer(playerPosition.x, playerPosition.y);
};

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
            if(playerPosition.y != 0){
                playerPosition.y -= size;
            }
        }else if(direccion == 'Abajo'){
            if(playerPosition.y != canvas.height - size){
                playerPosition.y += size;
            }
        }else if(direccion == 'Derecha'){
            if(playerPosition.x != (canvas.width - size)){
                playerPosition.x += size;
            }
        }else if(direccion == 'Izquierda'){
            if(playerPosition.x != 0){
                playerPosition.x -= size;
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
