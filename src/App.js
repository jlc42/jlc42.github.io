import React from 'react';
import './App.scss';
import { Route, Switch, Link } from 'react-router-dom';
import sanitizeHtml from 'sanitize-html';
import { DateTime } from 'luxon';
import axios from 'axios';
import Data from './App.json';
import * as d3 from 'd3';

import usStates from './usStates.json';

import ScrollToTop from './components/ScrollToTop.js';

import darrenPic from './images/dkstoll.jpg';
import jamesPic from './images/jlcarroll.jpg';

// GOAL:
// There are two different issues, a "what do we do quickly for now" and a "what will this look like longer term".

// For now, I think we need a place-holder front page, with a link to the blog with my daily updates... and then some sort of auto-index (possibly with thumbnails) so people can get to the existing figures, which currently include testing/case data for each state, with the scale set so that if the testing data goes above the case data, you have a larger than 10% positivity rate. So... the goal would be to keep the cases line below the testing line in the graphs, when they are inverted, a state is in trouble.  So beyond just a directory listing, there should be SOME description of that that goes with the figures. I also have figures for a run of rt.live's algorithm, but on the whole us instead of a per/state level, which they don't do. So it would be nice to give a link to that as well.

// But as time goes on I hope to add many different additional views for each state. I'm hoping to add things like % tests positive, and then the really interesting things... using a full Hierarchical Bayesian Model to estimate how many have actually been infected/are currently infected with good uncertainty bounds...Then I might possibly expand some of this to other countries. 

// So eventually, we would need something flexible that will give a reasonable ui so people can choose what figures / data they want to view, from a rather long list of options... while making sure it all makes sense. 

// Honestly, I have no idea what the best way is to arrange all that, nor have I kept up with HTML and the various scripting tools people use these days (thus my call for help). 

const App = () => {
  return (
    <Switch>
      <ScrollToTop>
        <Route exact path="/" component={Figures} />
        <Route path="/news" component={News} />
        <Route path="/about" component={AboutPage} />
        <Route path="/credits" component={Credits} />
      </ScrollToTop>
    </Switch>
  );
}

// Component that contains info that the viewer will first see
const AboutPage = () => {
  // Once we have a host with its own backend, we can use api keys to retrieve blog information

  return (
    <>
      <Navbar />
      <div id="about">
        <a className="button" href="https://covid-19watch.blogspot.com/" rel="noopener noreferrer" target="_blank">Link to blog</a>
        <p>This site contains the up-to-date data about COVID-19 in the US.</p>
      </div>
    </>
  )
}

// Component that contains the navbar
const Navbar = () => {
  return (
    <header>
      <nav id="navbar">
        <ul>
          <Link className="nav-link" to="/"><li>Map & Figures</li></Link>
          <Link className="nav-link" to="/news"><li>News</li></Link>
          <Link className="nav-link" to="/about"><li>About</li></Link>
          <Link className="nav-link" to="/credits"><li>Credits</li></Link>
        </ul>
      </nav>
    </header>
  )
}

// Component that holds the figures
const Figures = () => {
  // State hook that holds the modal boolean, whether or not it shows up
  const [modal, setModal] = React.useState(false);
  // State hook that holds the current US state being viewed
  const [USState, setUSState] = React.useState('');

  return (
    <>
      <Navbar />
      <div id="figures">
        <h1>COVID-19 Watch</h1>
        <div id="USAFigs" className="USAFigs">
          <USAFigs />
        </div>
        <h2>Select a state...</h2>
        
        {/* https://websitebeaver.com/how-to-make-an-interactive-and-responsive-svg-map-of-us-states-capitals */}
        <USAMap modal={modal} setModal={setModal} USState={USState} setUSState={setUSState} />
        <Modal 
          show={modal} 
          handleClose={() => {
            setModal(!modal);
            }
          }
          location = {USState} 
          content="Content"
        />
        
      </div>
    </>
  )
}

// Component that returns the USA figures
const USAFigs = () => {
  // State hook that holds the modal boolean, whether or not it shows up
  const [modal, setModal] = React.useState(false);
  // State hook to hold which type of RT that is being passed
  const [category, setCategory] = React.useState('');
  // State hook to hold the URL of the image
  const [image, setImage] = React.useState('');

  return (
    <>
      <button className="chartButton" onClick={() => {setModal(!modal)}}>
        Overall USA Statistics
      </button>
      <ModalForNation
        show={modal} 
        handleClose={() => {
          setModal(!modal);
          setCategory('');
          setImage('');
          }
        }
        location="USA"
        type={category}
        url={image}
      />
    </>
  )
}

