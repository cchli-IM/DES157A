(function(){
    "use strict"
    console.log("JS Running")

    const begin = document.querySelector("#begin-button");
    const contextbox = document.querySelector("#context-box");
    const startScreen = document.querySelector("#start-screen");
    const introScreen = document.querySelector("#intro-screen");
    const gameScreen = document.querySelector("#game-screen");
    const act = document.querySelector("#act");
    const rest = document.querySelector("#rest");
    const dice = document.querySelector('#dice');
    const npcStatus = document.querySelectorAll('.status-text')[0];
    const plStatus = document.querySelectorAll('.status-text')[1];
    const npcImg = document.querySelector('.npc-visuals img');

    const bgmBtn = document.querySelector("#bgm-btn");
    const bgmSound = new Audio('sounds/bgm.mp3');
    const dieSound = new Audio('sounds/dicesound.mp3');
   

    bgmBtn.addEventListener('mousedown', function () {
        bgmSound.play();
    });


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
        plPoisonRounds: 0,
        plDefending: false,
        npcDefending: false
    }

    begin.addEventListener('click', function (event) {
        event.preventDefault();

        introScreen.className = 'show';

    
        setTimeout(function() {
            startScreen.className = 'hidden';
        }, 850);

        setTimeout(function() {
            gameScreen.className = 'show';
            introScreen.className = 'hidden';
            setUpTurn();
        }, 7225);
    });
   

    function setUpTurn(){
       
        if (gameData.plDefending) {
            gameData.plDefending = false;
            plStatus.innerHTML = '';
        }
        if (gameData.npcDefending) {
            gameData.npcDefending = false;
            npcStatus.innerHTML = '';
        }

        act.innerHTML = '<button id="roll">ROLL</button>';
        rest.innerHTML = '<button id="rest-btn">REST</button>';
        updateHealthBars();

        document.querySelector('#roll').addEventListener('click', function(){
            throwDice();
        });
        document.querySelector('#rest-btn').addEventListener('click', function(){
            performRest();
        });
    }

    function throwDice(){
         dieSound.play();
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

    if (gameData.roll1 === gameData.roll2 && gameData.roll2 === gameData.roll3) {
          if (gameData.index === 1) {
        endGame(false);
        } else {
            endGame(true);
        }
        return;
    } else if (gameData.roll1 === gameData.roll2 || gameData.roll1 === gameData.roll3) {
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
            gameData.plPoisonRounds--;
            if (gameData.plPoisonRounds === 0) {
                gameData.plPoisoned = false;
                plStatus.innerHTML = '';
            }
        }
        if (gameData.npcPoisoned) {
            gameData.npcHealth -= 5;
            contextbox.innerHTML += `<p><em>Poison: NPC takes 5 damage!</em></p>`;
            gameData.npcPoisonRounds--;
            if (gameData.npcPoisonRounds ===0) {
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
            let damage = gameData.npcDefending ? 10 : 20;
            gameData.npcDefending = false;
            npcStatus.innerHTML = '';
            gameData.npcHealth -= damage;
            npcImg.src = 'images/goblinhurt.png';
            setTimeout(function() { 
                npcImg.src = 'images/goblinstand.png'; 
            }, 1500);
            contextbox.innerHTML += `<p>Attack! NPC takes ${damage} damage!</p>`;
        } else {
            let damage = gameData.plDefending ? 10 : 20;
            gameData.plDefending = false;
            plStatus.innerHTML = '';
            gameData.plHealth -= damage;
            npcImg.src = 'images/goblinattack.png';
            setTimeout(function() {
                 npcImg.src = 'images/goblinstand.png'; 
                }, 1500);
            contextbox.innerHTML += `<p>NPC attacked! You take ${damage} damage!</p>`;
        }
        updateHealthBars();
    }

    function defense() {
        if (gameData.index === 0) {
            gameData.plDefending = true;
            plStatus.innerHTML = '<span>Defending!</span>';
            npcImg.src = 'images/goblinstand.png';
            contextbox.innerHTML += `<p>You brace for impact! Incoming damage halved this round.</p>`;
        } else {
            gameData.npcDefending = true;
            npcStatus.innerHTML = '<span>Defending!</span>';
            npcImg.src = 'images/goblinblock.png';
            contextbox.innerHTML += `<p>NPC braces! Incoming damage halved this round.</p>`;
        }
    }

    function heal() {
        if (gameData.index === 0) {
            gameData.plHealth += 15;
            contextbox.innerHTML += `<p>You healed 20 HP!</p>`;
        } else {
            gameData.npcHealth += 15;
            contextbox.innerHTML += `<p>NPC healed 20 HP!</p>`;
        }
        updateHealthBars();
    }

    function fortune() {
        gameData.extraTurn = true;
        if (gameData.index === 0) {
            plStatus.innerHTML = '<span>Lucky!</span>';
            npcImg.src = 'images/goblinstand.png';
            contextbox.innerHTML += `<p>Fortune smiles! You get another turn!</p>`;
        } else {
            npcStatus.innerHTML = '<span>Lucky!</span>';
            npcImg.src = 'images/goblinfortune.png';
            contextbox.innerHTML += `<p>Fortune smiles on the NPC! It gets another turn!</p>`;
        }
    }

    function poison() {
        if (gameData.index === 0) {
            gameData.npcPoisoned = true;
            gameData.npcPoisonRounds = 2;
            npcStatus.innerHTML = '<span>Poisoned!</span>';
            npcImg.src = 'images/goblinpoison.png';
            setTimeout(function() { 
                npcImg.src = 'images/goblinstand.png'; 
            }, 1500);
            contextbox.innerHTML += `<p>You poisoned the NPC!</p>`;
        } else {
            gameData.plPoisoned = true;
            gameData.plPoisonRounds = 2;
            plStatus.innerHTML = '<span>Poisoned!</span>';
            npcImg.src = 'images/goblinattack.png';
            setTimeout(
                function() { npcImg.src = 'images/goblinstand.png'; 
                }, 1500);
            contextbox.innerHTML += `<p>The NPC poisoned you!</p>`;
        }
    }

    function sloth() {
        gameData.skipNextTurn = true;
        if (gameData.index === 0) {
            npcStatus.innerHTML = '<span>Sloth!</span>';
            npcImg.src = 'images/goblinsloth.png';
            setTimeout(function() { 
                npcImg.src = 'images/goblinstand.png'; 
            }, 2000);
            contextbox.innerHTML += `<p>Sloth! The NPC loses its next turn!</p>`;
        } else {
            plStatus.innerHTML = '<span>Sloth!</span>';
            npcImg.src = 'images/goblinsloth.png';
            setTimeout(function() {
                 npcImg.src = 'images/goblinstand.png'; 
                }, 2000);
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
    if (playerWon) {
        npcImg.src = 'images/goblindefeat.png';
        contextbox.innerHTML += `<p><strong>You defeated the enemy! Victory!</strong></p>`;
    } else {
        npcImg.src = 'images/goblinwin.png';
        contextbox.innerHTML += `<p><strong>You have been defeated... Game Over.</strong></p>`;
    }
        contextbox.innerHTML += `<button id="retry-btn">Retry</button>`;
            gameData.gameEnd = 1;

            document.querySelector('#retry-btn').addEventListener('click', function() {
                location.reload();
            });
        }
})()

