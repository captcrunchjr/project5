document.querySelector("#search-button").addEventListener("click", function() {
    let query = document.querySelector("#form1").value;
    
    document.location.href = "/items/search/" + encodeURIComponent(query);
});