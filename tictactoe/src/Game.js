import React, { Component } from 'react';
import './Game.css';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      gridNumList: [],
      gridValue: '_',
      gridRowIndex: -1,
      gridColIndex: -1
    };
  }

  handleAddGridValue = () => {
    // Create an object with 2 properties id and title.
    // id assigns a unique id to a newTodo.
    // title holds the text of the newTodo.
    const newGrid = {};
    newGrid['id'] = this.state.gridNumList.length;
    newGrid['value'] = this.state.gridValue;

    // Create an array newTodoList.
    // push the value of new todo item to this array
    const newGridNumList = this.state.gridNumList;
    newGridNumList.push(newGrid);
    this.setState({ gridNumList:newGridNumList, gridValue: '_' });  
  };

  render() {
    const grid_rows = [];
    let value = 1;
    for(let row = 0; row < 3; ++row) {
      for(let col = 0; col < 3; ++col) {
        grid_rows.push(<div className="grid-item">{'_'}</div>);
        ++value;
      }
    }
    return (
      <div className="grid-container">
        <div className="grid">
          {grid_rows}
          <input onClick={this.createUser} />
        </div>
      </div>
    );
  }
}

export default Game;
