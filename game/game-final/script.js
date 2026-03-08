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
    const rest = document.querySelector("#rest");
    const dice = document.querySelector('#dice');
    const npcStatus = document.querySelectorAll('.status-text')[0];
    const plStatus = document.querySelectorAll('.status-text')[1];

    const gameData = {
        dieFace: ['images/attack.jpg','images/defense.jpg', 'images/heal.jpg','images/fortune.jpg', 'images/poison.jpg', 'images/sloth.jpg'],
        roll1: 0,
        roll2: 0,
        roll3: 0,
        plHealth: 100,
        npcHealth: 100,
        gameEnd: 0,
        index: 0,
        skipNextTurn: false,
        extraTurn: false,
        plPoisoned: false,
        npcPoisoned: false,
        npcPoisonRounds: 0,
        plDefending: false,
        npcDefending: false
    }

    begin.addEventListener('click', function (event) {
        event.preventDefault();
       
       if (skipIntroCheckbox.checked) {
           startScreen.className = 'hidden';
           gameScreen.className = 'show';
           contextbox.innerHTML += `<p>Look out, it's a !</p>`;
       } else {
           introScreen.className = 'show';
           
           setTimeout(function() {
               startScreen.className = 'hidden';
           }, 900);
           
           setTimeout(function() {
               gameScreen.className = 'show';
               contextbox.innerHTML += `<p>Look out, it's a //! Roll the action dice!</p>`;
           }, 8500);
       }
       
       setUpTurn();
    });

    function setUpTurn(){
        act.innerHTML = '<button id="roll">ROLL</button>'
        rest.innerHTML = '<button id="rest">REST</button>'
        updateHealthBars();

        document.querySelector('#roll').addEventListener('click', function(){
            throwDice();
        });
        document.querySelector('#rest').addEventListener('click', function(){
            performRest();
        });
    };

    function throwDice(){
        gameData.roll1 = Math.floor(Math.random() * 6) + 1; 
        gameData.roll2 = Math.floor(Math.random() * 6) + 1;
        gameData.roll3 = Math.floor(Math.random() * 6) + 1;
        dice.innerHTML = `<img src="${gameData.dieFace[gameData.roll1-1]}"> 
                            <img src="${gameData.dieFace[gameData.roll2-1]}">
                            <img src="${gameData.dieFace[gameData.roll3-1]}">`;
        
        checkForMatch();
    }

    function checkForMatch() {
        const effects = [attack, defense, heal, fortune, poison, sloth];
        
        if (gameData.roll1 === gameData.roll2 && gameData.roll1 === gameData.roll3) {
            effects[gameData.roll1 - 1]();
        } else if (gameData.roll1 === gameData.roll2) {
            effects[gameData.roll1 - 1]();
        } else if (gameData.roll1 === gameData.roll3) {
            effects[gameData.roll1 - 1]();
        } else if (gameData.roll2 === gameData.roll3) {
            effects[gameData.roll2 - 1]();
        } else {
            contextbox.innerHTML += `<p>But nothing happened...</p>`;
        }
        
        switchTurn();
    }

    function performRest() {
        const allStatusTexts = document.querySelectorAll('.status-text');

        gameData.plHealth += 10;
        
        allStatusTexts[1].innerHTML = ''; 
        
        gameData.skipNextTurn = false;
        gameData.plPoisoned = false;
        
        contextbox.innerHTML += `<p>You rested! Recovered 10 HP and cleared negative effects.</p>`;
        
        updateHealthBars();
        switchTurn();
    }
    
    function switchTurn() {
        if (gameData.gameEnd) return;
        checkPoisonDamage();

        if (gameData.extraTurn === true) {
            gameData.extraTurn = false;
            
            if (gameData.index === 0) {
                setUpTurn();
            } else {
                act.innerHTML = '<button id="roll" disabled>ROLL</button>';
                setTimeout(function() {
                    npcTurn();
                }, 1500);
            }
        } else if (gameData.skipNextTurn === true) {
            gameData.skipNextTurn = false;
            
            if (gameData.index === 0) {
                setUpTurn();
            } else {
                act.innerHTML = '<button id="roll" disabled>ROLL</button>';
                setTimeout(function() {
                    npcTurn();
                }, 1500);
            }
        } else {
            gameData.index ? (gameData.index = 0) : (gameData.index = 1);
            
            if (gameData.index === 0) {
                setTimeout(function() {
                    contextbox.innerHTML += `<p>Your turn! Roll the dice!</p>`;
                    setUpTurn();
                }, 1000);
            } else {
                setTimeout(function() {
                    contextbox.innerHTML += `<p>NPC's turn...</p>`;
                }, 1000);
                act.innerHTML = '<button id="roll" disabled>ROLL</button>';
                
                setTimeout(function() {
                    npcTurn();
                }, 2000);
            }
        }
    }

    function checkPoisonDamage() {
        if (gameData.plPoisoned) {
            gameData.plHealth -= 5;
            contextbox.innerHTML += `<p><em>Poison: You take 5 damage!</em></p>`;
        }
        if (gameData.npcPoisoned) {
            gameData.npcHealth -= 5;
            contextbox.innerHTML += `<p><em>Poison: NPC takes 5 damage!</em></p>`;
            gameData.npcPoisonRounds--;
            if (gameData.npcPoisonRounds <= 0) {
                gameData.npcPoisoned = false;
                npcStatus.innerHTML = '';
            }
        }
        updateHealthBars();
    }

    function npcTurn() {
        dice.innerHTML = '';
        throwDice();
    }

    function attack() {
        if (gameData.index === 0) {
            let damage = gameData.npcDefending ? 5 : 10;
            gameData.npcDefending = false;
            gameData.npcHealth -= damage;
            contextbox.innerHTML += `<p>Attack! NPC takes ${damage} damage!</p>`;
        } else {
            let damage = gameData.plDefending ? 5 : 10;
            gameData.plDefending = false;
            gameData.plHealth -= damage;
            contextbox.innerHTML += `<p>NPC attacked! You take ${damage} damage!</p>`;
        }
        updateHealthBars();
    }

    function defense() {
        if (gameData.index === 0) {
            gameData.plDefending = true;
            plStatus.innerHTML = '<span>Defending!</span>';
            contextbox.innerHTML += `<p>You brace for impact! Incoming damage halved this round.</p>`;
        } else {
            gameData.npcDefending = true;
            npcStatus.innerHTML = '<span>Defending!</span>';
            contextbox.innerHTML += `<p>NPC braces! Incoming damage halved this round.</p>`;
        }
    }

    function heal() {
        if (gameData.index === 0) {
            gameData.plHealth += 20;
            contextbox.innerHTML += `<p>You healed 20 HP!</p>`;
        } else {
            gameData.npcHealth += 20;
            contextbox.innerHTML += `<p>NPC healed 20 HP!</p>`;
        }
        updateHealthBars();
    }

    function fortune() {
        gameData.extraTurn = true;
        if (gameData.index === 0) {
            plStatus.innerHTML = '<span>Lucky!</span>';
            contextbox.innerHTML += `<p>Fortune smiles! You get another turn!</p>`;
        } else {
            npcStatus.innerHTML = '<span>Lucky!</span>';
            contextbox.innerHTML += `<p>Fortune smiles on the NPC! It gets another turn!</p>`;
        }
    }

    function poison() {
        if (gameData.index === 0) {
            gameData.npcPoisoned = true;
            gameData.npcPoisonRounds = 2;
            npcStatus.innerHTML = '<span>Poisoned!</span>';
            contextbox.innerHTML += `<p>You poisoned the NPC!</p>`;
        } else {
            gameData.plPoisoned = true;
            plStatus.innerHTML = '<span>Poisoned!</span>';
            contextbox.innerHTML += `<p>The NPC poisoned you!</p>`;
        }
    }

    function sloth() {
        gameData.skipNextTurn = true;
        if (gameData.index === 0) {
            npcStatus.innerHTML = '<span>Sloth!</span>';
            contextbox.innerHTML += `<p>Sloth! The NPC loses its next turn!</p>`;
        } else {
            plStatus.innerHTML = '<span>Sloth!</span>';
            contextbox.innerHTML += `<p>Sloth! You lose your next turn!</p>`;
        }
    }

    function updateHealthBars() {
        if (gameData.plHealth > 100) gameData.plHealth = 100;
        if (gameData.plHealth < 0) gameData.plHealth = 0;
        if (gameData.npcHealth > 100) gameData.npcHealth = 100;
        if (gameData.npcHealth < 0) gameData.npcHealth = 0;

        const plHealthPercent = (gameData.plHealth / 100) * 100;
        const npcHealthPercent = (gameData.npcHealth / 100) * 100;
        
        document.querySelector('#pl-health-bar').style.width = plHealthPercent + '%';
        document.querySelector('#npc-health-bar').style.width = npcHealthPercent + '%';
        
        document.querySelector('#pl-health-text').textContent = gameData.plHealth + '/100';
        document.querySelector('#npc-health-text').textContent = gameData.npcHealth + '/100';

        if (gameData.npcHealth === 0) {
            endGame(true);
        } else if (gameData.plHealth === 0) {
            endGame(false);
        }
    }

    function endGame(playerWon) {
        act.innerHTML = '';
        rest.innerHTML = '';
        dice.innerHTML = '';
        if (playerWon) {
            contextbox.innerHTML += `<p><strong>You defeated the enemy! Victory!</strong></p>`;
        } else {
            contextbox.innerHTML += `<p><strong>You have been defeated... Game Over.</strong></p>`;
        }
        gameData.gameEnd = 1;
    }

})()