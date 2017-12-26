checkDestination(Board,Piece,ColumnOrigin,LineOrigin,ColumnDest,LineDest,Poss) :- 
(
	isQueen(Piece) -> checkQueenMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,HPoss,VPoss,OPoss), !, append(HPoss,VPoss,L1), append(OPoss,L1,Poss);
	isHorse(Piece) -> checkHorseMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,Poss);
	isTower(Piece) -> checkTowerMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,HPoss,VPoss), append(HPoss,VPoss,Poss);
	isBishop(Piece) -> checkBishopMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,Poss)
).

checkHorseMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,Poss) :-
	charToInt(ColumnOrigin,Column),
	Col1 is Column-1,
	Col2 is Column+1,
	Col3 is Column+2,
	Col4 is Column-2,
	Lin1 is LineOrigin-2,
	Lin2 is LineOrigin+2,
	Lin3 is LineOrigin-1,
	Lin4 is LineOrigin+1,

	addHorsePoss(Board,Col1,Lin1,Poss1),
	addHorsePoss(Board,Col1,Lin2,Poss2), append(Poss1,Poss2,L),!,
	addHorsePoss(Board,Col2,Lin1,Poss3), append(L,Poss3,L2),!,
	addHorsePoss(Board,Col2,Lin2,Poss4), append(L2,Poss4,L3),!,
	addHorsePoss(Board,Col3,Lin3,Poss5), append(L3,Poss5,L4),!,
	addHorsePoss(Board,Col3,Lin4,Poss6), append(L4,Poss6,L5),!,
	addHorsePoss(Board,Col4,Lin4,Poss7), append(L5,Poss7,L6),!,
	addHorsePoss(Board,Col4,Lin3,Poss8), append(L6,Poss8,Poss),!.

addHorsePoss(Board,Col,Lin, [[Col,Lin]|[]]) :-
	getPiece(Board,Lin/Col,Piece);write('').

checkBishopMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,OPoss) :-
obliqueMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,OPoss).

checkTowerMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,HPoss,VPoss) :- 
horizontalMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,HPoss),
verticalMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,VPoss).

checkQueenMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,HPoss,VPoss,OPoss) :-
horizontalMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,HPoss), !, 
verticalMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,VPoss), !, 
obliqueMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,OPoss), !. 

obliqueMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,OPoss) :-
charToInt(ColumnOrigin,ColOr), charToInt(ColumnDest,ColDes),
(
	ColOr < ColDes, LineOrigin < LineDest -> getObliquePossibilities(Board,ColOr,LineOrigin,ColDes,LineDest,1,1,OPoss);
	ColOr > ColDes, LineOrigin > LineDest -> getObliquePossibilities(Board,ColOr,LineOrigin,ColDes,LineDest,-1,-1,OPoss);
	ColOr < ColDes, LineOrigin > LineDest -> getObliquePossibilities(Board,ColOr,LineOrigin,ColDes,LineDest,1,-1,OPoss);
	ColOr > ColDes, LineOrigin < LineDest -> getObliquePossibilities(Board,ColOr,LineOrigin,ColDes,LineDest,-1,1,OPoss);
	OPoss = []
).

oneMoreObl(Board,ColWitInc,LineWithInc,ColDes,LineDest,ColInc,LineInc,[[ColWitInc,LineWithInc]|[]]).

getObliquePossibilities(Board,ColOr,LineOrigin,ColDes,LineDest,ColInc,LineInc,[[ColWitInc,LineWithInc]|OPoss]) :-
LineWithInc is LineOrigin+LineInc,
ColWitInc is ColOr+ColInc,
getPiece(Board,LineWithInc/ColWitInc,Piece),
(
	isSpace(Piece) -> getObliquePossibilities(Board,ColWitInc,LineWithInc,ColDes,LineDest,ColInc,LineInc,OPoss);
	oneMoreObl(Board,ColWitInc,LineWithInc,ColDes,LineDest,ColInc,LineInc,OPoss)
).

getObliquePossibilities(_,_,_,_,_,_,[]).																									

horizontalMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,Poss) :-
	charToInt(ColumnOrigin,ColOr), 
	charToInt(ColumnDest,ColDes),
	(
		ColOr < ColDes -> getHorizontalPossibilities(Board,ColOr,LineOrigin,ColDes,LineDest,1,Poss);
						  getHorizontalPossibilities(Board,ColOr,LineOrigin,ColDes,LineDest,-1,Poss)
	).

oneMoreHor(Board,ColWitInc,LineOrigin,ColDes,LineDest,Inc,[[ColWitInc,LineOrigin]|[]]).

getHorizontalPossibilities(Board,ColOr,LineOrigin,ColDes,LineDest,Inc,[[ColWitInc,LineOrigin]|Poss]) :- 
ColWitInc is ColOr+Inc, 
getPiece(Board,LineOrigin/ColWitInc,Piece),
(
	isSpace(Piece) -> getHorizontalPossibilities(Board,ColWitInc,LineOrigin,ColDes,LineDest,Inc,Poss);
	oneMoreHor(Board,ColWitInc,LineOrigin,ColDes,LineDest,Inc,Poss)
).

getHorizontalPossibilities(_,_,_,_,_,_,[]).


verticalMovement(Board,ColumnOrigin,LineOrigin,ColumnDest,LineDest,VPoss) :- 
charToInt(ColumnOrigin,ColOr), charToInt(ColumnDest,ColDes),
(
		LineOrigin < LineDest -> getVerticalPossibilities(Board,ColOr,LineOrigin,ColDes,LineDest,1,VPoss)
								 ;
								getVerticalPossibilities(Board,ColOr,LineOrigin,ColDes,LineDest,-1,VPoss)
).

oneMoreVer(Board,ColOr,LineWithInc,ColDes,LineDest,Inc,[[ColOr,LineWithInc]|[]]).

getVerticalPossibilities(Board,ColOr,LineOrigin,ColDes,LineDest,Inc,[[ColOr,LineWithInc]|VPoss]) :- 
LineWithInc is LineOrigin+Inc,
getPiece(Board,LineWithInc/ColOr,Piece),
(
	isSpace(Piece) -> getVerticalPossibilities(Board,ColOr,LineWithInc,ColDes,LineDest,Inc,VPoss);
	oneMoreVer(Board,ColOr,LineWithInc,ColDes,LineDest,Inc,VPoss)
).

getVerticalPossibilities(_,_,_,_,_,_,[]).