// Tooltip declared outside of component to avoid duplication
var tooltip = d3.select("body")
 .append("div")
 .attr("class", "tooltip")               
 .style("visibility", "hidden");

// Component that colors the US map based on data provided
const USAMap = ({ modal, setModal, USState, setUSState }) => {
  // Legend keys
  const rtLegend = [">1.10", ">1.02", "between", "<0.98", "<0.95"];
  const infLegend = [">1%", ">0.75%", ">0.50%", ">0.25%", "<=0.25%"];

  // React hook that determines which active dataset is showing for the colors on the map
  const [activeMap, setActiveMap] = React.useState(false);
  // React hook for storing the associated legends with the active dataset
  const [legend, setLegend] = React.useState(infLegend);
  // React hook for legend title
  const [legendTitle, setLegendTitle] = React.useState("actively infected");

  const svgRef = React.useRef();
  
  // Function to convert csv to JSON, specific for this project - http://techslides.com/convert-csv-to-json-in-javascript
  const csvJSON = (csv) => {
    var lines = csv.split("\n");

    var result = [];

    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

      var obj = {}, innerObj = {};
      var currentline=lines[i].split(",");
      for(var j=1;j<headers.length;j++){
        innerObj[headers[j]] = currentline[j];
      }
      obj[currentline[0]] = innerObj;
      result.push(obj);
    }

    //return result; //JavaScript object
    return JSON.parse(JSON.stringify(result)); //JSON

  }

  // Get the current colors for each state to use for fill
  // Colors: Red, Orange, Yellow,  Green, Bright-Green
  let statusIndicator = ["#cc0000", "#ffa500", "#cccc00", "#00cc00", "#66ff00"];
  
  // Build the map using d3 and the fill colors from the rt data
  React.useEffect(() => {
    //Width and height of map
    console.log(d3.select("#map").style("width"));
    var width = parseInt(d3.select("#map").style("width"));
    var height = width * 0.5;

    // D3 Projection
    var projection = d3.geoAlbersUsa()
              .translate([width/2, height/2])    // translate to center of screen
              .scale([width]);          // scale things down so see entire US
            
    // Define path generator
    var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
            .projection(projection);  // tell path generator to use albersUsa projection

    var svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.select(".legendTitle").remove();
    svg.selectAll(".dots").remove();
    svg.selectAll('.labels').remove();

    // Build the legend
    svg.append("text")
      .text(legendTitle)
      .attr("class", "legendTitle")
      .attr("x", width - 130)
      .attr("y", height - 170)
      .style("font-weight", "bold")

    svg.selectAll(".dots")
      .data(legend)
      .enter()
      .append("circle")
      .attr('class', 'dots')
      .attr("r", 7)
      .attr("cx", width - 100)
      .attr("cy", (d,i) => (height - 150) + i*25)
      .style("fill", (d,i) => statusIndicator[i]);

    svg.selectAll(".labels")
      .data(legend)
      .enter()
      .append("text")
      .attr('class', 'labels')
      .attr("x", width - 80)
      .attr("y", (d,i)=>  (height - 150) + i*25)
      .text(d => d)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

    const createMapWithColors = async () => {
      let usStatesAll = usStates.features;

      // Map color and properties for rt
      try {
        let config = {
          method: 'get',
          url: 'https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/rt_live_code_figs/masterRt.csv'
        }
        let rtData = csvJSON((await axios(config)).data);
        for (let i = 0; i < rtData.length; i++) {
          let currentState = Object.keys(rtData[i])[0];
          
          let currentRt = rtData[i][currentState].Mean;
          let rtColor;
          if (currentRt > 1.1) rtColor = statusIndicator[0];
          else if (currentRt > 1.02) rtColor = statusIndicator[1];
          else if (currentRt < 0.95) rtColor = statusIndicator[4];
          else if (currentRt < 0.98) rtColor = statusIndicator[3];
          else rtColor = statusIndicator[2];

          let existingUSStateInJSON = usStatesAll.find(e => e.properties.abbr === currentState);

          if (existingUSStateInJSON) {
            Object.assign(usStatesAll[usStatesAll.findIndex(x => x.id === existingUSStateInJSON.id)].properties, {rtfill: rtColor}, {rt: currentRt});
          }
        }
      } catch (err) {
        console.log(err);
      }

      // Map color and properties for percent infected
      try {
        let config = {
          method: 'get',
          url: 'https://raw.githubusercontent.com/jlc42/jlc42.github.io/master/figs/PercentActive/masterPercentInfected.csv'
        }
        let infectedData = csvJSON((await axios(config)).data);
        for (let i = 0; i < infectedData.length; i++) {
          let currentState = Object.keys(infectedData[i])[0].slice(0,2);
          
          let currentInfected = infectedData[i][Object.keys(infectedData[i])[0]].Mean;

          let infectedColor;
          if (currentInfected > .01) infectedColor = statusIndicator[0];
          else if (currentInfected > .0075) infectedColor = statusIndicator[1];
          else if (currentInfected > .0050) infectedColor = statusIndicator[2];
          else if (currentInfected > .0025) infectedColor = statusIndicator[3];
          else infectedColor = statusIndicator[4];

          let existingUSStateInJSON = usStatesAll.find(e => e.properties.abbr === currentState);

          if (existingUSStateInJSON) {
            Object.assign(usStatesAll[usStatesAll.findIndex(x => x.id === existingUSStateInJSON.id)].properties, {infectedfill: infectedColor}, {infected: (currentInfected * 100)});
          }
        }
      } catch (err) {
        console.log(err);
      }

      // 50 States path creation
      svg.selectAll("path")
      .data(usStatesAll)
      .enter()
      .append("path")
      .attr("class", d => "state" + d.properties.abbr)
      .attr("d", path)
      .attr("data-stateabbr", (d) => d.properties.abbr)
      .attr("data-state", (d) => d.properties.name)
      .attr("data-rt", d => d.properties.rt)
      .attr("data-infected", d=> d.properties.infected)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", (d) => d.properties.infectedfill)

      .on("mousemove", (d) => {
        tooltip.html("<p>" + d.target.dataset.state + "<br />% actively infected: " + parseFloat(d.target.dataset.infected).toFixed(2) + "<br />rt: " + parseFloat(d.target.dataset.rt).toFixed(4) + "%</p>")
          .style("left", (d.x + 18) + "px")
          .style("top", (d.y - 28) + "px")
          .style("visibility", "visible")
      })
      .on("mouseout", (d) => {
        tooltip
          .style("visibility", "hidden")
      })
      .on("click", (d) => {
        setModal(!modal);
        setUSState(d.target.dataset.stateabbr);
      });

    
    // Insert DC as a circle
    if (d3.selectAll(".stateDC").size() === 1) {
      svg.selectAll("svg")
      .data([usStatesAll.find(e => e.id === "11")])
      .enter()
      .append("circle")
      .attr("class", d => "state" + d.properties.abbr)
      .attr("data-stateabbr", (d) => d.properties.abbr)
      .attr("data-state", (d) => d.properties.name)
      .attr("data-rt", d => d.properties.rt)
      .attr("data-infected", d=> d.properties.infected)
      .attr("cx", width * 0.76)
      .attr("cy", height * 0.44)
      .attr("r", () => {
        if (width * 0.005 > 1) return width * 0.005;
        else return 1;
      })
      .style("fill", (d) => d.properties.infectedfill)
      .style("stroke", "white")
      .style("stroke-width", "2")

      .on("mousemove", (d) => {
        tooltip.html("<p>" + d.target.dataset.state + "<br />% actively infected: " + parseFloat(d.target.dataset.infected).toFixed(2) + "<br />rt: " + parseFloat(d.target.dataset.rt).toFixed(4) + "%</p>")
          .style("left", (d.x + 18) + "px")
          .style("top", (d.y - 28) + "px")
          .style("visibility", "visible")
      })
      .on("mouseout", (d) => {
        tooltip
        .style("visibility", "hidden")
      })
      .on("click", (d) => {
        setModal(!modal);
        setUSState(d.target.dataset.stateabbr);
      });
    }
    

    // Toggles between map displays for either rt or infected percent
    if (d3.select(".toggle").empty()) {
      d3.select("#figures")
      .append("button")
      .attr("class", "toggle chartButton")
      .text("Toggle Map Display")
    }

    d3.select(".toggle")
      .on("click", () => {
        setActiveMap(!activeMap);
        if (activeMap) {
          setLegendTitle("actively infected")
          setLegend(infLegend);
        }
        else {
          setLegendTitle("rt")
          setLegend(rtLegend);
        }
        for (let i = 0; i < usStatesAll.length; i++) {
          let currentState = usStatesAll[i].properties;
          let usStateId = ".state" + currentState.abbr;
          if (activeMap) {
            d3.selectAll(usStateId)
              .style("fill", currentState.infectedfill);
          }
          else {
            d3.selectAll(usStateId)
              .style("fill", currentState.rtfill);
          }
        }
      });
    
    }
    createMapWithColors();
    const resize = () => {
      width = parseInt(d3.select("#map").style("width"));
      height = width * 0.5;

      projection.translate([width/2, height/2])
        .scale([width]);
      
      d3.select("#mapContainer")
        .style('width', d3.select("#mapContainer").style("width"))
      
      d3.select("#map")
        .style('width', width + 'px')

    }
    d3.select(window).on('resize', resize);
  });
  

  return (
    <div id="mapContainer">
      <svg id="map" ref={svgRef}></svg>
    </div>
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
    if (category === "") setCategory('percentInfected');
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
          <div className="modal-buttons">
            {categoriesArr.map((item) => {
              return <button key={item} class="chartButton" onClick={(() => setCategory(item))}>{Data.categories[item].name}</button>
            })}
          </div>
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

  // State hook that holds the current category being viewed
  const [category, setCategory] = React.useState('percentInfected');
  // State hook that handles current image
  const [image, setImage] = React.useState('');
  // State hook that handles current text content
  const [content, setContent] = React.useState('');
  // State hook that handles current text content url
  const [contentURL, setContentURL] = React.useState('');
  
  let USAData = Data.states["USA"];

  let categoriesArr = [];

  for (let val in Data.categories) {
    categoriesArr.push(val);
  }

  let currentCategoryName = Data.categories[category].name;

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

    // useEffect hook that handles the change whenever state changes
    React.useEffect(() => {
      if (USAData) {
        setImage(USAData[category].image);
        // Handles loading the content text into the modal window
        const loadText = async () => {
          setContentURL(USAData[category].text);
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
    }, [category, USAData, content, contentURL]);

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <span className="close" onClick={handleClose}>&times;</span>
        <div className="modal-header">  
          <h1>USA - {currentCategoryName}</h1>
          {/* Insert buttons that allow you to change the category and view the related category's contents */}
          {categoriesArr.map((item) => {
            return <button key={item} onClick={(() => setCategory(item))}>{Data.categories[item].name}</button>
          })}
        </div>
        <img className="modal-image" src={image} alt="USA" />
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

const News = () => {
  const [newsfeed, setNewsfeed] = React.useState([]);
  React.useEffect(() => {
    const retrieveBlog = async () => {
      try {
        let config = {
          method: 'get',
          url: "https://api.rss2json.com/v1/api.json?rss_url=https://covid-19watch.blogspot.com/feeds/posts/default?alt=rss"
        }
        let res = await axios(config);
        setNewsfeed([
          res.data.items[0],
          res.data.items[1],
          res.data.items[2]
        ])
      } catch (err) {
        console.log(err);
      }
    }
    retrieveBlog();
  },[])

  return (
    <>
      <Navbar />
      <div id="news">
        {newsfeed.map(item => {
          let dt = DateTime.fromSQL(item.pubDate);
          
          let sanitizedContent = sanitizeHtml(item.content, 
            {
              allowedTags: ['p','img','span','br','div','a','h2']
            });
          
          return(
            <div key={item.link} className="newsItemContainer">
              <a href={item.link} target="_blank" rel="noopener noreferrer"><h1>{item.title}</h1></a>
              <h5>{dt.toLocaleString(DateTime.DATETIME_FULL)}</h5>
              <div dangerouslySetInnerHTML={{__html: sanitizedContent}}></div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// Component that has information on all the people who contributed to this project
const Credits = () => {
  return (
    <>
      <Navbar />
        
      <div id="credits">
        <h2>Credits</h2>
        <div className="creditContainer">
          <div className="creditImageContainer"><img src={jamesPic} alt="James" style={{objectPosition:"50% 35%"}} /></div>
          <div className="creditInfo">
            <h3>James L Carroll</h3>
            <h4>"The One in Charge"/Data Specialist</h4>
            <p>James Carroll has a PhD in statistical machine learning, with a minor in Ancient Near Eastern history from Brigham Young University, and is currently a scientist at Los Alamos National Laboratory working in complex data analysis and uncertainty quantification.</p>
          </div>
        </div>
        <div className="creditContainer">
        <div className="creditImageContainer"><img src={darrenPic} alt="Darren" /></div>
          <div className="creditInfo">
            <h3>Darren Stoll</h3>
            <h4>Front-end Site Manager</h4>
            <p>Darren is the one that makes the info show up on a nice, orderly website. He is a front-end software engineer.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
