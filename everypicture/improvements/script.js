(function(){
    "use strict"
    console.log("JS Running")

    const images = document.querySelectorAll("article img");
    const hint = document.querySelector("#hint");
    for (let i = 0; i < images.length; i++){
        const imgNum = images[i].id.replace("img", "");
        const desc = document.querySelector("#desc" + imgNum); 
        
        if (desc !== null){
        
        images[i].addEventListener("mouseenter", function() {
            desc.style.display = "block";
            hint.style.display = "none";
            for (let j = 0; j < images.length; j++) {
                if (images[j] !== images[i]) {
                    images[j].style.opacity = "0.1";
                }
            }
        });

        images[i].addEventListener("mouseleave", function() {
            desc.style.display = "none";
            hint.style.display = "block";
            for (let j = 0; j < images.length; j++) {
                if (images[j] !== images[i]) {
                    images[j].style.opacity = "1";
                }
            }
        });
        }
    }

   
})()