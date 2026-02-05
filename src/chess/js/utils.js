(function(){
  const FILES = ['a','b','c','d','e','f','g','h'];

  function inBounds(x,y){
    return x>=0 && x<8 && y>=0 && y<8;
  }

  function coordsToSquare(x,y){
    if(!inBounds(x,y)) return null;
    return `${FILES[x]}${y+1}`;
  }

  function squareToCoords(square){
    if(typeof square !== 'string' || square.length < 2) return null;
    const file = square[0].toLowerCase();
    const rank = Number(square.slice(1));
    const x = FILES.indexOf(file);
    const y = rank - 1;
    if(!inBounds(x,y)) return null;
    return {x,y};
  }

  function oppositeColor(color){
    return color === 'white' ? 'black' : 'white';
  }

  globalThis.ChessUtils = { FILES, inBounds, coordsToSquare, squareToCoords, oppositeColor };
})();
