const numGIFs = 9;
const api_url = `https://api.giphy.com/v1/gifs/search?api_key=0010990be74a4f048609620599cd5f8f&limit=${numGIFs}&q=`;


let topics    = ["birthday", "hug", "love", "house", "work", "dance", "sleepy", "coffee", "study", "sandwich", "hm", "cuddly", "math", "energy drink", "you rock"];
let numTopics = topics.length;


function updateSearchHistory(query) {
  
    $("#query").val("");
    $("#query").focus();


    if (query === "") {
        return;
    }
    
    
    $(".topics").off("click");

  
    if (arguments.length === 0) {
        let output = "";

        topics.forEach(t => output += `<div class="topics">${t}</div>`);

        $("#searchHistory").html(output);
    
  
    } else if (!topics.includes(query)) {
        topics.push(query);
        numTopics++;

        $("#searchHistory").append(`<div class="topics">${query}</div>`);

     
        getGIFs(query);


    } else {
        getGIFs(query);

    }

    $(".topics").on("click", function() {
        getGIFs($(this).text());
    });
}


function toggleGIFAnimation() {

    let img_url = $("img", this).attr("src");
    
  
    if (img_url.includes("_s.gif")) {
 
        img_url = img_url.replace("_s.gif", ".gif");

    } else {
      
        img_url = img_url.replace(".gif", "_s.gif");

    }

    $("img", this).attr("src", img_url);
}


function getGIFs(query) {
    $.ajax({
        "url"   : api_url + query,
        "method": "GET"

    }).done(response => {
      
        $(document).off("click", ".image_container");

        let output = "";

        response.data.forEach(r => {
            output += `<div class="image_container">
                           <img src="${r.images.fixed_width_still.url}" height="150">
                           <span class="rating">Rating: ${r.rating.toUpperCase()}</span>
                       </div>`;
        });
        
        $("#searchResults").html(output);


        $(".image_container").css({"display": "none"});

        let index = 1;
        
        const intervalID = setInterval(function() {
            $(`.image_container:nth-of-type(${index})`).css({"display": "block"});
            
            index++;

            if (index > numGIFs) {
                clearInterval(intervalID);
            }
            
        }, 150);
    });
}


$(document).ready(function() {
    updateSearchHistory();

    $("#query").on("keyup", event => {
        
        if (event.keyCode === 13) {
            const query = $("#query").val().trim().toLowerCase();

            updateSearchHistory(query);
        }
    });

    $("#button_search").on("click", function() {
        const query = $("#query").val().trim().toLowerCase();

        updateSearchHistory(query);
    });

    $(".topics").on("click", function() {
        const query = $(this).text();

        getGIFs(query);
    });
});


$("body").on("click", ".image_container", toggleGIFAnimation);
