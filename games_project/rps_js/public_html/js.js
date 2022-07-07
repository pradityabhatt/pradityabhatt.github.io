var loses = 0;
var wins = 0;

var play = function(user) {
					
					document.getElementById("player").innerHTML="";
					document.getElementById("opponent").innerHTML="";
					document.getElementById("results").innerHTML="";
				
					
					if (user == "rock" || user == "paper" || user == "scissors") {
						document.getElementById("player").innerHTML='You chose' + ' ' + user + '.';
					} 
                            
					var computer = Math.random();
					if (computer < 0.34) {
						computer = "rock";
					} else if(computer <= 0.67) {
						computer = "paper";
					} else {
						computer = "scissors";
					}
				 
				 	document.getElementById("opponent").innerHTML='Computer chose' + ' ' + computer + '.';
				 
					 var compare = function (choice1,choice2) {
						if (choice1 == choice2) {
							return "It's a tie!";
						}
                                                else if (choice1 == "rock"){
							if (choice2 =="scissors") {
								wins++;
								return "You win";
							}
                                                        else {
								loses++;
								return "You loose, computer wins.";
							}
						}
                                                else if (choice1 == "paper") {
							if (choice2 == "rock") {
								wins++;
								return "You win";
							}
                                                        else {
								loses++;
								return "You loose, computer wins.";
							}
						} 
                                                else if (choice1 == "scissors") {
							if (choice2 == "rock") {
								loses++;
								return "You loose, computer wins";
							} 
                                                        else {
								wins++;
								return "You win";
							}
						} 
                                      
                                                else {
							return "error";
						}
					};

					var winner = compare(user,computer);
					document.getElementById("results").innerHTML=winner;
					document.getElementById("wins").innerHTML=wins;
					document.getElementById("loses").innerHTML=loses;
					
				
						document.getElementById("wins").style.fontSize="40";
						document.getElementById("loses").style.fontSize="40";
			
			};

var reset = function() {
	loses = 0;
	wins = 0;
	document.getElementById("wins").innerHTML=wins;
	document.getElementById("loses").innerHTML=loses;
};