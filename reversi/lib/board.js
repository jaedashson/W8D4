let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = [];

  for (let i = 0; i < 8; i++) { // loop 8 times (0...8).each do |i|
    grid.push(new Array(8));
  }      // add an 8 element array representing on row

  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");

  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], // right
  [ 1,  1], // down-right
  [ 1,  0], // down
  [ 1, -1], // down-left
  [ 0, -1], // left
  [-1, -1], // up-left
  [-1,  0], // up
  [-1,  1] // up-right
];

Board.COLORS = ["black", "white"]; // Depends on which property of Piece we're checking

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) { // is pos a [row, column] array?
  let y = pos[0];
  let x = pos[1];

  if (isBetween(x, 0, 7) && isBetween(y, 0, 7)) {
    return true;
  } 
  return false;
};


function isBetween(n, a, b) {
  return (n - a) * (n - b) <= 0;
}

// arr = 
// [ [a, b, c],
//   [d, e, f],
//   [g, h, i] ]

// a = arr[0][0]
// d = arr[1][0]


/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (this.isValidPos(pos)) {
    let y = pos[0];
    let x = pos[1];
    return this.grid[y][x]; // returns a Piece or undefined?
  } else {
    // throw "You gon Messed Up A-Aron"; // If pos is not on the board
    throw new Error('You gon Messed Up A-Aron');  // generates an error object with the message of Required
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  foundPiece = this.getPiece(pos);
  if (foundPiece) {
    return (foundPiece.color === color);
  } else {
    return false;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  if (this.isValidPos(pos)) {
    let foundPiece = this.getPiece(pos);
    if (foundPiece === undefined) {
      return false; // Position pos was empty
    } else {
      return true; // Position pos was occupied
    }
  } else {
    throw "Not a valid position bro!";
  }
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, posesToFlip){ // What is the format of dir?  [x, y], [row, column], "left"
// What is piecesToFlip
// base cases - sandwitch (found your piece again), empty spot, end or board
// pos is position we place
  if (posesToFlip === undefined) {
    posesToFlip = [];
  }

  nextPos = [ pos[0] + dir[0], pos[1] + dir[1] ];
  
  // BASE CASE:
  // return empty array if nextPos is off the board
  if (!this.isValidPos(nextPos)) {
    return [];
  }
  // BASE CASE: return empty array if nextPos is empty
  if (!this.isOccupied(nextPos)) {
    return [];
  }
  
  // at this point, we know nextPos has a friendly or enemy piece
  let foundPiece = this.getPiece(nextPos);

  if (foundPiece.color === color) {
    return posesToFlip;
  }
  
  posesToFlip.push(nextPos);
  return this._positionsToFlip(nextPos, color, dir, posesToFlip);
  // if ((foundPiece != undefined) && (foundPiece.color != color)) { // nextPos has enemy piece
  //   posesToFlip.push(nextPos);
  //   this._positionsToFlip(nextPos, color, dir, posesToFlip);
  // } else if ((foundPiece != undefined) && (foundPiece.color === color)) {
  //   return posesToFlip;
  // }
  // // return;
  // return [];
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  // make calls to each direction

  if (!this.isValidPos(pos) || this.isOccupied(pos)) {
    return false;
  }

  // Board.DIRS.forEach(dir => this._positionsToFlip(pos, color, dir)); // What is the correct syntax?

  for (let i = 0; i < Board.DIRS.length; i++) {
    let dir = Board.DIRS[i];
    let flipsInDir = this._positionsToFlip(pos, color, dir);

    if (flipsInDir.length > 0) {
      return true;
    }
  }

  // Board.DIRS.forEach(this._positionsToFlip)

  return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)){
    throw new Error("Not In My House!");
  }
  
  let newPiece = new Piece(color);
  // let row, col = pos;
  row = pos[0];
  col = pos[1];
  this.grid[row][col] = newPiece;

  let allToFlip = [];

  // NOT WORKING BEYOND THIS POINT?

  Board.DIRS.forEach(dir => allToFlip.concat(this._positionsToFlip(pos, color, dir)));

  allToFlip.forEach(posToFlip => this.getPiece(posToFlip).flip);
  
  return;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};



module.exports = Board;
