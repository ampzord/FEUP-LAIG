function MyGameBoard(scene){
	CGFobject.call(this,scene);
  this.scene = scene;

  this.prologBoard = "placeholder";
  this.currentPlayer = 1;

  this.getPrologRequest("generalBoard");

  this.winner = null;

  this.initialPiece = null;
  this.destinationPiece = null;

  this.playWasMade = null;
  this.gameCycleCounter = 1;

  this.gameType = 0;
  this.gameDifficulty = null;

  this.gameStatusOptions = {
    0: "Player 1 (Black) Playing",
    1: "Player 2 (White) Playing",
    2: "Player 1 (Black) Won",
    3: "Player 2 (White) Won",
    4: ""
  }

  this.numberOfPiecesEatenByBlackPlayer = 0;
  this.numberOfPiecesEatenByWhitePlayer = 0;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
      game.playWasMade = true;
      game.scene.animatePieces(game.initialPiece,game.destinationPiece);

      //UPDATE EM MYGRAPHNODE
      game.scene.graph.nodes[game.initialPiece.nodeID].column = game.destinationPiece.column;
      game.scene.graph.nodes[game.initialPiece.nodeID].line = game.destinationPiece.line;
      game.scene.graph.nodes[game.destinationPiece.nodeID].dead = true;
    }

    
    if(requestString.substring(0,9) == "makePlays") {
      //console.log('Resposta Board-RetValue (makePlays) ' + response);
      var list = response.split("-");
      
      //error ocorred - board is not valid
      if (list[1] == "0") {
        game.initialPiece = null;
        game.destinationPiece = null;
        console.log('Prolog Board came with error' + game.prologBoard)
      }
     else {

        if (game.initialPiece.team == "black") {
          game.numberOfPiecesEatenByBlackPlayer++;
        } 
        else {
          game.numberOfPiecesEatenByWhitePlayer++;
        }
        
        game.prologBoard = list[0];
        game.parseBoard(game.prologBoard);
        //console.log('Prolog Board after sucessful play' + game.prologBoard)
     }
    }

    if(requestString.substring(0,15) == "gameOverByBlack" && response == "0") {
      console.log('Nobody won.');
    }

    if(requestString.substring(0,15) == "gameOverByWhite" && response == "0") {
      console.log('Nobody won.');
    }

    //Winner is Black
    if(requestString.substring(0,15) == "gameOverByBlack" && response == "1") {
      game.winner = 1;
      console.log('Winner is Black, white player has no pieces.');
    }

    //Winner is White
    if(requestString.substring(0,15) == "gameOverByWhite" && response == "1") {
      game.winner = 2;
      console.log('Winner is White, black player has no pieces.');
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
  
  var find = ["z","H","T","Q","B","h","t","q","b",",,"];
  var replace = ["'z'","'H'","'T'","'Q'","'B'","'h'","'t'","'q'","'b'",",'z',"];
  this.prologBoard = replaceStr(plBoard, find, replace);

  //console.log('After parsing prolog Board :' + this.prologBoard);
}

MyGameBoard.prototype.isGameFinished = function() {

  var countOfPlayerWhitePieces = (this.prologBoard.match(/[h|t|q|b]/g)||[]).length;
  var countOfPlayerBlackPieces = (this.prologBoard.match(/[H|T|Q|B]/g)||[]).length;

  console.log('Contador de pecas white no board: ' + countOfPlayerWhitePieces);
  console.log('Contador de pecas black no board: ' + countOfPlayerBlackPieces);

  if (countOfPlayerWhitePieces == 0) {
    console.log('Winner is Black, white player has no pieces.');
    this.winner = 1;
    this.scene.gameStatus = this.gameStatusOptions['2'];
  }

  if (countOfPlayerBlackPieces == 0) {
    console.log('Winner is White, black player has no pieces.');
    this.winner = 2;
    this.scene.gameStatus = this.gameStatusOptions['3'];
  }

  
}

MyGameBoard.prototype.givePickedNodes = function(firstNode,secondNode) {
  this.initialPiece = firstNode;
  this.destinationPiece = secondNode;
}

MyGameBoard.prototype.cycle = async function() {

  //Human vs Human
  if (this.gameType == 0) {
    if (this.initialPiece != null && this.destinationPiece != null) {
      console.log('Game Cycle Counter : ' + this.gameCycleCounter++ + ' Current Player: ' + this.currentPlayer);
      console.log('Peca Origem,  Coluna: ' + this.initialPiece.column + ' Linha: ' + this.initialPiece.line + ' Peça: ' + this.initialPiece.piece);
      console.log('Peca Destino, Coluna: ' + this.destinationPiece.column + ' Linha: ' + this.destinationPiece.line + ' Peça: ' + this.destinationPiece.piece);


      this.checkValidPlay(this.initialPiece.column, this.initialPiece.line, this.destinationPiece.column, this.destinationPiece.line);
     
      await sleep (500);
      
      if (this.playWasMade) {
        console.log('numberOfPiecesEatenByWhitePlayer: ' + this.numberOfPiecesEatenByWhitePlayer);
        console.log('numberOfPiecesEatenByBlackPlayer: ' + this.numberOfPiecesEatenByBlackPlayer);

        this.isGameFinished();
  
        if (this.currentPlayer == 1) {
          this.currentPlayer = 2;
          this.scene.gameStatus = this.gameStatusOptions['1'];
        }
        else {
          this.currentPlayer = 1;
          this.scene.gameStatus = this.gameStatusOptions['0'];
        }

        this.playWasMade = false;
      }
    }
  }
  //Human vs Bot
  else if (this.gameType == 1) {

  }
  //Bot vs Bot
  else if (this.gameType == 2) {

  }
}

