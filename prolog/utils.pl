
emptyBoard([
[' ',' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ','h',' ',' ',' '],
[' ',' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ','T',' ',' ',' ']
]).

boardHalfMade([
['Q',' ',' ',' ',' ',' ','b','B'],
[' ',' ','t','h','T','h','b','Q'],
[' ','h',' ','B','h','q','T','Q'],
[' ','B','B','q','b','Q','H','Q'],
['h','h','T','t','h','B','h','B'],
['B','H','t','t','b','Q','T','b'],
['t','q','H','b','q','q','H','Q'],
['H','b','Q','H','q','t','t','b']
]).

generalBoard([
['Q','T','t','T','B','T','b','B'],
['T','H','t','h','T','h','b','Q'],
['q','h','H','B','h','q','T','Q'],
['q','B','B','q','b','Q','H','Q'],
['h','h','T','t','h','B','h','B'],
['B','H','t','t','b','Q','T','b'],
['t','q','H','b','q','q','H','Q'],
['H','b','Q','H','q','t','t','b']
]).

isSpace(Cha) :- Cha == ' '.
isQueen(Cha) :- Cha == 'Q' ; Cha == 'q'.
isTower(Cha) :- Cha == 'T' ; Cha == 't'.
isHorse(Cha) :- Cha == 'H' ; Cha == 'h'.
isBishop(Cha) :- Cha == 'B' ; Cha == 'b'.
isWhitePiece(Cha):- Cha == 'b'; Cha == 't'; Cha == 'q'; Cha == 'h'.
isBlackPiece(Cha):- Cha == 'B'; Cha == 'T'; Cha == 'Q'; Cha == 'H'.

isDigit(X) :- number(X), X >= 1, X =< 8, !; fail.
isGoodCords(X,Y):- X >= 1, X =< 9 , Y >=1, Y =< 9.

charToInt('A',Num) :- Num is 1.
charToInt('B',Num) :- Num is 2.
charToInt('C',Num) :- Num is 3.
charToInt('D',Num) :- Num is 4.
charToInt('E',Num) :- Num is 5.
charToInt('F',Num) :- Num is 6.
charToInt('G',Num) :- Num is 7.
charToInt('H',Num) :- Num is 8.

intToChar(1,NewChar) :- NewChar = 'A'.
intToChar(2,NewChar) :- NewChar = 'B'.
intToChar(3,NewChar) :- NewChar = 'C'.
intToChar(4,NewChar) :- NewChar = 'D'.
intToChar(5,NewChar) :- NewChar = 'E'.
intToChar(6,NewChar) :- NewChar = 'F'.
intToChar(7,NewChar) :- NewChar = 'G'.
intToChar(8,NewChar) :- NewChar = 'H'.

swapPieceOnLine(Array,LineNum,Piece,NewArray) :-
swapPieceOnLineAux(Array,LineNum,1,Piece,NewArray).

swapPieceOnLineAux([],_,_,_,[]).

swapPieceOnLineAux([_|T1],LineNum,LineNum,Piece,[Piece|T2]):-
NextLine is LineNum + 1,
swapPieceOnLineAux(T1,LineNum,NextLine,Piece,T2).

swapPieceOnLineAux([H1|T1],LineNum,CurrLine,Piece,[H1|T2]):-
NextLine is CurrLine + 1,
swapPieceOnLineAux(T1,LineNum,NextLine,Piece,T2).

clearScreen :- write('\33\[2J').

isBlackQueen(Cha) :- Cha == 'Q'.
isBlackTower(Cha) :- Cha == 'T'.
isBlackBishop(Cha) :- Cha == 'B'.
isBlackHorse(Cha) :- Cha == 'H'.

isWhiteQueen(Cha) :- Cha == 'q'.
isWhiteTower(Cha) :- Cha == 't'.
isWhiteBishop(Cha) :- Cha == 'b'.
isWhiteHorse(Cha) :- Cha == 'h'.

ifThenElse(Cond,Then,_Else) :-
  Cond,
  !,
  Then.

ifThenElse(Cond,_Then,Else) :-
  \+Cond,
  !,
  Else.

ifThen(Cond, Then) :-
  Cond,
  !,
  Then.
