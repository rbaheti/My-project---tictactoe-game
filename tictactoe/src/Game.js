import React, { Component } from 'react';
import './Game.css';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      gridValues: [['_', '_', '_'], 
                   ['_', '_', '_'],   
                   ['_', '_', '_']],
      didWin: false,
      isComputerPlaying: false, // remember this so that user cannot interrupt even after clicking b4 computers move.
    };
  }

  checkIfWon = (value, gridValues) => {
    // check rows
    let didWin = 0;
    for(let row = 0; row < 3; ++row) {
      for(let col = 0; col < 3; ++col) {
        if(gridValues[row][col] === value) {
          didWin++;
          if(didWin === 3) 
            return true;
          continue;
        } else {
          didWin = 0;
          break;
        }
      }
    }
    // check columns
    for(let col = 0; col < 3; ++col) {
      for(let row = 0; row < 3; ++row) {
        if(gridValues[row][col] === value) {
          didWin++;
          if(didWin === 3) 
            return true;
          continue;
        } else {
          didWin = 0;
          break;
        }
      }
    }
    // check diagonally
    if(gridValues[0][0] === value && gridValues[1][1] === value && gridValues[2][2] === value)
      return true;
    if(gridValues[0][2] === value && gridValues[1][1] === value && gridValues[2][0] === value)
      return true;
    // return false if 'value' didn't win
    return false;
  }

  computersNextMove = (gridValues) => {
    // Find a cell where 'O' can win.
    for(let row = 0; row < 3; ++row) {
      for(let col = 0; col < 3; ++col) {
        if(gridValues[row][col] === '_') {
          gridValues[row][col] = 'O';
          if(this.checkIfWon('O', gridValues)) {
            gridValues[row][col] = 'O';
            return gridValues;
          }
          gridValues[row][col] = '_';
        }
      }
    }

    // Find a cell where 'X' can win.
    for(let row = 0; row < 3; ++row) {
      for(let col = 0; col < 3; ++col) {
        if(gridValues[row][col] === '_') {
          gridValues[row][col] = 'X';
          if(this.checkIfWon('X', gridValues)) {
            gridValues[row][col] = 'O';
            return gridValues;
          }
          gridValues[row][col] = '_';
        }
      }
    }

    // Place 'O' anywhere.
    for(let row = 0; row < 3; ++row) {
      for(let col = 0; col < 3; ++col) {
        if(gridValues[row][col] === '_') {
          gridValues[row][col] = 'O';
          return gridValues;
        }
      }
    }
  }

  scheduleComputersMove = (tempGridValues) => {
    // remembering if computer is playing so that if the user clicks on grids randomly, before computer plays,
    // the game doesn't get affected by it.
    this.setState({isComputerPlaying: false});

    const updatedGridValues = this.computersNextMove(tempGridValues);
    this.setState({gridValue: updatedGridValues});
      
    // check if 'O' won
    if(this.checkIfWon('O', tempGridValues)) {
      console.log("Computer won!");
      this.setState({didWin: true});
      return;
    }
  }

  handleOnClickGrid = (row, col) => {
    return () => { // anonymous arrow function
      // check if computer is playing. If yes, then user cannot interrupt.
      if(this.state.isComputerPlaying) {
        return;
      }

      // continue with other steps if computer is not playing
      const tempGridValues = this.state.gridValues.slice();
      console.log("tempGridValues: ", tempGridValues);

      // if anybody wins, disable clicking any grid
      if(this.state.didWin) {
        return;
      }

      // assign 'X' to the given grid
      if(tempGridValues[row][col] === '_') {
        tempGridValues[row][col] = 'X';
        this.setState({gridValue: tempGridValues});
      } else {
        return;
      }

      // check if X won
      if(this.checkIfWon('X', tempGridValues)) {
        console.log("You won!!!!!");
        this.setState({didWin: true});
        return;
      }

      // donot let user interrupt while computer is playing.
      this.setState({isComputerPlaying: true});

      // schedule computer's move after 1 second
      setTimeout(function() {
        this.scheduleComputersMove(tempGridValues);
      }.bind(this), 1000);
    }
  }

  render() {
    const grid_rows = [];
    let value = 1; // this value is used for setting unique key for each grid
    for(let row = 0; row < 3; ++row) {
      for(let col = 0; col < 3; ++col) {
        grid_rows.push(<div key={value} onClick={this.handleOnClickGrid(row, col)} 
          className="grid-item" >{this.state.gridValues[row][col]}</div>);
        ++value;
      }
    }

    return (
      <div className="grid-container">
        <div className="grid">
          {grid_rows}
        </div>
      </div>
    );
  }
}

export default Game;
