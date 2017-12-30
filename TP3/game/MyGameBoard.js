function MyGameBoard(scene){
	CGFobject.call(this,scene);
  this.scene = scene;

  this.prologBoard = "placeholder";
  this.currentPlayer = 1;

  this.getPrologRequest("generalBoard");

  this.winner = null;

  this.initialPiece = null;
  this.destinationPiece = null;

  this.playIsValidAux = null;
  this.i = 0;
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

    //not valid play
    if (requestString.substring(0,15) == "checkValidPlays" && response == "0") {
      console.log('Cant eat piece, wrong move!');
    }

    //valid play
    if (requestString.substring(0,15) == "checkValidPlays" && response == "1") {
      console.log('Can eat piece');

      game.movePiece(game.destinationPiece.column, game.destinationPiece.line, game.initialPiece.column, game.initialPiece.line, game.initialPiece.piece);
      
      game.scene.animatePieces(game.initialPiece,game.destinationPiece);
      //TODO UPDATE EM MYGRAPHNODE

  
      
      console.log(game.scene.graph.nodes[game.initialPiece.nodeID].column);
      game.scene.graph.nodes[game.initialPiece.nodeID].column = game.destinationPiece.column;
      game.scene.graph.nodes[game.initialPiece.nodeID].line = game.destinationPiece.line;
      game.scene.graph.nodes[game.destinationPiece.nodeID].dead = true;
    }

    
    if(requestString.substring(0,9) == "makePlays") {
      console.log('Resposta Board-RetValue (makePlays) ' + response);
      var list = response.split("-");
      
      //error ocorred - board is not valid
      if (list[1] == "0") {
        //game.initialPiece = null;
        //game.destinationPiece = null;
      }
      //Good value
     else {
        game.prologBoard = list[0];
        game.parseBoard(game.prologBoard);
     }
    }

    if(requestString.substring(0,15) == "gameOverByBlack" && response == "0") {
      console.log('Ninguem ganhou x1.');
    }

    if(requestString.substring(0,15) == "gameOverByBlack" && response == "1") {
      game.winner = 1;
      console.log('Winner is Black, white player has no pieces.');
    }

    if(requestString.substring(0,15) == "gameOverByWhite" && response == "1") {
      game.winner = 2;
      console.log('Winner is Black, white player has no pieces.');
    }

    if(requestString.substring(0,15) == "gameOverByWhite" && response == "0") {
      console.log('Ninguem ganhou x2.');
    }
  }
    
  request.onerror = onError || function(){console.log("Error waiting for response");};

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();
};

MyGameBoard.prototype.checkValidPlay = function(ColumnOrigin,LineOrigin,ColumnDest,LineDest) {
  var requestString = 'checkValidPlays(' + this.prologBoard + ',' + this.currentPlayer + ',' + ColumnOrigin + ','
  + LineOrigin + ',' + ColumnDest + ',' + LineDest + ')'; 
  this.getPrologRequest(requestString);
}

MyGameBoard.prototype.movePiece = function(ColumnDest,LineDest,ColumnOrigin,LineOrigin,Piece) {
  var requestString = 'makePlays(' + this.prologBoard + ',' + ColumnDest + ',' + LineDest + ',' + ColumnOrigin + ','
   + LineOrigin + ',' + Piece + ')';
  this.getPrologRequest(requestString);
}

MyGameBoard.prototype.checkEndGame = function() {
  var requestString = 'gameOverByWhite(' + this.prologBoard + ')';
  this.getPrologRequest(requestString);
  var requestString = 'gameOverByBlack(' + this.prologBoard + ')';
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


MyGameBoard.prototype.givePickedNodes = function(firstNode,secondNode) {
  this.initialPiece = firstNode;
  this.destinationPiece = secondNode;
}

MyGameBoard.prototype.givePickedNodes = function(firstNode,secondNode) {
  
}


MyGameBoard.prototype.cycle = function() {
  /*this.initialPiece = firstNode;
  this.destinationPiece = secondNode;*/

  if (this.initialPiece != null && this.destinationPiece != null) {
    console.log('Peca Origem,  Col: ' + this.initialPiece.column + ' Linha: ' + this.initialPiece.line);
    console.log('Peca Destino, Col: ' + this.destinationPiece.column + ' Linha: ' + this.destinationPiece.line);


    this.checkValidPlay(this.initialPiece.column, this.initialPiece.line, this.destinationPiece.column, this.destinationPiece.line);
    this.checkEndGame();

    if (this.currentPlayer == 1) {
      this.currentPlayer = 2;
    }
    else {
      this.currentPlayer = 1;
    }
    //TINHA E FODEU O QE TAVA ANTES
    //this.initialPiece = null;
    //this.destinationPiece = null;
  }
  console.log('game cycle counter : ' + this.i++ + ' Current Player: ' + this.currentPlayer);
}

