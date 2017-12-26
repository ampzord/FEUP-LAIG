:- use_module(library(lists)).
:- consult(utils).
:- consult(movements).
:- consult(menu).
:- consult(bot).
:- use_module(library(random)).

start :- emptyBoard(X), startGame(X).

printBoard(Board):-
write('  | A | B | C | D | E | F | G | H |'), nl,
write('                                      '), nl,
printField(Board, 1),
write('-------------------------------------'), nl,
write('                                     '), nl,
write('  | A | B | C | D | E | F | G | H |'), nl, nl.

printField(_,9).

printField(Board,Line):-
	write('-------------------------------------'), nl,
	write(Line),
	printLine(Board,Line,1),
	write(' | '), write(Line),
	nl,
	LineAux is Line + 1,
	printField(Board,LineAux).

printLine(_,_,9).

printLine(Board,Line,Column):-
	write(' | '),
	getPiece(Board,Line/Column,Piece),
	write(Piece),
	ColumnAux is Column + 1,
	printLine(Board, Line,ColumnAux).

getPiece(Board,Line/Column,Piece):-
	elementInPosition(Line,Board,L,1),
	elementInPosition(Column,L,Piece,1).

elementInPosition(Position,[X|_],X,Position).
elementInPosition(Position,[_|L],Piece,Cont):-
	Cont1 is Cont+1,
	elementInPosition(Position,L,Piece,Cont1).

startGame(Board) :- gameCycle(Board,1).

gameCycle(Board,Player) :-
	repeat,
	once(printBoard(Board)),
	\+gameOver(Board,Winner),
	%gameOverByMoves(Board,Player,Winner),
	(
		Player == 1 -> write('Player '),  write(Player), write(' (Uppercase letters) choose a piece'), nl;
		Player == 2 -> write('Player '),  write(Player), write(' (lowercase letters) choose a piece'), nl
	),
	write('Column = '), read(ColumnOrigin), nl,
	write('Line = '), read(LineOrigin), isDigit(LineOrigin), nl,
	write('Choose the destination'), nl,
	write('Column = '), read(ColumnDest), nl,
	write('Line = '), read(LineDest), isDigit(LineDest), nl,
	checkValidPlay(Board,Player,ColumnOrigin,LineOrigin,ColumnDest,LineDest),
	charToInt(ColumnOrigin,ColOrigin),
	getPiece(Board,LineOrigin/ColOrigin,PieceOrigin),
	movePiece(Board, ColumnOrigin, LineOrigin,' ', RetBoard),
	movePiece(RetBoard,ColumnDest,LineDest,PieceOrigin,RetRetBoard),
	(
		Player == 1 -> NextPlayer is 2;
		NextPlayer is 1
	),
	gameCycle(RetRetBoard,NextPlayer), !.

gameOverByMoves(Board,Player,Winner):-
	getPiecesThroughBoardLine(Board,1,Value),
	write('Game ended because player cant kill the enemy'), nl.

checkValidPlay(Board,Player,ColumnOrigin,LineOrigin,ColumnDest,LineDest) :-
	checkDestinationPiece(Board,Player,ColumnDest,LineDest),
	checkOwnPiece(Board,Player,ColumnOrigin,LineOrigin,Piece),
	checkDestination(Board,Piece,ColumnOrigin,LineOrigin,ColumnDest,LineDest,Poss), !,
	charToInt(ColumnDest,Col), member([Col,LineDest],Poss).

checkOwnPiece(Board,Player,ColumnOrigin,LineOrigin,Piece) :-
(
	Player == 1 -> charToInt(ColumnOrigin,N), getPiece(Board,LineOrigin/N,Piece), member(Piece,['Q','T','B','H']);
	Player == 2 -> charToInt(ColumnOrigin,N), getPiece(Board,LineOrigin/N,Piece), member(Piece,['q','t','b','h'])
).

checkDestinationPiece(Board,Player,ColumnDest,LineDest) :-
(
	Player == 2 -> charToInt(ColumnDest,N), getPiece(Board,LineDest/N,Piece), member(Piece,['Q','T','B','H']);
	Player == 1 -> charToInt(ColumnDest,N), getPiece(Board,LineDest/N,Piece), member(Piece,['q','t','b','h'])
).

movePiece(Board, Column, Line, Piece, RetBoard) :-
charToInt(Column,Col),
swapFirstPiece(Board,1,Col,Line,Piece, RetBoard).

swapFirstPiece([],_,_,_,_,[]).

swapFirstPiece([Board|Rest],Line,Col,Line,PieceToReplace,[L|RetBoard]) :-
NextLine is Line+1,
swapPieceOnLine(Board,Col,PieceToReplace,L),
swapFirstPiece(Rest,NextLine,Col,Line,PieceToReplace,RetBoard).

