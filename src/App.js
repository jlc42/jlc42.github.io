import React from 'react';
import './App.css';
// GOAL:
// There are two different issues, a "what do we do quickly for now" and a "what will this look like longer term".

// For now, I think we need a place-holder front page, with a link to the blog with my daily updates... and then some sort of auto-index (possibly with thumbnails) so people can get to the existing figures, which currently include testing/case data for each state, with the scale set so that if the testing data goes above the case data, you have a larger than 10% positivity rate. So... the goal would be to keep the cases line below the testing line in the graphs, when they are inverted, a state is in trouble.  So beyond just a directory listing, there should be SOME description of that that goes with the figures. I also have figures for a run of rt.live's algorithm, but on the whole us instead of a per/state level, which they don't do. So it would be nice to give a link to that as well.

// But as time goes on I hope to add many different additional views for each state. I'm hoping to add things like % tests positive, and then the really interesting things... using a full Hierarchical Bayesian Model to estimate how many have actually been infected/are currently infected with good uncertainty bounds...Then I might possibly expand some of this to other countries. 

// So eventually, we would need something flexible that will give a reasonable ui so people can choose what figures / data they want to view, from a rather long list of options... while making sure it all makes sense. 

// Honestly, I have no idea what the best way is to arrange all that, nor have I kept up with HTML and the various scripting tools people use these days (thus my call for help). 

function App() {
  return (
    <div className="main">
    
      <h1>JLC42</h1>
      <a href="https://jlcarroll.blogspot.com/" rel="noopener noreferrer" target="_blank">Link to blog</a>
      <h2>Cases and Tests</h2>
      <div id="casesNTests" class="casesNTests">

      </div>
    </div>
  );
}

// Component that holds the state case charts
const CasesByState = () => {
  let states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];
  // for (let i = 0; i < states.length; i++) {
  //   let caseLong = "./figs/casesNTests/" + states[i] + "-Daily Cases and Tests.png";
  // }

  return (
    <>
      
    </>
  )
}

export default App;
