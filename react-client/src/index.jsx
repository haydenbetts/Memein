import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import Landing from './components/Landing.jsx';
import Lobby from './components/Lobby.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'landing'
    }
    this.changeView = this.changeView.bind(this);
  }

  componentDidMount() {

  }


  changeView(option) {
    this.setState({
      view: option
    })
  }

  renderView() {
    const { view } = this.state;

    if (view === 'landing') {
      return <Landing changeView={this.changeView} />
    } else if (view === 'lobby') {
      return <Lobby changeView={this.changeView} />
    } else {
      return <div></div>
    }
  }

  render() {
    return (
      <div className="main">
        {this.renderView()}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('memein'));
