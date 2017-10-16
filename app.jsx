//React provides us declarative way of describing UI using javascript
//We describe our application entirely within our JavaScript files.
//This includes our application logic, our data and even our markup.
//A React component will create a representation of its markup in JavaScript
//This JavaScript representation of the DOM is called the virtual DOM in React.
//These virtual DOM objects are cheap and fast to use.

//JSX is an extension to the JavaScript language that allows us to use an XML style syntax to build our React.createElement calls.
//Component is a function that returns virtual DOM element

//Composition: A method of combining many smaller or simpler pieces to create a larger piece.
//Decompose: Break a large component in to smaller components that can be composed together.

//Stateless Functional Component: A component defined as a function. It takes only props as an argument and returns a virtual DOM.
//Component Class: A component definition that can include things like state, helper methods and other advanced hooks into the page’s DOM

//State that is data in our application that can change 
// getInitialState: Component method for defining the initial state of your component.
//Flux: A pattern for organizing your state in an application.
//Redux: A popular library for managing application state and state changes.


// Unidirectional Data Flow: All data in our applications flow in a single direction. 
// In React it flows down the tree from parent to child. 
// This makes tracking the source and destination easy compared to other architectures where data may be coming from many parts of the application.

// Application State: The state or data in our application that is core to the functionality of the application as a whole. (List of players, their scores)
// This usually includes a list of the models and data being manipulated by the interface. If we were to reload our application, the Application state is what we would like to persist the most
// It should be designed to manage as high as possible 

// Local Component State: This is state that is used to allow a component to function. (rely on to function)
// Local component state is typically not used by other components in the application, and is less important to persist if the application resets.

// Controlled Component: An input form is controlled when it’s value is passed to it by the parent component. 
// This requires us to update the passed value when it changes by listening for the onChange event of the input component.

var PLAYERS = [
  {
    name: "Jim Hoskins",
    score: 31,
    id: 1,
  },
  {
    name: "Andrew Chalkley",
    score: 35,
    id: 2,
  },
  {
    name: "Alena Holligan",
    score: 42,
    id: 3,
  },
];
var nextId = 4;

var Stopwatch = React.createClass({
  getInitialState: function() { //The data that appication will start from 
    return {
      running: false,
      elapsedTime: 0,
      previousTime: 0,
    }
  },
  
  componentDidMount: function() {//Notifies react of change in the dom
    this.interval = setInterval(this.onTick, 100);
  },
  
  componentWillUnmount: function() {
    clearInterval(this.interval);//This will safely clear up the timer so it will not keep running
  },
  
  onTick: function() {
    if (this.state.running) {
      var now = Date.now();
      this.setState({
        previousTime: now,
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime),
      });
    }
    console.log('onTick');
  },
  
  onStart: function() {
    this.setState({ 
      running: true,
      previousTime: Date.now(),
    });
  },
  
  onStop: function() {
    this.setState({ running: false });
  },
  
  onReset: function() {
    this.setState({
      elapsedTime: 0,
      previousTime: Date.now(),
    });
  },
  
  render: function() {
    var seconds = Math.floor(this.state.elapsedTime / 1000);
    return (//In JSX class are used as className
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">{seconds}</div>
        { this.state.running ? 
          <button onClick={this.onStop}>Stop</button> //This onClick method will be called when button is clicked
          : 
          <button onClick={this.onStart}>Start</button>
        } 
        <button onClick={this.onReset}>Reset</button>
      </div>
    );
  }
});
  
var AddPlayerForm = React.createClass({
  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
  },
  
  getInitialState: function() {
    return {
      name: "",
    };
  },
  
  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  
  onSubmit: function(e) {
    e.preventDefault();
  
    this.props.onAdd(this.state.name);
    this.setState({name: ""});
  },
  
  
  render: function() {
    return (
      <div className="add-player-form">
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.name} onChange={this.onNameChange} />
          <input type="submit" value="Add Player" />
        </form>
      </div>
    ); 
  }
});
// example for reduce 
// var total = [0, 1, 2, 3].reduce(function(sum, value) {
//   return sum + value;
// }, 0);
function Stats(props) {
  var totalPlayers = props.players.length;
  var totalPoints = props.players.reduce(function(total, player){//Reduce is gonna calculate the total players score
    return total + player.score;
  }, 0);
  
  return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Players:</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Total Points:</td>
          <td>{totalPoints}</td>
        </tr>
      </tbody>
    </table>
  )  
}
  
Stats.propTypes = {
  players: React.PropTypes.array.isRequired,
};

function Header(props) {
  return (
    <div className="header">
      <Stats players={props.players}/>
      <h1>{props.title}</h1>
      <Stopwatch />
    </div>
  );
}

Header.propTypes = { //Prop types can be checked to test type values being passed
  title: React.PropTypes.string.isRequired,//This properies are required 
  players: React.PropTypes.array.isRequired,
};
//There also default properties could be provided with 

function Counter(props) {
  return (//when button is clicked onChange method will be called to change the state of the application
    <div className="counter">
      <button className="counter-action decrement" onClick={function() {props.onChange(-1);}} > - </button>
      <div className="counter-score"> {props.score} </div>
      <button className="counter-action increment" onClick={function() {props.onChange(1);}}> + </button>
    </div>
  );
}
  
Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
}

function Player(props) {
  return (
    <div className="player">
      <div className="player-name">
        <a className="remove-player" onClick={props.onRemove}>✖</a>
        {props.name}
      </div>
      <div className="player-score">
        {/* Counter component was created at the top and used down here */}
        <Counter score={props.score} onChange={props.onScoreChange} /> 
      </div>
    </div>
  );
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onScoreChange: React.PropTypes.func.isRequired,
  onRemove: React.PropTypes.func.isRequired,
};



var Application = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({//Initial players are being type checked "shape = is how many properties will that object will have "
      name: React.PropTypes.string.isRequired,
      score: React.PropTypes.number.isRequired,
      id: React.PropTypes.number.isRequired,
    })).isRequired,
  },

  getDefaultProps: function() {
    return {
      title: "Scoreboard",
    }
  },
  
  getInitialState: function() {
    return {
      players: this.props.initialPlayers,
    };
  },
  
  onScoreChange: function(index, delta) {// setState should always be called 
    this.state.players[index].score += delta;
    this.setState(this.state);
  },
    
  onPlayerAdd: function(name) {
    this.state.players.push({
      name: name,
      score: 0,
      id: nextId,
    });
    this.setState(this.state);
    nextId += 1;
  },
    
  onRemovePlayer: function(index) {
    this.state.players.splice(index, 1);
    this.setState(this.state);
  },
  
  render: function() {
    return (
      <div className="scoreboard">
        <Header title={this.props.title} players={this.state.players} />
      
        <div className="players">
          {this.state.players.map(function(player, index) {//Map function are used to loop through the collection in JSX
            return (//index is a property of map() function and it is a index which is itirating over
              <Player 
                onScoreChange={function(delta) {this.onScoreChange(index ,delta)}.bind(this)}
                onRemove={function() {this.onRemovePlayer(index)}.bind(this)}
                name={player.name} 
                score={player.score} 
                key={player.id} />//Key is required to React differentiate the doms and know which doms are changed
            );//bind(this) is called when this inside a function this apply to the outer this function
          }.bind(this))}
        </div>
        <AddPlayerForm onAdd={this.onPlayerAdd} />
      </div>
    );
  }
});  



ReactDOM.render(<Application initialPlayers={PLAYERS}/>, document.getElementById('container'));