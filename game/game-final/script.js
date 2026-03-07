(function(){
    "use strict"
    console.log("JS Running")

    const begin = document.querySelector("#begin-button");
    const contextbox = document.querySelector("#context-box");
    const startScreen = document.querySelector("#start-screen");
    const introScreen = document.querySelector("#intro-screen");
    const gameScreen = document.querySelector("#game-screen");
    const skipIntroCheckbox = document.querySelector("#skip-intro");
    const act = document.querySelector("#act");
    const dice = document.querySelector('#dice');
    const status = document.querySelector('.status-text')

    const gameData = {
        dieFace: ['images/attack.jpg','images/defense.jpg', 'images/heal.jpg','images/critical.jpg', 'images/fortune.jpg', 'images/curse.jpg', 'images/poison.jpg', 'images/sloth.jpg'],
        roundTurn: ['player', 'npc'],
        roll1: 0,
        roll2: 0,
        roll3: 0,
        plHealth: 100,
        npcHealth: 100,
        gameEnd: 0,
        index: 0,
        skipNextTurn: false,
        extraTurn: false
    }

    begin.addEventListener('click', function (event) {
        event.preventDefault();
       
       if (skipIntroCheckbox.checked) {
           // Skip intro - go straight to game
           startScreen.className = 'hidden';
           gameScreen.className = 'show';
           contextbox.innerHTML = `<p>Look out, it's a !</p>`;
       } else {
           // Show intro animation
           introScreen.className = 'show';
           
           setTimeout(function() {
               startScreen.className = 'hidden';
           }, 900);
           
           setTimeout(function() {
               gameScreen.className = 'show';
               contextbox.innerHTML = `<p>Look out, it's a //! Roll the action dice!</p>`; //template literal
           }, 8500);
       }
       
       setUpTurn();
	});

    function setUpTurn(){
        act.innerHTML = '<button id="roll">ROLL</button>'
        updateHealthBars();

        document.querySelector('#roll').addEventListener('click', function(){

			throwDice();

		});
    };

    function throwDice(){
        gameData.roll1 = Math.floor(Math.random() * 8) + 1; 
		gameData.roll2 = Math.floor(Math.random() * 8) + 1;
        gameData.roll3 = Math.floor(Math.random() * 8) + 1;
        dice.innerHTML = `<img src="${gameData.dieFace[gameData.roll1-1]}"> 
							<img src="${gameData.dieFace[gameData.roll2-1]}">
                            <img src="${gameData.dieFace[gameData.roll3-1]}">` ;
        
        checkForMatch();
    }

    function checkForMatch() {
        const effects = [attack, defense, heal, critical, fortune, curse, poison, sloth];
        
        // Check if 2 or 3 of the same dice and execute corresponding effect
        if (gameData.roll1 === gameData.roll2 && gameData.roll1 === gameData.roll3) {
            // All 3 match
            effects[gameData.roll1 - 1]();
        } else if (gameData.roll1 === gameData.roll2) {
            // Roll 1 and 2 match
            effects[gameData.roll1 - 1]();
        } else if (gameData.roll1 === gameData.roll3) {
            // Roll 1 and 3 match
            effects[gameData.roll1 - 1]();
        } else if (gameData.roll2 === gameData.roll3) {
            // Roll 2 and 3 match
            effects[gameData.roll2 - 1]();
        } else {
            // No match - no action taken
            console.log("No matching dice - no action taken");
        }
        
        // Switch turns after action
        switchTurn();
    }

    function switchTurn() {
        // Check if extra turn effect is active, if so give same player another turn
        if (gameData.extraTurn === true) {
            gameData.extraTurn = false;
            
            if (gameData.index === 0) {
                // Player goes again
                setUpTurn();
            } else {
                // NPC goes again
                act.innerHTML = '<button id="roll" disabled>ROLL</button>';
                setTimeout(function() {
                    npcTurn();
                }, 1500);
            }
        } else if (gameData.skipNextTurn === true) {
            // Check if sloth effect is active, if so skip opponent's turn
            gameData.skipNextTurn = false;
            
            if (gameData.index === 0) {
                // Player goes again
                setUpTurn();
            } else {
                // NPC goes again
                act.innerHTML = '<button id="roll" disabled>ROLL</button>';
                setTimeout(function() {
                    npcTurn();
                }, 1500);
            }
        } else {
            // Normal turn switch
            gameData.index ? (gameData.index = 0) : (gameData.index = 1);
            
            if (gameData.index === 0) {
                // Player's turn - enable roll button
                contextbox.innerHTML = `<p>Your turn! Roll the dice!</p>`;
                setUpTurn();
            } else {
                // NPC's turn - disable roll button
                contextbox.innerHTML = `<p>NPC's turn...</p>`;
                act.innerHTML = '<button id="roll" disabled>ROLL</button>';
                
                setTimeout(function() {
                    npcTurn();
                }, 1500);
            }
        }
    }

    function npcTurn() {
        dice.innerHTML = '';
        throwDice();
    }

    function attack() {
    }

    function defense() {
    }

    function heal() {
    }

    function critical() {
    }

    function fortune() {
        gameData.extraTurn = true;
        status.innerHTML = '<span>Lucky!</span>'
    }

    function curse() {
        status.innerHTML = '<span>Cursed!</span>'
    }

    function poison() {
        status.innerHTML = '<span>Poisoned!</span>'
    }

    function sloth() {
        gameData.skipNextTurn = true;
        status.innerHTML = '<span>Sloth!</span>'
    }

    function updateHealthBars() {
        // Calculate percentage for each health value
        const plHealthPercent = (gameData.plHealth / 100) * 100;
        const npcHealthPercent = (gameData.npcHealth / 100) * 100;
        
        // Update bar widths
        document.querySelector('#pl-health-bar').style.width = plHealthPercent + '%';
        document.querySelector('#npc-health-bar').style.width = npcHealthPercent + '%';
        
        // Update health text
        document.querySelector('#pl-health-text').textContent = gameData.plHealth + '/100';
        document.querySelector('#npc-health-text').textContent = gameData.npcHealth + '/100';
    }

})()