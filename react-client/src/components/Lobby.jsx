import React from 'react';

const Lobby = (props) => (
  <div>
    Hi this is the lobby.
    <button onClick={() => props.changeView('landing')}></button>
  </div>
)

export default Lobby;