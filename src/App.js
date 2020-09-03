import React from 'react';
import './App.css';
import axios from 'axios';
import Data from './App.json';
import USAMap from 'react-usa-map';

// GOAL:
// There are two different issues, a "what do we do quickly for now" and a "what will this look like longer term".

// For now, I think we need a place-holder front page, with a link to the blog with my daily updates... and then some sort of auto-index (possibly with thumbnails) so people can get to the existing figures, which currently include testing/case data for each state, with the scale set so that if the testing data goes above the case data, you have a larger than 10% positivity rate. So... the goal would be to keep the cases line below the testing line in the graphs, when they are inverted, a state is in trouble.  So beyond just a directory listing, there should be SOME description of that that goes with the figures. I also have figures for a run of rt.live's algorithm, but on the whole us instead of a per/state level, which they don't do. So it would be nice to give a link to that as well.

// But as time goes on I hope to add many different additional views for each state. I'm hoping to add things like % tests positive, and then the really interesting things... using a full Hierarchical Bayesian Model to estimate how many have actually been infected/are currently infected with good uncertainty bounds...Then I might possibly expand some of this to other countries. 

// So eventually, we would need something flexible that will give a reasonable ui so people can choose what figures / data they want to view, from a rather long list of options... while making sure it all makes sense. 

// Honestly, I have no idea what the best way is to arrange all that, nor have I kept up with HTML and the various scripting tools people use these days (thus my call for help). 

function App() {
  return (
    <div className="main">
      <h1>JLC42 - COVID19 Watch</h1>
      <a href="https://covid-19watch.blogspot.com/" rel="noopener noreferrer" target="_blank">Link to blog</a>
      <Figures />
    </div>
  );
}

// Component that holds the figures
const Figures = () => {
  // State hook that holds the modal boolean, whether or not it shows up
  const [modal, setModal] = React.useState(false);
  // State hook that holds the current US state being viewed
  const [USState, setUSState] = React.useState('');
  // Fixes the problem of DC not being labeled properly
  window.addEventListener('load', () => {
    let DC = document.getElementsByClassName("DC").item(0);
    console.log(DC);
    DC.insertAdjacentHTML('beforeend', '<title>Washington DC</title>');
  })

  return (
    <>
      <h2>Select a state...</h2>
      <USAMap 
        onClick={(event) => {
          setModal(!modal); 
          setUSState(event.target.dataset.name);
          }
        } 
      />
      <Modal 
        show={modal} 
        handleClose={() => {
          setModal(!modal);
          }
        } 
        location = {USState} 
        content="Content"
      />
      <h2>RT Live Code Figs</h2>
      <div id="rtLiveCodeFigs" className="rtLiveCodeFigs">
        <RTLiveCodeFigs />
      </div> 
    </>
  )
}

// Component that returns the two rt_live_code_figs
const RTLiveCodeFigs = () => {
  // State hook that holds the modal boolean, whether or not it shows up
  const [modal, setModal] = React.useState(false);
  // State hook to hold which type of RT that is being passed
  const [category, setCategory] = React.useState('');
  // State hook to hold the URL of the image
  const [image, setImage] = React.useState('');

  return (
    <>
      <div className="case" onClick={() => {setModal(!modal); setCategory('cases'); setImage('https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/rt_live_code_figs/USA_cases.png');}}>
        <img className="caseImage" src="https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/rt_live_code_figs/USA_cases.png" alt="" />
        USA Cases
      </div>
      <div className="case" onClick={() => {setModal(!modal); setCategory('RT'); setImage('https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/rt_live_code_figs/USA_rt.png');}}>
        <img className="caseImage" src="https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/rt_live_code_figs/USA_rt.png" alt="" />
        USA RT
      </div>
      <ModalForNation 
        show={modal} 
        handleClose={() => {
          setModal(!modal);
          setCategory('');
          setImage('');
          }
        }
        type={category}
        url={image}
      />
    </>
  )
}

// Modal component that handles the popup when clicking the image
const Modal = ({ handleClose, show, location }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  // State hook that holds the current category being viewed
  const [category, setCategory] = React.useState('');
  // State hook that handles current image
  const [image, setImage] = React.useState('');
  // State hook that handles current text content
  const [content, setContent] = React.useState('');
  // State hook that handles current text content url
  const [contentURL, setContentURL] = React.useState('');

  // Define variables containing information used in modal window
  let currentUSState = Data.states[location];
  let currentUSStateName, currentCategoryName;
  let categoriesArr = [];

  for (let val in Data.categories) {
    categoriesArr.push(val);
  }

  if (currentUSState) {
    currentUSStateName = currentUSState.name;
    currentCategoryName = Data.categories[category].name;
  }

  // useEffect hook that handles the change whenever state changes
  React.useEffect(() => {
    if (category === "") setCategory('estimatedInfections');
    if (currentUSState) {
      setImage(currentUSState[category].image);
      // Handles loading the content text into the modal window
      const loadText = async () => {
        setContentURL(currentUSState[category].text);
        try {
          let config = {
            method: 'get',
            url: contentURL
          }
          if (contentURL !== '') {
            let contentText = await axios(config);
            setContent(contentText.data);
          }
        } catch (err) {
          console.log(err);
          setContent('');
        }
      }
      loadText();
    }
  }, [category, currentUSState, content, contentURL]);

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
          <h1>{currentUSStateName} - {currentCategoryName}</h1>
          {/* Insert buttons that allow you to change the category and view the related category's contents */}
          {categoriesArr.map((item) => {
            return <button key={item} onClick={(() => setCategory(item))}>{Data.categories[item].name}</button>
          })}
        </div>
        <img className="modal-image" src={image} alt={location} />
        <div className="modal-content">
        {content || "No explanation yet..."}
        </div>
        <div className="modal-footer">
          <button onClick={handleClose}>Close</button>
        </div>
      </section>
    </div>
  )
};

const ModalForNation = ({ handleClose, show, type, url }) => {
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
          <h1>USA {type}</h1>
        </div>
        <img className="modal-image" src={url} alt={type} />
        <div className="modal-footer">
          <button onClick={handleClose}>Close</button>
        </div>
      </section>
    </div>
  )
};


export default App;
