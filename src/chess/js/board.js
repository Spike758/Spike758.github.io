(function(){
  const { coordsToSquare } = globalThis.ChessUtils;
  const { Pawn, Rook, Knight, Bishop, Queen, King } = globalThis.ChessPieces;

  class Board{
    constructor(){
      this.map = {};
      this.reset();
    }

    reset(){
      this.map = {};
      this.placeInitial();
    }

    getPiece(square){
      return this.map[square] || null;
    }

    setPiece(square, piece){
      if(!square) return;
      if(piece){
        piece.position = square;
        this.map[square] = piece;
      } else {
        delete this.map[square];
      }
    }

    movePiece(from, to){
      const piece = this.getPiece(from);
      if(!piece) return { moved:false, captured:null };
      const captured = this.getPiece(to);
      if(captured) this.setPiece(to, null);
      this.setPiece(from, null);
      this.setPiece(to, piece);

      if(piece.type === 'pawn'){
        const rank = Number(to.slice(1));
        if(piece.color === 'white' && rank === 8) this.setPiece(to, new Queen('white', to));
        if(piece.color === 'black' && rank === 1) this.setPiece(to, new Queen('black', to));
      }

      return { moved:true, captured };
    }

    allSquares(){
      const squares = [];
      for(let y=0; y<8; y++){
        for(let x=0; x<8; x++){
          squares.push(coordsToSquare(x,y));
        }
      }
      return squares;
    }

    placeInitial(){
      const back = ['rook','knight','bishop','queen','king','bishop','knight','rook'];

      for(let x=0; x<8; x++){
        const file = 'abcdefgh'[x];
        this.setPiece(`${file}2`, new Pawn('white', `${file}2`));
        this.setPiece(`${file}7`, new Pawn('black', `${file}7`));
      }

      for(let x=0; x<8; x++){
        const file = 'abcdefgh'[x];
        const type = back[x];

        const wSq = `${file}1`;
        const bSq = `${file}8`;

        this.setPiece(wSq, this.createPiece(type, 'white', wSq));
        this.setPiece(bSq, this.createPiece(type, 'black', bSq));
      }
    }

    createPiece(type, color, square){
      if(type === 'rook') return new Rook(color, square);
      if(type === 'knight') return new Knight(color, square);
      if(type === 'bishop') return new Bishop(color, square);
      if(type === 'queen') return new Queen(color, square);
      if(type === 'king') return new King(color, square);
      return null;
    }
  }

  globalThis.ChessBoard = { Board };
})();
