(function(){
  const { squareToCoords, coordsToSquare, inBounds } = globalThis.ChessUtils;

  const UNICODE = {
    white: { king:'♔', queen:'♕', rook:'♖', bishop:'♗', knight:'♘', pawn:'♙' },
    black: { king:'♚', queen:'♛', rook:'♜', bishop:'♝', knight:'♞', pawn:'♟' },
  };

  function rayMoves(board, from, color, directions){
    const c = squareToCoords(from);
    if(!c) return [];
    const moves = [];
    for(const [dx,dy] of directions){
      let x = c.x + dx;
      let y = c.y + dy;
      while(inBounds(x,y)){
        const sq = coordsToSquare(x,y);
        const p = board.getPiece(sq);
        if(!p){
          moves.push(sq);
        } else {
          if(p.color !== color) moves.push(sq);
          break;
        }
        x += dx;
        y += dy;
      }
    }
    return moves;
  }

  class Piece{
    constructor(color, position){
      this.color = color;
      this.position = position;
      this.type = 'piece';
    }

    symbol(){
      return UNICODE[this.color]?.[this.type] || '';
    }

    getValidMoves(){
      return [];
    }
  }

  class Pawn extends Piece{
    constructor(color, position){
      super(color, position);
      this.type = 'pawn';
    }

    getValidMoves(board){
      const c = squareToCoords(this.position);
      if(!c) return [];
      const dir = this.color === 'white' ? 1 : -1;
      const startRank = this.color === 'white' ? 2 : 7;
      const moves = [];

      const one = coordsToSquare(c.x, c.y + dir);
      if(one && !board.getPiece(one)){
        moves.push(one);
        const two = coordsToSquare(c.x, c.y + 2*dir);
        if((c.y + 1) === (startRank - 1) && two && !board.getPiece(two)) moves.push(two);
      }

      const capL = coordsToSquare(c.x - 1, c.y + dir);
      const capR = coordsToSquare(c.x + 1, c.y + dir);
      for(const sq of [capL, capR]){
        if(!sq) continue;
        const p = board.getPiece(sq);
        if(p && p.color !== this.color) moves.push(sq);
      }

      return moves;
    }
  }

  class Rook extends Piece{
    constructor(color, position){
      super(color, position);
      this.type = 'rook';
    }

    getValidMoves(board){
      return rayMoves(board, this.position, this.color, [[1,0],[-1,0],[0,1],[0,-1]]);
    }
  }

  class Bishop extends Piece{
    constructor(color, position){
      super(color, position);
      this.type = 'bishop';
    }

    getValidMoves(board){
      return rayMoves(board, this.position, this.color, [[1,1],[1,-1],[-1,1],[-1,-1]]);
    }
  }

  class Queen extends Piece{
    constructor(color, position){
      super(color, position);
      this.type = 'queen';
    }

    getValidMoves(board){
      return rayMoves(board, this.position, this.color, [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
    }
  }

  class Knight extends Piece{
    constructor(color, position){
      super(color, position);
      this.type = 'knight';
    }

    getValidMoves(board){
      const c = squareToCoords(this.position);
      if(!c) return [];
      const moves = [];
      const deltas = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
      for(const [dx,dy] of deltas){
        const sq = coordsToSquare(c.x + dx, c.y + dy);
        if(!sq) continue;
        const p = board.getPiece(sq);
        if(!p || p.color !== this.color) moves.push(sq);
      }
      return moves;
    }
  }

  class King extends Piece{
    constructor(color, position){
      super(color, position);
      this.type = 'king';
    }

    getValidMoves(board){
      const c = squareToCoords(this.position);
      if(!c) return [];
      const moves = [];
      for(let dx=-1; dx<=1; dx++){
        for(let dy=-1; dy<=1; dy++){
          if(dx===0 && dy===0) continue;
          const sq = coordsToSquare(c.x + dx, c.y + dy);
          if(!sq) continue;
          const p = board.getPiece(sq);
          if(!p || p.color !== this.color) moves.push(sq);
        }
      }
      return moves;
    }
  }

  globalThis.ChessPieces = { Piece, Pawn, Rook, Knight, Bishop, Queen, King, UNICODE };
})();
