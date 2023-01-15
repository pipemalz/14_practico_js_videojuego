//DECLARACION DE VARIABLES
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const checkboxGrid = document.getElementById('grid');
const rangeGridWidth = document.getElementById('gridWidth');
const settingsIcon = document.getElementById('settings-icon');
const settingsItems = document.getElementById('settings-items');
const livesContainer = document.getElementById('lives');
const timeContainer = document.getElementById('time-played');
const recordContainer = document.getElementById('current-record');
const botones = {
    'Arriba' : document.getElementById('up'),
    'Abajo' : document.getElementById('down'),
    'Izquierda' : document.getElementById('left'),
    'Derecha' : document.getElementById('right'),
};

let intervalo = 0;
let timeStart = 30000;
let timePlayed = 0;
let startPosition = true;
const playerPosition = {
        x : 0,
        y : 0,
        xIndex : null,
        yIndex : null
};
const positions = {};
let level = 0;
const bombPositions = []
let giftPosition = {}
let lives = 3;

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
    detectarColision();
    print();
    drawCanvas();
    drawGrid();
    setPositions();
    drawElement(level);
    drawPlayer();
    if (lives == 0){
        loseGame();
    }
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

function drawRestart(background,text){
    context.fillStyle='indigo';
    context.fillRect(positions[2],positions[2],positions[6],positions[4]);
    context.font = `${positions[1]}px sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'center';
    context.fillText(emojis['GAME_OVER'], positions[5], positions[2]*1.1);
    context.fillStyle='#F1AE1B';
    context.font = `${positions[1]}px sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillText('PERDISTE', positions[5], positions[3]*1.1);
    //Cuadro texto reintentar
    context.fillStyle=`${background}`;
    context.fillRect(positions[3],positions[4]*1.1,positions[4],positions[1]*0.6);
    //Texto Reintentar
    context.fillStyle=`${text}`;
    context.font = `${positions[1]*0.3}px sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillText('REINTENTAR', positions[5], positions[4]*1.14);
    //Borde reintentar
    context.strokeStyle=`#F1AE1B`;
    context.strokeRect(positions[3],positions[4]*1.1,positions[4],positions[1]*0.6);
}

//FUNCIONES DE MOVIMIENTO Y POSICION
function detectarColision(){
    let collision = false;
    if(playerPosition.xIndex === giftPosition.xIndex && playerPosition.yIndex === giftPosition.yIndex){
        winLevel();
    }else{
        bombPositions.forEach(bomb => {
            if(bomb.xIndex === playerPosition.xIndex && bomb.yIndex === playerPosition.yIndex){
                collision = true;
                loseLevel();
            }
        });
    }
    return collision;
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
    if(direccion && lives > 0){
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
        drawGame();
    };
};

//FUNCIONES DE IMPRESION EN DOM

function print(){
    livesContainer.innerHTML = '💖'.repeat(lives);
}

//FUNCIONES DE MECANICAS

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
    if(lives > 0){
        bombPositions.splice(0, bombPositions.length);
        startPosition = true;
        lives--;
    }
}

function winGame(){
    const record = localStorage.getItem('record');
    clearInterval(intervalo);
    if(record){
        if(timePlayed < record){
            localStorage.setItem('record', timePlayed);
            console.log('Record Superado.');
        }
    }else{
        console.log('Record Superado.');
    }
}

function loseGame(){
    const restartButon = {
        startX: positions[3],
        startY: positions[4]*1.1,
        endX: positions[3] + positions[4],
        endY: positions[4]*1.1 + positions[1]*0.6
    }
    clearInterval(intervalo);
    restartGame(restartButon);
}

function restartGame(restartButon){
    drawRestart('#F1AE1B','indigo');
    canvas.addEventListener('click', event => {
        const clickX = event.clientX - canvas.getBoundingClientRect().x;
        const clickY = event.clientY- canvas.getBoundingClientRect().y;
        if(
            clickX >= restartButon.startX &&
            clickX <= restartButon.endX &&
            clickY >= restartButon.startY &&
            clickY <= restartButon.endY
        ){  
            if(lives <= 0){
                startPosition = true;
                level = 0;
                lives = 3;
                startGame();
                canvas.style.cursor = 'default';
            }
        }
    });
    canvas.addEventListener('mousemove', event => {
        const clickX = event.clientX - canvas.getBoundingClientRect().x;
        const clickY = event.clientY- canvas.getBoundingClientRect().y;
        if(lives <= 0){
            if(
                clickX >= restartButon.startX &&
                clickX <= restartButon.endX &&
                clickY >= restartButon.startY &&
                clickY <= restartButon.endY
            ){
                drawRestart('indigo','#F1AE1B');
                canvas.style.cursor = 'pointer';
            }else{
                drawRestart('#F1AE1B','indigo');
                canvas.style.cursor = 'default'
            }
        }
    });
}

function startGame() {
    setListener();
    drawGame();
    timeStart = Date.now();
    intervalo = setInterval(function(){
        timePlayed = Date.now() - timeStart;
        timeContainer.innerText = `${timePlayed/1000}`;
    })
    const record = localStorage.getItem('record');
    if(record){
        recordContainer.innerText = record;
    }
};

window.addEventListener('load', startGame);

let bombCount = 0;