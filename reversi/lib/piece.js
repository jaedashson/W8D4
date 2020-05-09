/**
 * Initializes the Piece with its color.
 */
function Piece (color) { // Constructor function

  // conditional to restrict color choice to b/w?
  this.color = color;
};

/**
 * Returns the color opposite the current piece.
 */
Piece.prototype.oppColor = function () {
  if (this.color === "white") {
    return "black";
  } else if (this.color === "black") {
    return "white";
  }
};

/**
 * Changes the piece's color to the opposite color.
 */
Piece.prototype.flip = function () {
  this.color = this.oppColor();
};

/**
 * Returns a string representation of the string
 * based on its color.
 */
Piece.prototype.toString = function () { // Why is this necessary
  return ((this.color === "black") ? 'B' : 'W');
  //should the .color return the "white"/"black" in Constructor
};

// piece.color; => "white" ???
module.exports = Piece; // Inverse of require_relative?
