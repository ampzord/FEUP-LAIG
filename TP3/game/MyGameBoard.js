function MyGameBoard(scene){
	CGFobject.call(this,scene);
  this.scene = scene;

  this.prologBoard = "placeholder";
  this.boardString;
  this.boardString2;
  this.currentPlayer = 1;
  
  this.board = "placeholder";
  this.getPrologRequest("generalBoard");

  this.winner = null;

}

MyGameBoard.prototype = Object.create(CGFobject.prototype);
MyGameBoard.prototype.constructor = MyGameBoard;

MyGameBoard.prototype.getPrologRequest = function(requestString, onSuccess, onError, port)
{
  var game = this;
  var requestPort = port || 8081;
  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

  request.onload = onSuccess || function(data){
    var response = data.target.response;
    
    //ask for initial board
    if(requestString == "generalBoard") {
      game.prologBoard = response;
      game.parseBoard(game.prologBoard);
    }

    //valid play
    if (requestString.substring(0,14) == "checkValidPlay" && response == "1") {
      console.log('entrei na valid play bota jgr');
    }

    //not valid play
    if (requestString.substring(0,14) == "checkValidPlay" && response == "0") {
      console.log('nao pode comer');
    }

    if(requestString.substring(0,16) == "movePieceInitial") {
      //

      game.parseBoard(game.prologBoard);
    }

    if(requestString.substring(0,9) == "movePiece") {
      //



      game.parseBoard(game.prologBoard);
    }

    if(requestString.substring(0,8) == "gameOver" && response == "0") {
      //
    }

    if(requestString.substring(0,8) == "gameOver" && response == "1") {
      //
    }


  }
    
  request.onerror = onError || function(){console.log("Error waiting for response");};

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();
};

MyGameBoard.prototype.getInitialBoard = function() {
  this.getPrologRequest("generalBoard");
}

//checkValidPlay(Board,Player,ColumnOrigin,LineOrigin,ColumnDest,LineDest)
MyGameBoard.prototype.checkValidPlay = function(ColumnOrigin,LineOrigin,ColumnDest,LineDest) {
  var requestString = 'checkValidPlay(' + this.prologBoard + ',' + this.currentPlayer + ',' + ColumnOrigin + ','
  + LineOrigin + ',' + ColumnDest + ',' + LineDest + ')'; 
  this.getPrologRequest(requestString);
}

//movePiece(RetBoard,ColumnDest,LineDest,PieceOrigin,RetRetBoard)
MyGameBoard.prototype.movePiece = function(ColumnDest,LineDest,PieceOrigin,RetRetBoard) {
  var auxprologBoard;
  var requestString = 'movePiece(' + this.prologBoard + ',' + ColumnDest + ',' + LineDest + ','
  + PieceOrigin + ',' + auxprologBoard + ')'; 
  this.prologBoard = auxprologBoard;
  this.getPrologRequest(requestString);
}

//limpar espaco onde estava a peca antes
//movePiece(Board, ColumnOrigin, LineOrigin,' ', RetBoard).
MyGameBoard.prototype.clearInitialPosition = function(ColumnOrigin, LineOrigin) {
  var auxprologBoard;
  var requestString = 'movePieceInitial(' + this.prologBoard + ',' + ColumnOrigin + ',' + LineOrigin + ',' + ' ' + ',' +
  auxprologBoard + ')'; 
  this.prologBoard = auxprologBoard;
  this.getPrologRequest(requestString);
}



//gameOver(Board,Winner)
MyGameBoard.prototype.checkEndGame = function() {
  var requestString = 'gameOver(' + this.prologBoard + ',' + this.winner + ')';
  this.getPrologRequest(requestString);
}

MyGameBoard.prototype.parseBoard = function(plBoard){
  console.log('Board do prolog :' + plBoard);

  function replaceStr(str, find, replace) {
    for (var i = 0; i < find.length; i++) {
        str = str.replace(new RegExp(find[i], 'g'), replace[i]);
    }
    return str;
  }
  
  var find = ["H","T","Q","B","h","t","q","b"];
  var replace = ["'H'","'T'","'Q'","'B'","'h'","'t'","'q'","'b'"];
  this.prologBoard = replaceStr(plBoard, find, replace);

  console.log('After parsing prolog Board :' + this.prologBoard);
}



