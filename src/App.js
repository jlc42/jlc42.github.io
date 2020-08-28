import React from 'react';
import './App.css';
// GOAL:
// There are two different issues, a "what do we do quickly for now" and a "what will this look like longer term".

// For now, I think we need a place-holder front page, with a link to the blog with my daily updates... and then some sort of auto-index (possibly with thumbnails) so people can get to the existing figures, which currently include testing/case data for each state, with the scale set so that if the testing data goes above the case data, you have a larger than 10% positivity rate. So... the goal would be to keep the cases line below the testing line in the graphs, when they are inverted, a state is in trouble.  So beyond just a directory listing, there should be SOME description of that that goes with the figures. I also have figures for a run of rt.live's algorithm, but on the whole us instead of a per/state level, which they don't do. So it would be nice to give a link to that as well.

// But as time goes on I hope to add many different additional views for each state. I'm hoping to add things like % tests positive, and then the really interesting things... using a full Hierarchical Bayesian Model to estimate how many have actually been infected/are currently infected with good uncertainty bounds...Then I might possibly expand some of this to other countries. 

// So eventually, we would need something flexible that will give a reasonable ui so people can choose what figures / data they want to view, from a rather long list of options... while making sure it all makes sense. 

// Honestly, I have no idea what the best way is to arrange all that, nor have I kept up with HTML and the various scripting tools people use these days (thus my call for help). 

function App() {
  let states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

  return (
    <div className="main">
    
      <h1>JLC42 - COVID19 Data</h1>
      <a href="https://jlcarroll.blogspot.com/" rel="noopener noreferrer" target="_blank">Link to blog</a>
      <h2>Cases and Tests</h2>
      <div id="casesNTests" className="casesNTests">
        <CasesAndTestsByState statesList={states} />
      </div>
      <h2>Deaths</h2>
      <div id="deaths" className="deaths">
        <DeathsByState statesList={states} />
      </div>
      <h2>Percent Viral Tests Positive</h2>
      <div id="percentViralTests" className="percentViralTests">
        <PercentViralTestsByState statesList={states} />
      </div>
      <h2>RT Live Code Figs</h2>
      <div id="rtLiveCodeFigs" className="rtLiveCodeFigs">
        <RTLiveCodeFigs />
      </div>
    </div>
  );
}

// Component that holds the state case and tests charts
const CasesAndTestsByState = ({statesList}) => {
  return (
    <>
      {statesList.map((item) => (<CaseAndTest key = {`${item}CaseNTest`} location = {item} />))}
    </>
  )
}

// Component that returns an individual case and test data for that state
const CaseAndTest = ({ location }) => {
  let caseLong = `https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/casesNTests/${location}-DailyCasesAndTests.png`;
  return (
    <a href={caseLong} target="_blank" rel="noopener noreferrer">
      <div className="case">
        <img className="caseImage" src={caseLong} alt="" />
        {location}
      </div>
    </a>
  )
}

// Component that holds the state death charts
const DeathsByState = ({ statesList }) => {
  return (
    <>
      {statesList.map((item) => (<Death key = {`${item}Death`} location = {item} />))}
    </>
  )
}

// Component that returns an individual death chart for that state
const Death = ({ location }) => {
  let caseLong = `https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/dailyDeaths/${location}-DailyDeaths.png`;
  return (
    <a href={caseLong} target="_blank" rel="noopener noreferrer">
      <div className="case">
        <img className="caseImage" src={caseLong} alt="" />
        {location}
      </div>
    </a>
  )
}

// Component that holds the state percent viral tests positive charts
const PercentViralTestsByState = ({ statesList }) => {
  return (
    <>
      {statesList.map((item) => (<PercentViralTest key = {`${item}PercentViralTest`} location = {item} />))}
    </>
  )
}

// Component that returns an individual death chart for that state
const PercentViralTest = ({ location }) => {
  let caseLong = `https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/percentViralTestsPositive/${location}-PercentViralTestsPositive.png`;
  return (
    <a href={caseLong} target="_blank" rel="noopener noreferrer">
      <div className="case">
        <img className="caseImage" src={caseLong} alt="" />
        {location}
      </div>
    </a>
  )
}

// Component that returns the two rt_live_code_figs
const RTLiveCodeFigs = () => {
  return (
    <>
      <a href="https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/rt_live_code_figs/USA_cases.png" target="_blank" rel="noopener noreferrer">
        <div className="case">
          <img className="caseImage" src="https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/rt_live_code_figs/USA_cases.png" alt="" />
          USA Cases
        </div>
      </a>
      <a href="https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/rt_live_code_figs/USA_rt.png" target="_blank" rel="noopener noreferrer">
        <div className="case">
          <img className="caseImage" src="https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/rt_live_code_figs/USA_rt.png" alt="" />
          USA RT
        </div>
      </a>
    </>
  )
}


export default App;
