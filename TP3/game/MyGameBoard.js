function MyGameBoard(scene){
	CGFobject.call(this,scene);
  this.scene = scene;

  this.prologBoard = "placeholder";
  this.prologBoardRegex = "placeholder";
  this.boardString;
  this.boardString2;
  this.currentPlayer = 1;

  
  this.board = "placeholder";
  this.getPrologRequest("generalBoard");

  this.winner = null;

  this.initialPiece = null;
  this.destinationPiece = null;

}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
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
/*
    if (requestString.substring(0,15) == "checkValidPlays") {
      console.log(response);
      //game.clearInitialPosition(game.initialPiece.column, game.initialPiece.line);
      //sleep(1000);
    }
*/

    //not valid play
    if (requestString.substring(0,15) == "checkValidPlays" && response == "0") {
      console.log('Cant eat piece, wrong move!');
    }

    //valid play
    if (requestString.substring(0,15) == "checkValidPlays" && response == "1") {
      console.log('Can eat piece');
      //game.clearInitialPosition(game.initialPiece.column, game.initialPiece.line);
      //sleep(1000);

      game.movePiece(game.destinationPiece.column, game.destinationPiece.line, game.initialPiece.column, game.initialPiece.line, game.initialPiece.piece);
    }
/* 
    if(requestString.substring(0,16) == "movePieceInitial") {
      //game.prologBoard = response;
      //game.parseBo
      //console.log('meter peca a branco' + game.prologBoard);
      game.parseBoard(response);
      console.log('after parse do meter preca a branco' + game.prologBoard);
    }*/

    if(requestString.substring(0,9) == "makePlays") {
      game.prologBoard = response;
      console.log('Board do makePlays - ' + response);
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

/*
//checkValidPlay(Board,Player,ColumnOrigin,LineOrigin,ColumnDest,LineDest)
MyGameBoard.prototype.checkValidPlay = function(ColumnOrigin,LineOrigin,ColumnDest,LineDest) {
  var requestString = 'checkValidPlays(' + this.prologBoard + ',' + this.currentPlayer + ',' + ColumnOrigin + ','
  + LineOrigin + ',' + ColumnDest + ',' + LineDest + ')'; 
  this.getPrologRequest(requestString);
}*/

MyGameBoard.prototype.checkValidPlay = function(ColumnOrigin,LineOrigin,ColumnDest,LineDest) {
  var requestString = 'checkValidPlays(' + this.prologBoard + ',' + this.currentPlayer + ',' + ColumnOrigin + ','
  + LineOrigin + ',' + ColumnDest + ',' + LineDest + ')'; 
  this.getPrologRequest(requestString);
}

//movePiece(RetBoard,ColumnDest,LineDest,PieceOrigin,RetRetBoard)
MyGameBoard.prototype.movePiece = function(ColumnDest,LineDest,ColumnOrigin,LineOrigin,PieceOrigin) {
  var requestString = 'makePlays(' + this.prologBoard + ',' + ColumnDest + ',' + LineDest + ',' + ColumnOrigin + ','
   + LineOrigin + ',' + PieceOrigin + ')';
  this.getPrologRequest(requestString);
}

//limpar espaco onde estava a peca antes
//movePiece(Board, ColumnOrigin, LineOrigin,' ', RetBoard).
MyGameBoard.prototype.clearInitialPosition = function(ColumnOrigin, LineOrigin) {
  var requestString = 'movePieceInitial(' + this.prologBoard + ',' + ColumnOrigin + ',' + LineOrigin +  ')'; 
  this.getPrologRequest(requestString);
}


//gameOver(Board,Winner)
MyGameBoard.prototype.checkEndGame = function() {
  var requestString = 'gameOver(' + this.prologBoard + ',' + this.winner + ')';
  this.getPrologRequest(requestString);
}

MyGameBoard.prototype.parseBoard = function(plBoard){
  //console.log('Board do prolog :' + plBoard);

  function replaceStr(str, find, replace) {
    for (var i = 0; i < find.length; i++) {
        str = str.replace(new RegExp(find[i], 'g'), replace[i]);
    }
    return str;
  }
  
  var find = ["H","T","Q","B","h","t","q","b"];
  var replace = ["'H'","'T'","'Q'","'B'","'h'","'t'","'q'","'b'"];
  this.prologBoard = replaceStr(plBoard, find, replace);

  //console.log('After parsing prolog Board :' + this.prologBoard);
}

MyGameBoard.prototype.cycle = function(firstPiece,secondPiece) {
  this.initialPiece = firstPiece;
  this.destinationPiece = secondPiece;

  //console.log(this.initialPiece);
  //console.log(this.destinationPiece);

  if (this.initialPiece != null &&  this.destinationPiece != null) {
    this.checkValidPlay(this.initialPiece.column, this.initialPiece.line, this.destinationPiece.column, this.destinationPiece.line);
  }
}

