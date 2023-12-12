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
    board = getRGB(scannedImage["data"]);
    // console.log(board);

    // get grayscale board
    // get prewitt of grayscale board
    // get squares of prewitt and grayscale boards
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
    canvas.width = 640;
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