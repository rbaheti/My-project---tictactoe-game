import React, { Component } from 'react';
import './Game.css';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      gridValues: [['_', '_', '_'], 
                   ['_', '_', '_'],   
                   ['_', '_', '_']],
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

  handleOnClickGrid = (row, col) => {
    return () => { // anonymous arrow function
      const tempGridValues = this.state.gridValues.slice();
      console.log("tempGridValues: ", tempGridValues);

      if(tempGridValues[row][col] === '_') {
        tempGridValues[row][col] = 'X';
        this.setState({gridValue: tempGridValues});
      } else {
        return;
      }

      // check if X won
      if(this.checkIfWon('X', tempGridValues)) {
        console.log("You won!!!!!");
        return;
      }

      const updatedGridValues = this.computersNextMove(tempGridValues);
      this.setState({gridValue: updatedGridValues});
        
      // check if 'O' won
      if(this.checkIfWon('O', tempGridValues)) {
        console.log("Computer won!");
        return;
      }
    }
  }

  render() {
    const grid_rows = [];
    let value = 1;
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
