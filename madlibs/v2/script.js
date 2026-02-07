(function(){
    "use strict";
    console.log("JS Running");
    const animButton = document.querySelector("#sunset-animation-button")
    animButton.addEventListener("click", function(){
        const overlay = document.querySelector("#animation-overlay");
        overlay.style.display = "block"
    });

    const close = document.querySelector("#animation-overlay a");
    close.addEventListener("click", function(event) {
        event.preventDefault();
        const overlay = document.querySelector("#animation-overlay");
        overlay.style.display = "none";
    });

    const myForm = document.querySelector("#myForm");
    myForm.addEventListener("submit", function(event){
        event.preventDefault();
        const madlib = document.querySelector("#madlib-output p");
        const adj = document.querySelector("#adjective").value;
        const bodyPart = document.querySelector("#bodyPart").value;
        const adverb = document.querySelector("#adverb").value;
        const firearm = document.querySelector("#firearm").value;
        const characterDesc = document.querySelector("#characterDesc").value;
        const placeName = document.querySelector("#placeName").value;
        const animal = document.querySelector("#animal").value;
        const madlibQuestions = document.querySelector("#madlib-questions");
        const madlibOutput = document.querySelector("#madlib-output");

        let madlibText = '';
        if (adj == ''){
            madlibText = "please provide an adjective";
            document.querySelector('#adjective').focus();
        } else if (bodyPart == ''){
            madlibText = "please provide a body part";
            document.querySelector('#bodyPart').focus();
        } else if (adverb == ''){
            madlibText = "please provide an adverb";
            document.querySelector('#adverb').focus();
        } else if (firearm == ''){
            madlibText = "please select a firearm";
            document.querySelector('#firearm').focus();
        } else if (characterDesc == ''){
            madlibText = "please provide a character description";
            document.querySelector('#characterDesc').focus();
        } else if (placeName == ''){
            madlibText = "please provide a place name";
            document.querySelector('#placeName').focus();
        } else if (animal == ''){
            madlibText = "please provide an animal";
            document.querySelector('#animal').focus();
        } else {
            madlibText = `It was a <span>${adj}</span> day at the wild wild west. Birds are singing, and flowers are blooming. You enter the town saloon and sitting in the corner was the infamous outlaw, one <span>${bodyPart}'d</span> Cole. "Come on out with your hands up Cole, we've got unfinished business". One <span>${bodyPart}'d</span> cole eyed the revolver in his holster, but before he could act, you pulled out your trusty <span>${firearm}</span> and <span>${adverb}</span> shot his cowboy hat off of his head. Both of his hands shot up as he surrendered to your skill and <span>${characterDesc}</span>. You are applauded for your handy work as <span>${placeName}</span> town's number one bounty hunter. You climb onto the back of your <span>${animal}</span> and rode into the sunset.`;
        }
        madlibQuestions.style.display = 'none';
        madlibOutput.style.display = "block";
        madlib.innerHTML = madlibText;
    });
})()