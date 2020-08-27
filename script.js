var states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

const grid = document.getElementById("casesNTests")

// Handles displaying a thumbnail for each state's COVID data
for (let i = 0; i < states.length; i++) {
  var caseLong = "./figs/casesNTests/" + states[i] + "-Daily Cases and Tests.png";
  var divContainer = document.createElement("div");
  var imageContainer = document.createElement("img");
  var textDescription = document.createElement("span");
  var anchorContainer = document.createElement("a");
  anchorContainer.setAttribute("class", "individualCase");
  anchorContainer.setAttribute("href", caseLong);
  imageContainer.setAttribute("class", "caseImage");
  imageContainer.setAttribute("src", caseLong);
  textDescription.textContent = states[i];
  anchorContainer.appendChild(imageContainer);
  anchorContainer.appendChild(textDescription);
  divContainer.appendChild(anchorContainer);
  grid.appendChild(divContainer);
}

// Handles displaying info for rt_live stuff
var usaCasesData = document.createElement("div");
var casesImgContainer = document.createElement("img");


var usaRtData = document.createElement("div");
var rtImgContainer = document.createElement("img");