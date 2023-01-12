const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const checkboxGrid = document.getElementById('grid');
const rangeGridWidth = document.getElementById('gridWidth');

window.addEventListener('resize', draw);
checkboxGrid.addEventListener('click', draw);
rangeGridWidth.addEventListener('input', draw);
window.addEventListener('load', startGame);

function drawCanvas(){
    let size = 800;

    if(window.innerWidth < 900 || window.innerHeight < 900){
        size = window.innerWidth - 100;
        if(window.innerHeight < (size + 100)){
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
    const columnas = maps[index].match(/[XIO\-]+/g);
    return columnas.map(columna=> columna.split(''));
}

function drawElement(){
    const size = canvas.width / 10;
    const map = getMap(0);
    context.font=`${size * 0.75}px sans-serif`;
    context.textAlign='left';
    context.textBaseline='top';

    for(let x = 0; x < 10; x++){
        for(let y = 0; y < 10; y++){
            context.fillText(emojis[map[y][x]], x * size, y * size);
        }
    }
};

function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvas();
    drawGrid();
    drawElement();
};

function startGame() {
    draw();

};

