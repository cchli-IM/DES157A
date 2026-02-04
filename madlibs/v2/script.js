(function(){
    "use strict";
    console.log("JS Running");
    const myForm = document.querySelector("#myForm");
    myForm.addEventListener("submit", function(event){
        event.preventDefault();
        const madlib = document.querySelector("#madlib-output p");
        const adj = document.querySelector("#adjective").value;
        const bodyPart = document.querySelector("#bodyPart").value;
        const adverb = document.querySelector("#adverb").value;
        const firearm = document.querySelector("#firearm").value;
        const noun = document.querySelector("#noun").value;
        const placeName = document.querySelector("#placeName").value;
        const animal = document.querySelector("#animal").value;
        const madlibQuestions = document.querySelector("#madlib-questions");
        const madlibOutput = document.querySelector("#madlib-output");

        let madlibText = '';
        if (adj == ''){
            myText = "please provide an adjective";
            document.querySelector('#adj').focus();
        } else if (bodyPart == ''){
            myText = "please provide a body part";
            document.querySelector('#bodyPart').focus();
        } else if (adverb == ''){
            myText = "please provide an adverb";
            document.querySelector('#adverb').focus();
        } else if (firearm == ''){
            myText = "please select a firearm";
            document.querySelector('#firearm').focus();
        } else if (noun == ''){
            myText = "please select a noun";
            document.querySelector('#noun').focus();
        } else if (placeName == ''){
            myText = "please select a place name";
            document.querySelector('#placeName').focus();
        } else if (animal == ''){
            myText = "please select an animal";
            document.querySelector('#animal').focus();
        } else {
        const madlibText = `It was a ${adj} day at the wild wild west. Birds are singing, and flowers are blooming. You enter the town saloon and sitting in the corner was the infamous outlaw, one ${bodyPart}ed Cole. "Come on out with your hands up Cole, we've got unfinished business". One ${bodyPart}ed cole eyed the revolver in his holster, but before he could act, you pulled out your trusty ${firearm} and ${adverb} shot his cowboy hat off of his head. Both of his hands shot up as he surrendered to your skill and ${noun}. You are applauded for your handy work as ${placeName} town's number one bounty hunter. You climb onto the back of your ${animal} and rode into the sunset.`
        }
        madlibQuestions.style.display = 'none';
        madlibOutput.style.display = "block";
    })
    madlib.innerHTML = madlibText;
})()