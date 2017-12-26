

startProgram :- 	
					clearScreen,
					nl, write('---------------------------------'), nl,
					write('    Welcome to Massacre Chess    '), nl,
					write('---------------------------------'), nl, nl,
					startMenu.

startMenu :-

	write('Choose an option:'), nl,
	write('1 - Player vs Player'), nl,
	write('2 - Player vs Computer'), nl,
	write('3 - Computer vs Computer'), nl, 
	write('4 - Leave Program'), nl, nl,
	read(MenuOption),
	(
		MenuOption == 1 -> clearScreen, start;
		MenuOption == 2 -> clearScreen, write('computer vs player');
		MenuOption == 3 -> clearScreen, write('computer vs computer'), nl;
		MenuOption == 4 -> clearScreen, write('Exiting Program...'), nl;

		startMenu
	).
