// data imports
// d_svm & l_svm attributes
// avg_imgs
// x_knn, y_knn
// avg_prewitts

function resizeBoardImage(imgPath){
    // accept image file
    // resize to 640, 640
}

function grayscale(board){
    // accept board RGBA array
    // get each grayboard pixel: 0.299 ∙ Red + 0.587 ∙ Green + 0.114 ∙ Blue
}

function crop(source, value){
    // accept grayscale square
    // exclude value*total on each side of square
}

function getSquares(board){
    // accept grayscale board
    // get square width and height (total/8)
    // put each square into 8x8 array
}

function prewitt(square){
    // accept grayscale square
    // initialize prewitt kernels
    // initialize gradient image (zeroes)
    // iterate over pixels (skip square edge pixels)
    // apply both filters to each pixel to get magnitude
    // insert each magnitude to corresponding location in gradient image
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
    
    // get grayscale board
    // get prewitt of grayscale board
    // get squares of prewitt and grayscale boards
    // flag gray board
    // iterate over squares; determine empty/color/type
}

// input
var btn = document.getElementById("btn");
btn.addEventListener("click", function(){
    input = document.getElementById("board");
    console.log(input.files[0]);
    img.src = URL.createObjectURL(input.files[0]);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const scannedImage = context.getImageData(0, 0, canvas.width, canvas.height);
    console.log(scannedImage);
});

//
const canvas = document.getElementById("canvas1");
const context = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 640;
const img = new Image();
// img.src = "testchessboard.png";
img.addEventListener("load", function(){
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const scannedImage = context.getImageData(0, 0, canvas.width, canvas.height);
});

// TODO:
// from canvas scannedImage, retrieve rgb array
