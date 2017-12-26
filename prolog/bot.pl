

startGamePxB :- boardWithPieces(X), gameCyclePxB(X,2).

gameCyclePxB(Board,Player) :- 
	printBoard(Board),
	\+gameOver(Board,Winner),
	(
		Player == 1 -> (
								write('Player '),  write(Player), write(' choose a piece'), nl,
								write('Column = '), read(ColumnOrigin), nl,
								write('Line = '), read(LineOrigin), isDigit(LineOrigin), nl,
								write('Choose the destination'), nl,
								write('Column = '), read(ColumnDest), nl,
								write('Line = '), read(LineDest), isDigit(LineDest),
								checkValidPlay(Board,Player,ColumnOrigin,LineOrigin,ColumnDest,LineDest),
								charToInt(ColumnOrigin,ColOrigin),
								write('Original Column:'), write(ColumnOrigin), write(' / Original Line:'), write(LineOrigin),nl,
								getPiece(Board,LineOrigin/ColOrigin,PieceOrigin), write('Piece: '), write(PieceOrigin), nl,
								write('Destination Column:'), write(ColumnDest), write(' / Destination Line:'), write(LineDest),nl,
								movePiece(Board, ColumnOrigin, LineOrigin,' ', RetBoard),
								movePiece(RetBoard,ColumnDest,LineDest,PieceOrigin,RetRetBoard),
								(
									Player == 1 -> NextPlayer is 2;
									NextPlayer is 1
								),
								gameCyclePxB(RetRetBoard,NextPlayer)
							);
		Player == 2 -> 
						    (
								write('Bot is playing right now'),nl,
								getBotPlay(Board,Player,ColumnOrigin,LineOrigin,ColumnDest,LineDest),
								write('ColumDest bot replied :'), write(ColumnDest), nl,
								write('LineDest bot replied :'), write(LineDest), nl,
								write('sai do getbotplay'), nl,
								charToInt(ColumnOrigin,ColOrigin),
								getPiece(Board,LineOrigin/ColOrigin,PieceOrigin), write('Piece: '), write(PieceOrigin), nl,
								get_char(_),
								%movePiece(Board, ColumnOrigin, LineOrigin,' ', RetBoard),
								%movePiece(RetBoard,ColumnDest,LineDest,PieceOrigin,RetRetBoard),
								(
									Player == 1 -> NextPlayer is 2;
									NextPlayer is 1
								),
								gameCyclePxB(RetRetBoard,NextPlayer)
							)
	).


getBotPlay(Board,Player,ColumnOrigin,ColumnDest,LineOrigin,LineDest) :-
	itThrBoard(Board, Player,ColumnOrigin,ColumnDest,LineOrigin,LineDest, 1).


itThrBoard(_,_,_,_,_,_,9).

itThrBoard(Board,Player,ColumnOrigin,ColumnDest,LineOrigin,LineDest,Line):- 
	itrThrColumn(Board,Player,ColumnOrigin,ColumnDest,LineOrigin,LineDest,Line,1), 
	LineAux is Line + 1, 
	itThrBoard(Board,Player,ColumnOrigin,ColumnDest,LineOrigin,LineDest,LineAux).

itrThrColumn(_,_,_,_,_,_,_,9).

itrThrColumn(Board,Player,ColumnOrigin,ColumnDest,LineOrigin,LineDest,Line,Column):-  
	getPiece(Board,Line/Column,Piece),
	write('piece: '),write(Piece),nl,
	(
		Player == 2 -> 
						(
							isWhitePiece(Piece) ->  (
														write(Piece), write('Found a white piece'), nl,
														getRandomPlaces(Board,Player,ColumnOrigin,ColumnDest,LineOrigin,LineDest,0), write('sai'),nl
													);
							write('')
						);
		Player == 1 -> write('')				
	),
	ColumnAux is Column + 1, 	
	itrThrColumn(Board,Player,ColumnOrigin,ColumnDest,LineOrigin,LineDest,Line,ColumnAux).


getRandomPlaces(_,_,_,_,_,_,10).

getRandomPlaces(Board,Player,ColumnOrigin,ColumnDest,LineOrigin,LineDest,Limit) :-
random(1,9,ColRand),
write('after 1st rand'),nl,
random(1,9,LinRand),
write('after 2st rand'),nl,
intToChar(ColRand,ColRandChar),
intToChar(ColumnOrigin,ColumnOriginChar),
write('before checkValidPlay'), nl,
checkValidPlay(Board,Player,ColumnOriginChar,LineOrigin,ColRandChar,LinRand),
write('after checkValidPlay'), nl,
LineDest is LinRand,
ColumnDest is ColRand, 
write('linedest: '), write(LineDest), nl,
write('coldest: '),write(ColumnDest), nl,
NewLim is Limit+1,
getRandomPlaces(Board,Player,ColumnOrigin,ColumnDest,LineOrigin,LineDest,NewLim).


getRandomPlaces(Board,Player,ColumnOrigin,ColumnDest,LineOrigin,LineDest,Limit):-
NewLim is Limit+1,
getRandomPlaces(Board,Player,ColumnOrigin,ColumnDest,LineOrigin,LineDest,NewLim).
