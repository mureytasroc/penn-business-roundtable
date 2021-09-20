document.getElementById(document.title).className += " active"

$(function () {
$("#mdb-lightbox-ui").load("mdb-addons/mdb-lightbox-ui.html");
});

function speakerBack(){
  window.history.back()
}

// Uncomment the below line to enable the recruiting popup
// setTimeout(function(){ $.jsdvPopup({}); }, 500)
