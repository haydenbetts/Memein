import React from 'react';

const Landing = (props) => (
  <div>
    Hi this is the landing screen.
    <button onClick={() => props.changeView('lobby')}></button>
  </div>
)

export default Landing;