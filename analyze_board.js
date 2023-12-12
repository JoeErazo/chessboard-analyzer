// data imports
// d_svm & l_svm attributes
// avg_imgs
// x_knn, y_knn
// avg_prewitts

function grayscale(board){
    // accept board RGBA array
    // get each grayboard pixel: 0.299 ∙ Red + 0.587 ∙ Green + 0.114 ∙ Blue
    grayBoard = [];
    for(let i=0; i<board.length; i++){
        grayBoardRow = []
        for(let j=0; j<board.length; j++){
            let r = board[i][j][0];
            let g = board[i][j][1];
            let b = board[i][j][2];
            grayPixel = 0.299*r + 0.587*g + 0.114*b;
            grayBoardRow.push(grayPixel);
        }
        grayBoard.push(grayBoardRow);
    }
    return grayBoard;
}

function crop(source, value){
    // accept grayscale square
    // exclude value*total on each side of square
}

function getSquares(board){
    // accept grayscale or prewitt board
    // board size 640x640 -> square size 80x80
    squares = [];

    // put each square into 8x8 array
    for(let i=0; i<8; i++){
        squaresRow = [];
        for(let j=0; j<8; j++){
            let x1 = i*80
            let x2 = (i+1)*80
            let y1 = j*80
            let y2 = (j+1)*80
            let square = board.slice(x1, x2).map(i => i.slice(y1, y2));
            squaresRow.push(square);
        }
        squares.push(squaresRow);
    }
    
    return squares;
}

function prewitt(square){
    // accept grayscale square
    // initialize prewitt kernels
    hFilter =  [[-1,  0,  1],
                [-1,  0,  1],
                [-1,  0,  1]];
    vFilter =  [[-1, -1, -1],
                [ 0,  0,  1],
                [ 1,  1,  1]];

    // initialize gradient image (zeroes)
    gradientImage = [];
    for(let i=0; i<640; i++){
        gradientImageRow = [];
        for(let j=0; j<640; j++){
            gradientImageRow.push(0);
        }
        gradientImage.push(gradientImageRow);
    }

    // iterate over pixels (skip square edge pixels)
    for(let i=1; i<639; i++){
        for(let j=1; j<639; j++){
            // apply both filters to each pixel to get magnitude
            let hValue =(hFilter[0][0]*square[i-1][j-1])+
                        (hFilter[0][1]*square[i-1][j])+
                        (hFilter[0][2]*square[i-1][j+1])+
                        (hFilter[1][0]*square[i][j-1])+
                        (hFilter[1][1]*square[i][j])+
                        (hFilter[1][2]*square[i][j+1])+
                        (hFilter[2][0]*square[i+1][j-1])+
                        (hFilter[2][1]*square[i+1][j])+
                        (hFilter[2][2]*square[i+1][j+1]);

            let vValue =(vFilter[0][0]*square[i-1][j-1])+
                        (vFilter[0][1]*square[i-1][j])+
                        (vFilter[0][2]*square[i-1][j+1])+
                        (vFilter[1][0]*square[i][j-1])+
                        (vFilter[1][1]*square[i][j])+
                        (vFilter[1][2]*square[i][j+1])+
                        (vFilter[2][0]*square[i+1][j-1])+
                        (vFilter[2][1]*square[i+1][j])+
                        (vFilter[2][2]*square[i+1][j+1]);
            
            let magnitude = Math.sqrt(hValue**2 + vValue**2);
            // insert each magnitude to corresponding location in gradient image
            gradientImage[i-1][j-1] = magnitude
        }
    }
    return gradientImage;
}

function isOccupied(square){
    // accept prewitt square
    // add small value to avoid dividing by zero
    // horizontal pass to find opposing edges
    // vertical pass to find vertical edges
    // ratio matching rows / total rows > 0.6
    // ratio matching cols / total cols > 0.3
}

function flagSquares(squares){
    // iterate over squares apply isOccupied
    // 1: occupied; 0: empty
}

function featureVector(array){

}

function euclideanDistance(v1, v2){
    
}

class SVM{

}

class KNN{

}

function getColorDataPoint(square, squareType){
    // discern dark or light square
    // get euclidean distance to white and black avg
}

function getPtypeDataPoint(square){
    // get euclidean distances for each avg_prewitt
    // return distances [p, r, n, b, k, q]
}

function identifyPieces(){
    // get board
    board = getRGB(scannedImage["data"]);
    // console.log(board);
    
    // get grayscale board
    grayBoard = grayscale(board);
    // console.log(grayBoard);

    // get prewitt of grayscale board
    prewittBoard = prewitt(grayBoard);
    // console.log(prewittBoard);

    // get squares of prewitt and grayscale boards
    graySquares = getSquares(grayBoard);
    prewittSquares = getSquares(prewittBoard);
    console.log(graySquares);
    // flag gray board
    // iterate over squares; determine empty/color/type
}

document.getElementById("btn").addEventListener("click", identifyPieces);

// input
var scannedImage;
document.getElementById("board").onchange = function(e){
    var img = new Image();
    img.onload = draw;
    img.onerror = failed;
    img.src = URL.createObjectURL(this.files[0]);
};
function draw(){
    var canvas = document.getElementById('canvas1');
    canvas.width = 640; //resize board image
    canvas.height = 640;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this, 0,0);
    scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(scannedImage["data"]);
}
function failed() {
    console.error("Image loading failed.");
}

function getRGB(scannedImage){
    var rgb = [];
    for(let i=0; i<640; i++){
        let pixelRow = [];
        for(let j=0; j<640; j++){
            let pixel = [];
            for(let k=0; k<3; k++){
                pixel.push(scannedImage[i*640+j*640+k]);
            }
            pixelRow.push(pixel);
        }
        rgb.push(pixelRow);
    }
    return rgb;
}