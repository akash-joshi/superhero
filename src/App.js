import React, { useState } from 'react';
import axios from 'axios';

import './index.css';

const Hero = props => (
  <>
  <h3>Hero Name : {props.hero.name}</h3>
  <h3>Real Name : {props.hero.biography.fullName}</h3>
  <h3>Born in : {props.hero.biography.placeOfBirth}</h3>
  <h3>Alignment : {props.hero.biography.alignment}</h3>
  <h3>He works as a {props.hero.work.occupation} from {props.hero.work.base}</h3>
  </>
)

function App() {

  const [hero,setHero] = useState('');

  function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  const searchHandle = async e => {
    e.preventDefault();
    const resp = await axios.get('https://akabab.github.io/superhero-api/api/all.json');
    const hero = document.querySelector("#hero").value;

    let foundData;
    resp.data.map( elem => {
      if((similarity(hero,elem.name)>=.8 || similarity(hero,elem.biography.fullName)>=.8) && !foundData) {
        foundData = elem;
      }
    });

    foundData ? setHero(foundData) : alert('Hero Not Found');
  }

  return (
    <div style={{textAlign: 'center'}}>
      <h4>Type the real name or superhero name of a Hero !</h4>
      <form onSubmit={e=>searchHandle(e)}>
      <input id="hero" type="text" /> <button type="submit">Search</button>
      </form>
      <br />
      {hero ? 
        <Hero hero={hero} />
        : 'Search for a hero above'}
    </div>
  );
}

export default App;
