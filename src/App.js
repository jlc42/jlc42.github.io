import React from 'react';
import './App.css';
// GOAL:
// There are two different issues, a "what do we do quickly for now" and a "what will this look like longer term".

// For now, I think we need a place-holder front page, with a link to the blog with my daily updates... and then some sort of auto-index (possibly with thumbnails) so people can get to the existing figures, which currently include testing/case data for each state, with the scale set so that if the testing data goes above the case data, you have a larger than 10% positivity rate. So... the goal would be to keep the cases line below the testing line in the graphs, when they are inverted, a state is in trouble.  So beyond just a directory listing, there should be SOME description of that that goes with the figures. I also have figures for a run of rt.live's algorithm, but on the whole us instead of a per/state level, which they don't do. So it would be nice to give a link to that as well.

// But as time goes on I hope to add many different additional views for each state. I'm hoping to add things like % tests positive, and then the really interesting things... using a full Hierarchical Bayesian Model to estimate how many have actually been infected/are currently infected with good uncertainty bounds...Then I might possibly expand some of this to other countries. 

// So eventually, we would need something flexible that will give a reasonable ui so people can choose what figures / data they want to view, from a rather long list of options... while making sure it all makes sense. 

// Honestly, I have no idea what the best way is to arrange all that, nor have I kept up with HTML and the various scripting tools people use these days (thus my call for help). 

function App() {
  // const [modal, setModal] = React.useState(false);

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
      {/* <Modal show={modal} handleClose={() => setModal(!modal)} /> */}
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
  const [modal, setModal] = React.useState(false);
  let caseLong = `https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/casesNTests/${location}-DailyCasesAndTests.png`;
  return (
    <>
      <div className="case" onClick={() => {setModal(!modal)}}>
          <img className="caseImage" src={caseLong} alt="" />
          {location}
      </div>
      <Modal show={modal} handleClose={() => setModal(!modal)} image={caseLong} location={location} type="Cases and Tests" content="Content" />
    </>
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

// Modal component that handles the popup when clicking the image
const Modal = ({ handleClose, show, image, location, type, content }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  // If "ESC" is pressed, it exits the modal window
  const escFunction = (event) => {
    if (event.keyCode === 27) { 
      handleClose();
    }
  }

  // If the mouse is clicked outside of the modal window while it is open, the modal will close
  const handleClick = (event) => {
    if (event.target.className === "modal display-block") {
      handleClose();
    }
  }

  // Side-effect that handles the ESC press or click out of modal window
  React.useEffect(() => {
    if (show) {
      window.addEventListener('keydown', escFunction);
      window.addEventListener('click', handleClick)
      return (() => {
        window.removeEventListener('keydown', escFunction);
        window.removeEventListener('click', handleClick);
      })
    }
  })

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <span className="close" onClick={handleClose}>&times;</span>
        <div className="modal-header">  
          <h1>{location} - {type}</h1>
        </div>
        <img className="modal-image" src={image} alt={location} />
        <div className="modal-content">
        {content || "Lorem ipsum"}
        </div>
        <div className="modal-footer">
          <button onClick={handleClose}>close</button>
        </div>
      </section>
    </div>
  )
};


export default App;
