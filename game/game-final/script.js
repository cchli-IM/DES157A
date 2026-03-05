(function(){
    "use strict"
    console.log("JS Running")

    const begin = document.querySelector(".begin")
    const contextbox = document.querySelector(".context-box")
    const startOverlay = document.querySelector(".start-screen")

    const gameData = {
        dieFace: ['images/attack.jpg','images/defense.jpg', 'images/heal.jpg','images/critical.jpg', 'images/fortune.jpg', 'images/curse.jpg', 'images/poison.jpg', 'images/sloth.jpg'],
        roundTurn: ['player', 'npc'],
        status: ['cursed', 'poisoned', 'slothful'],
        plHealth: [100],
        npcHealth: [100],
        gameEnd: [0]
    }

    begin.addEventListener('click', function () {
        startOverlay.className = ""/////
		contextbox.innerHTML = '<p>The adventure has begun...</p>';
	
	});

})()