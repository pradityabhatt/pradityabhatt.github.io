var waysToWin;
var array1;
var array2;
var turnX = true;
var num;
var green;
var grid;
var next;
    for (var i=1;i<=9;i++)
    {
	document.write('<div class="grid" id="grid' + i + '">');
			
	for (var j=1;j<=9;j++) 
        {
            document.write('<div class="button" id="' + i + j +'" onclick="method('+i+j+')"></div>');
                if (j % 3 == 0) 
                {
                    document.write('<br>');
                }
	}
	document.write('</div>');
	if (i % 3 == 0) 
            {
                document.write('<br><br>');
            }
    }

    green=false;
    array1 = new Array(9);
    array2 = new Array(9);
    grid = new Array(9);
    waysToWin = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

           for(var i = 0; i <= 8; i++)
            {
		array1[i]=new Array(9);
		array2[i]=new Array(9);
		grid[i]='';
            }
            
            for(var i = 0; i <= 8; i++)
            {
		for(var j = 0; j <= 8; j++)
                {
                    array1[i][j] = false;
                    array2[i][j]='';
		}			
            }
	
        
	function method(i)
        {
            var player;
            var location=parseInt(i/10)-1;
            var loc=parseInt(i/10);
            loc="grid"+loc;	
            var	position= (i%10)-1;		
            var pos=parseInt(position)+1;
            
            player = turnX ? 'X' : 'O';
            
            if(document.getElementById(i).innerHTML!='')
            {
                alert('Occupied space');
                return;
            }
			
			
            	if(green==false)
                {			
						
                	if(turnX)
                        {
                            document.getElementById(i).style.color='blue';
			}
                            document.getElementById(i).innerHTML=player;
                            next="grid"+pos;	
					
				
                            turnX=!turnX;
                            array1[location][position]=true;
                            array2[location][position]=player;
                            if(document.getElementById(loc).style.backgroundColor !='black' 
				&& document.getElementById(loc).style.backgroundColor !='blue')
                            {
				if(winner(player,location)==1)
                                {
                                    document.getElementById(loc).style.backgroundColor = 'black';grid[location]='O';
                                }
                                	if(winner(player,location)==2)
                                        {
                                            document.getElementById(loc).style.backgroundColor = 'blue';grid[location]='X';
                                        }
                            }
					if(document.getElementById(next).style.backgroundColor !='black' 
					&& document.getElementById(next).style.backgroundColor !='blue')
                                        {
						document.getElementById(next).style.backgroundColor='green';
						green=true;
					}
					if(winner(player,-1)!=-1)
                                        {
                                            alert(player+' is the winner');playAgain();
                                        }
		
			}
			else {
				if(document.getElementById(loc).style.backgroundColor!='green')
                                {}
				else
                                {
					if(document.getElementById(next).style.backgroundColor=='green')
                                        {
                                            document.getElementById(next).style.backgroundColor = 'white';
                                        }   
					if(turnX)
                                        {
						document.getElementById(i).style.color='blue'
					}
					document.getElementById(i).innerHTML=player;			

					next="grid"+pos;
					
				
					turnX=!turnX;
					array1[location][position]=true;
					array2[location][position]=player;
					if(document.getElementById(loc).style.backgroundColor !='black' 
					&& document.getElementById(loc).style.backgroundColor !='blue')
                                        {
						if(winner(player,location)==1)
                                                {
                                                    document.getElementById(loc).style.backgroundColor = 'black';grid[location]='O';
                                                }
						if(winner(player,location)==2)
                                                {
                                                    document.getElementById(loc).style.backgroundColor = 'blue';grid[location]='X';
                                                }
						
					}
					if(document.getElementById(next).style.backgroundColor !='black' 
					&& document.getElementById(next).style.backgroundColor !='blue')
                                        {
						document.getElementById(next).style.backgroundColor='green';
					}
					else
                                        {
                                            green=false;
                                           
					}
					if(winner(player,-1)!=-1)
                                        {
                                            alert(player+'  is the winner');
                                        }
				}
			}
		}
		function winner(symbol,location)
                {

			
			if(location==-1)
                        {
                            var array3=grid;
                        }
			else
                        {
                            var array3=array2[location];
                        }
			
				for(var a = 0; a < waysToWin.length; a++)
                                {
                                    if(array3[waysToWin[a][0]]==symbol && array3[waysToWin[a][1]]==symbol 
                                            && array3[waysToWin[a][2]]==symbol)
                                    {	
					if(symbol=='O')
                                        {
                                            return 1;
                                        }	
					if(symbol=='X')
                                        {
                                            return 2;
                                        }			
                                    }
				}
				return -1;
			}