swapFirstPiece([Board|Rest],CurrLine,Col,Line,PieceToReplace,[Board|RetBoard]) :-
NextLine is CurrLine+1,
swapFirstPiece(Rest,NextLine,Col,Line,PieceToReplace,RetBoard).

gameOver(Board,Winner):-
		\+checkIfBlackPlayerHasPieces(Board), write('Winner is Player 2 (White Pieces, lower case).'), nl, Winner is 2, abort.

gameOver(Board,Winner):-
		\+checkIfWhitePlayerHasPieces(Board), write('Winner is Player 1 (Black Pieces, upper case).'), nl, Winner is 1, abort.

checkIfBlackPlayerHasPieces(Board):-
				pieceExistsOnBoard('Q', Board);
				pieceExistsOnBoard('H', Board);
				pieceExistsOnBoard('B', Board);
				pieceExistsOnBoard('T', Board).


checkIfWhitePlayerHasPieces(Board):-
				pieceExistsOnBoard('q', Board);
				pieceExistsOnBoard('h', Board);
				pieceExistsOnBoard('b', Board);
				pieceExistsOnBoard('t', Board).

pieceExistsOnBoard(P,[L|_]):-
	member(P,L).

pieceExistsOnBoard(P, [_|T]):-
	pieceExistsOnBoard(P,T).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%&%%%%


getPiecesThroughBoardLine(_,_,9).

getPiecesThroughBoardLine(Board,Player,Line):-
	getPiecesAuxThroughCol(Board,Player,Line),
	LineAux is Line + 1,
	getPiecesThroughBoardLine(Board,Player,LineAux).

getPiecesAuxThroughCol(_,_,_,9).
getPiecesAuxThroughCol(Board,Player,Line,Column):-
	intToChar(Column,ColumnChar),
	getPiece(Board,Line/Column,Piece),
	(
		Player == 1 -> (
							isBlackPiece(Piece),
							getAllPossibilities(Board,Player,Line,ColumnChar,Piece,PossiblePlays),
							sort(PossiblePlays, NewList), %remove duplicates
							write('Lista dps de sort: '), write(NewList), nl,
							isAValidPlay(Board,Player,NewList,Value,NewValue)
						);
		Player == 2 -> (
							isWhitePiece(Piece),
							getAllPossibilities(Board,Player,Line,ColumnChar,Piece,PossiblePlays),
							sort(PossiblePlays, NewList), %remove duplicates
							write('Lista dps de sort: '), write(NewList), nl,
							isAValidPlay(Board,Player,NewList,Value,NewValue)
						)
	),
	ColumnAux is Column + 1,
	getPiecesAuxThroughCol(Board, Player, Line, ColumnAux).


