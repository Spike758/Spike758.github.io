(function(){
  const { FILES, squareToCoords, coordsToSquare, oppositeColor } = globalThis.ChessUtils;
  const { Board } = globalThis.ChessBoard;

  function $(sel){
    return document.querySelector(sel);
  }

  class Game{
    constructor(){
      this.board = new Board();
      this.turn = 'white';
      this.selected = null;
      this.validMoves = [];
      this.isGameOver = false;
      this.gridEl = $('#chessGrid');
      this.turnLabelEl = $('#turnLabel');
      this.hintEl = $('#hint');

      this.renderGrid();
      this.renderPieces();
      this.updateTurnLabel();
      this.bind();
    }

    bind(){
      $('#newGame').addEventListener('click', () => this.newGame());

      document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a.js-anchor');
        if(!anchor) return;
        const href = anchor.getAttribute('href') || '';
        if(!href.startsWith('#')) return;
        const target = document.querySelector(href);
        if(!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior:'smooth', block:'start' });
      });

      this.gridEl.addEventListener('click', (e) => {
        const btn = e.target.closest('button.chess-square');
        if(!btn) return;
        const square = btn.dataset.square;
        this.onSquareClick(square);
      });
    }

    newGame(){
      this.board.reset();
      this.turn = 'white';
      this.isGameOver = false;
      this.clearSelection();
      this.renderPieces();
      this.updateTurnLabel();
      this.setHint('Новая партия началась.');
    }

    setHint(text){
      this.hintEl.textContent = text || '';
    }

    updateTurnLabel(){
      if(this.isGameOver) return;
      this.turnLabelEl.textContent = this.turn === 'white' ? 'Ход белых' : 'Ход черных';
    }

    declareWinner(color){
      this.isGameOver = true;
      this.clearSelection();
      this.turnLabelEl.textContent = color === 'white' ? 'Победа белых' : 'Победа черных';
      this.setHint('Игра окончена. Нажмите «Новая игра» для перезапуска.');
    }

    renderGrid(){
      this.gridEl.innerHTML = '';

      const corner = document.createElement('div');
      corner.className = 'chess-label chess-corner';
      this.gridEl.appendChild(corner);

      for(let x=0; x<8; x++){
        const el = document.createElement('div');
        el.className = 'chess-label';
        el.textContent = FILES[x];
        this.gridEl.appendChild(el);
      }

      for(let y=7; y>=0; y--){
        const rankLabel = document.createElement('div');
        rankLabel.className = 'chess-label';
        rankLabel.textContent = String(y+1);
        this.gridEl.appendChild(rankLabel);

        for(let x=0; x<8; x++){
          const sq = coordsToSquare(x,y);
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'chess-square' + (((x + y) % 2) ? ' is-dark' : '');
          btn.dataset.square = sq;
          btn.setAttribute('role','gridcell');
          btn.setAttribute('aria-label', sq);
          this.gridEl.appendChild(btn);
        }
      }
    }

    renderPieces(){
      const squares = this.gridEl.querySelectorAll('button.chess-square');
      squares.forEach((btn) => {
        const sq = btn.dataset.square;
        const piece = this.board.getPiece(sq);
        btn.textContent = '';
        btn.classList.remove('is-selected','is-move','is-capture');

        if(piece){
          const span = document.createElement('span');
          span.className = 'chess-piece ' + (piece.color === 'white' ? 'is-white' : 'is-black');
          span.textContent = piece.symbol();
          btn.appendChild(span);
        }
      });
    }

    clearHighlights(){
      this.gridEl.querySelectorAll('.chess-square.is-move,.chess-square.is-capture').forEach((n) => {
        n.classList.remove('is-move','is-capture');
      });
    }

    clearSelection(){
      this.selected = null;
      this.validMoves = [];
      const selected = this.gridEl.querySelector('.chess-square.is-selected');
      if(selected) selected.classList.remove('is-selected');
      this.clearHighlights();
    }

    highlightMoves(from, moves){
      this.clearHighlights();
      for(const sq of moves){
        const btn = this.gridEl.querySelector(`button.chess-square[data-square="${sq}"]`);
        if(!btn) continue;
        const targetPiece = this.board.getPiece(sq);
        btn.classList.add(targetPiece ? 'is-capture' : 'is-move');
      }

      const fromBtn = this.gridEl.querySelector(`button.chess-square[data-square="${from}"]`);
      if(fromBtn) fromBtn.classList.add('is-selected');
    }

    isMoveAllowed(to){
      return this.validMoves.includes(to);
    }

    select(square){
      const piece = this.board.getPiece(square);
      if(!piece) return false;
      if(piece.color !== this.turn) return false;

      this.clearSelection();
      this.selected = square;
      this.validMoves = piece.getValidMoves(this.board);
      this.highlightMoves(square, this.validMoves);
      this.setHint(`${piece.color === 'white' ? 'Белая' : 'Черная'} фигура: ${square}`);
      return true;
    }

    onSquareClick(square){
      if(this.isGameOver){
        this.setHint('Игра окончена. Нажмите «Новая игра».');
        return;
      }
      const clickedPiece = this.board.getPiece(square);

      if(!this.selected){
        if(clickedPiece && clickedPiece.color === this.turn){
          this.select(square);
        } else {
          this.setHint('Выберите фигуру своего цвета.');
        }
        return;
      }

      if(square === this.selected){
        this.clearSelection();
        this.setHint('');
        return;
      }

      if(this.isMoveAllowed(square)){
        const from = this.selected;
        const result = this.board.movePiece(from, square);
        this.clearSelection();
        this.renderPieces();

        if(result.captured && result.captured.type === 'king'){
          this.declareWinner(this.turn);
          return;
        }

        this.turn = oppositeColor(this.turn);
        this.updateTurnLabel();

        const cap = result.captured ? ' (взятие)' : '';
        this.setHint(`Ход: ${from} → ${square}${cap}`);
        return;
      }

      if(clickedPiece && clickedPiece.color === this.turn){
        this.select(square);
        return;
      }

      this.clearSelection();
      this.setHint('Недопустимый ход.');
    }
  }

  function boot(){
    new Game();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
