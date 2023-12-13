
//change value range; training data follows .tiff file pixel range
function tiffify(value){
    return (((value - 0) * (4.155 - (-0.078))) / (1 - 0)) + -0.078;
}

function grayscale(board){
    // accept board RGBA array
    // get each grayboard pixel: 0.299 ∙ Red + 0.587 ∙ Green + 0.114 ∙ Blue
    grayBoard = [];
    for(let i=0; i<640; i++){
        grayBoardRow = []
        for(let j=0; j<640; j++){
            let r = board[i][j][0];
            let g = board[i][j][1];
            let b = board[i][j][2];
            grayPixel = 0.299*r + 0.587*g + 0.114*b;
            grayBoardRow.push(tiffify(grayPixel));
        }
        grayBoard.push(grayBoardRow);
    }

    return grayBoard;
}

function crop(source){
    // accept grayscale or prewitt square
    // let square = board.slice(x1, x2).map(i => i.slice(y1, y2));
    return source.slice(10,70).map(i => i.slice(10,70));
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
            squaresRow.push(crop(square));
        }
        squares.push(squaresRow);
    }
    
    return squares;
}

function prewitt(board){
    // accept grayscale board
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
            let hValue =(hFilter[0][0]*board[i-1][j-1])+
                        (hFilter[0][1]*board[i-1][j])+
                        (hFilter[0][2]*board[i-1][j+1])+
                        (hFilter[1][0]*board[i][j-1])+
                        (hFilter[1][1]*board[i][j])+
                        (hFilter[1][2]*board[i][j+1])+
                        (hFilter[2][0]*board[i+1][j-1])+
                        (hFilter[2][1]*board[i+1][j])+
                        (hFilter[2][2]*board[i+1][j+1]);

            let vValue =(vFilter[0][0]*board[i-1][j-1])+
                        (vFilter[0][1]*board[i-1][j])+
                        (vFilter[0][2]*board[i-1][j+1])+
                        (vFilter[1][0]*board[i][j-1])+
                        (vFilter[1][1]*board[i][j])+
                        (vFilter[1][2]*board[i][j+1])+
                        (vFilter[2][0]*board[i+1][j-1])+
                        (vFilter[2][1]*board[i+1][j])+
                        (vFilter[2][2]*board[i+1][j+1]);
            
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
    square.forEach(function(row){
        row.forEach(function(value){
            value += 1e-16;
        });
    });

    var ratioCheck = 1.5;

    // horizontal pass
    let filledH = 0;
    for(let i=0; i<60; i++){
        let target = 0;
        let ratio = 0;
        let stopCount = 0;
        

        //right->left
        for(let j=0; j<59; j++){
            ratio = square[i][j+1]/square[i][j] //right:left pixel
            if(ratio > ratioCheck){
                target += 1;
                stopCount = j+1;
                break;
            }
        }

        //left->right
        ratio = 0;
        for(let j=0; j<59-stopCount; j++){
            ratio = square[i][58-j]/square[i][59-j] //left:right pixel
            if(ratio > ratioCheck){
                target += 1;
                break;
            }
        }

        //match?
        if(target == 2) filledH += 1;
    }

    // vertical pass
    let filledV = 0;
    for(let i=0; i<60; i++){
        let target = 0;
        let ratio = 0;
        let stopCount = 0;

        //up->down
        for(let j=0; j<59; j++){
            ratio = square[j+1][i]/square[j][i] //right:left pixel
            if(ratio > ratioCheck){
                target += 1;
                stopCount = j+1;
                break;
            }
        }

        //down->up
        ratio = 0;
        for(let j=0; j<59-stopCount; j++){
            ratio = square[58-j][i]/square[59-j][i] //left:right pixel
            if(ratio > ratioCheck){
                target += 1;
                break;
            }
        }

        //match?
        if(target == 2) filledV += 1;
    }

    //treshold
    // console.log(filledH, filledV);
    return ((filledH/60) > 0.6) && ((filledV/60) > 0.3);
}

function flagSquares(prewittSquares){
    //accept prewittSquares
    flags = [];

    // iterate over squares apply isOccupied
    prewittSquares.forEach(function(row){
        flagsRow = [];
        row.forEach(function(square){
            // 1: occupied; 0: empty
            if(isOccupied(square)) flagsRow.push(1);
            else flagsRow.push(0);
        });
        flags.push(flagsRow);
    });
    
    return flags;
}

function featureVector(array){
    //accept square with size 60x60 pixels
    fvector = [];
    for(let i=0; i<60; i++){
        for(let j=0; j<60; j++){
            fvector.push(array[i][j]);
        }
    }

    return fvector;
}

function euclideanDistance(v1, v2){
    squaredDifferences = 0;
    if(v1.length!=v2.length)
        console.log(`Distance Error: v1:${v1.length}->v2:${v2.length}`);
    else{
        for(let i=0; i<v1.length; i++)
            squaredDifferences += (v1[i] - v2[i])**2;
    }
    return squaredDifferences;
}

class SVM{
    constructor(weights, bias, learning_rate, reg){
        this.weights = weights;
        this.bias = bias;
        this.learning_rate = learning_rate;
        this.reg = reg;
    }

    predict(X){
        approx = X[0]*weights[0] +  X[1]*weights[1] - bias;
        if(approx<0) return -1;
        else return 1;
    }
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
    // console.log(scannedImage["data"]);
    let board = getRGB(scannedImage["data"]);
    // console.log(board);
    
    // get grayscale board
    let grayBoard = grayscale(board);
    // console.log(grayBoard);
    // save_func(grayBoard);

    // get prewitt of grayscale board
    let prewittBoard = prewitt(grayBoard);
    // console.log(prewittBoard);
    // save_func(prewittBoard);

    // get squares of prewitt and grayscale boards
    let graySquares = getSquares(grayBoard);
    let prewittSquares = getSquares(prewittBoard);
    // console.log(prewittSquares);
    // save_func(prewittSquares[0][0]);

    // flag prewitt squares
    let flaggedSquares = flagSquares(prewittSquares);
    console.log(flaggedSquares);

    let pieceTypes = [["p", "r", "n", "b", "k", "q"], ["P", "R", "N", "B", "K", "Q"]];
    let result =[];

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
    // console.log(scannedImage["data"]);
}
function failed() {
    console.error("Image loading failed.");
}

function getRGB(data){
    var rgbFlat = [];
    var rgb = []

    //turn into flat rgb
    for(let i=0; i<640*640*4; i+=4){
        rgbFlat.push([data[i]/255, data[i+1]/255, data[i+2]/255]);
    }
    //turn into 2D
    for(let i=0; i<640; i++){
        rgb.push(rgbFlat.slice(640*i, 640*(i+1)));
    }

    return rgb;
}

// export img array for testing
function save_func(grayBoard){
    let data_str = "";
    grayBoard.forEach(function(row){
        row.forEach(function(pixel){
            data_str += pixel.toString() + " ";
        });
        data_str += "\n";
    });
    console.log(data_str);
}

// data imports
// d_svm & l_svm attributes

// avg_imgs
// x_knn, y_knn
// avg_prewitts