getAllPossibilities(Board,Player,LineOrigin,ColumnOrigin,Piece,PossiblePlays):-
	(
		Player == 1 -> (
								isBlackHorse(Piece) ->
								(
									checkHorseMovement(Board,ColumnOrigin,LineOrigin,1,1,Poss),
									write('Possibilities of Black Horse: '), write(Poss), nl,
									append(Poss,[],PossiblePlays)
								);
								isBlackTower(Piece) ->
								(
									write('Inside isBlackTower getAllPossibilities'), nl,
						  			%upper vertical movement
						  			checkTowerMovement(Board,ColumnOrigin,LineOrigin,ColumnOrigin,1,HPoss9,VPoss9), write('OLAAAA'), nl, append(HPoss9,VPoss9,Possf9),
						  			write('1st checkTowerMovement'), nl,
						  			%left horizontal movement
						  			checkTowerMovement(Board,ColumnOrigin,LineOrigin,'A',LineOrigin,HPoss10,VPoss10), append(HPoss10,VPoss10,Possf10),
						  			write('2nd checkTowerMovement'), nl,
						  			%right horizontal movement
						  			checkTowerMovement(Board,ColumnOrigin,LineOrigin,'H',LineOrigin,HPoss11,VPoss11), append(HPoss11,VPoss11,Possf11),
						  			write('3rd checkTowerMovement'), nl,
						  			%bottom vertical movement
						  			checkTowerMovement(Board,ColumnOrigin,LineOrigin,ColumnOrigin,8,HPoss12,VPoss12), append(HPoss12,VPoss12,Possf12),
						  			write('4th checkTowerMovement'), nl,

						  			append(Possf9,Possf10,Possf13),
						  			append(Possf13,Possf11,Possf14),
								  	append(Possf14,Possf12,Possf15),
								  	append(Possf15,[],PossiblePlays),
						  			write('Possibilites of Black Tower'), write(PossiblePlays), nl
						  		);
								isBlackBishop(Piece) ->
								(
										%top left corner
		                checkBishopMovement(Board,ColumnOrigin,LineOrigin,'A',1,Possf15),
		                %top right corner
		                checkBishopMovement(Board,ColumnOrigin,LineOrigin,'H',1,Possf16),
		                %bottom left corner
		                checkBishopMovement(Board,ColumnOrigin,LineOrigin,'A',8,Possf17),
		                %bottom right corner
		                checkBishopMovement(Board,ColumnOrigin,LineOrigin,'H',8,Possf18),

                  	append(Possf15,Possf16,Passf20),
                  	append(Possf17,Possf20,Passf21),
                  	append(Possf18,Possf21,Passf22),
                  	append(Passf22,[],PossiblePlays),
                  	write('Possibilites of Black Bishop'), write(PossiblePlays), nl
								);
								isBlackQueen(Piece) -> append([],[],PossiblePlays)

						);
		Player == 2 ->  (
								isWhiteHorse(Piece) ->
								(
									checkHorseMovement(Board,ColumnOrigin,LineOrigin,1,1,Poss),
									write('Possibilities of White Horse: '), write(Poss), nl,
									append(Poss,[],PossiblePlays)
								);
								isWhiteTower(Piece) ->
								(
						  			%upper vertical movement
						  			checkTowerMovement(Board,ColumnOrigin,LineOrigin,ColumnOrigin,1,HPoss9,VPoss9), append(HPoss9,VPoss9,Possf9),
						  			write('1st checkTowerMovement'), nl,
						  			%left horizontal movement
						  			checkTowerMovement(Board,ColumnOrigin,LineOrigin,'A',LineOrigin,HPoss10,VPoss10), append(HPoss10,VPoss10,Possf10),
						  			write('2nd checkTowerMovement'), nl,
						  			%right horizontal movement
						  			checkTowerMovement(Board,ColumnOrigin,LineOrigin,'H',LineOrigin,HPoss11,VPoss11), append(HPoss11,VPoss11,Possf11),
						  			write('3rd checkTowerMovement'), nl,
						  			%bottom vertical movement
						  			checkTowerMovement(Board,ColumnOrigin,LineOrigin,ColumnOrigin,8,HPoss12,VPoss12), append(HPoss12,VPoss12,Possf12),
						  			write('4th checkTowerMovement'), nl,

						  			append(Possf9,Possf10,Possf13),
						  			append(Possf13,Possf11,Possf14),
								  	append(Possf14,Possf12,Possf15),
								  	append(Possf15,[],PossiblePlays),
						  			write('Possibilites of White Tower'), write(PossiblePlays), nl
						  		);
								isWhiteBishop(Piece) ->
								(
									%top left corner
		                  			checkBishopMovement(Board,ColumnOrigin,LineOrigin,'A',1,Possf15),
		                  			%top right corner
		                  			checkBishopMovement(Board,ColumnOrigin,LineOrigin,'H',1,Possf16),
		                  			%bottom left corner
		                  			checkBishopMovement(Board,ColumnOrigin,LineOrigin,'A',8,Possf17),
		                  			%bottom right corner
		                  			checkBishopMovement(Board,ColumnOrigin,LineOrigin,'H',8,Possf18),

				                  	append(Possf15,Possf16,Passf20),
				                  	append(Possf17,Possf20,Passf21),
				                  	append(Possf18,Possf21,Passf22),
				                  	append(Passf22,[],PossiblePlays),
				                  	write('Possibilites of White Bishop'), write(PossiblePlays), nl
								);
								isWhiteQueen(Piece) -> append([],[],PossiblePlays)
						)
	).

isAValidPlay(_,_,[],_,_).

isAValidPlay(Board,Player,[Head|Tail],Value,NewValue):-
	%write('Value Inside Is a valid play: '), write(Value), nl,
	%write('List inside isAValidPlay : '), nl, %write('Head :'), write(Head), nl, %write('Tail :'), write(Tail), nl,
	nth1(2,Head,LineObtained),
	nth1(1,Head,ColumnObtained),
	%write('ColumnObtained: '), write(ColumnObtained), nl, %write('LineObtained: '), write(LineObtained), nl,
	getPiece(Board,LineObtained/ColumnObtained,Piece),
	%write('Peca dentro de isAValidPlay:      '), write(Piece), nl,
	(
		Player == 1 ->
		(
			ifThenElse(isWhitePiece(Piece),AuxValue is Value+1,AuxValue is Value),
				NewValue is AuxValue,
				%write('Value after if is enemy peice: '), write(AuxValue), nl,
				isAValidPlay(Board,Player,Tail,AuxValue,NewValue)
		);
		Player == 2 ->
		(
			ifThenElse(isBlackPiece(Piece),AuxValue is Value+1,AuxValue is Value),
				NewValue is AuxValue,
				%write('Value after if is enemy peice: '), write(AuxValue), nl,
				isAValidPlay(Board,Player,Tail,AuxValue,NewValue)
		)
	).
