import React, { Component } from 'react';
import './Game.css';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      gridValues: [[' ', ' ', ' '], 
                   [' ', ' ', ' '],   
                   [' ', ' ', ' ']],
      didWin: false,
      didTie: false,
      isComputerPlaying: false, // remember this so that user cannot interrupt even after clicking b4 computers move.
      winner: 'Its a draw!',
      numOfGridsFilled: 0,
      userScore: 0,
      computerScore: 0
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
    if(this.state.numOfGridsFilled === 9) {
      this.setState({didTie : true});
    }

    // Find a cell where 'O' can win.
    for(let row = 0; row < 3; ++row) {
      for(let col = 0; col < 3; ++col) {
        if(gridValues[row][col] === ' ') {
          gridValues[row][col] = 'O';
          if(this.checkIfWon('O', gridValues)) {
            gridValues[row][col] = 'O';
            this.setState({numOfGridsFilled: this.state.numOfGridsFilled+1});
            return gridValues;
          }
          gridValues[row][col] = ' ';
        }
      }
    }

    // Find a cell where 'X' can win.
    for(let row = 0; row < 3; ++row) {
      for(let col = 0; col < 3; ++col) {
        if(gridValues[row][col] === ' ') {
          gridValues[row][col] = 'X';
          if(this.checkIfWon('X', gridValues)) {
            gridValues[row][col] = 'O';
            this.setState({numOfGridsFilled: this.state.numOfGridsFilled+1});
            return gridValues;
          }
          gridValues[row][col] = ' ';
        }
      }
    }

    // Place 'O' anywhere.
    for(let row = 0; row < 3; ++row) {
      for(let col = 0; col < 3; ++col) {
        if(gridValues[row][col] === ' ') {
          gridValues[row][col] = 'O';
          this.setState({numOfGridsFilled: this.state.numOfGridsFilled+1});
          return gridValues;
        }
      }
    }
  }

  scheduleComputersMove = (tempGridValues) => {
    const updatedGridValues = this.computersNextMove(tempGridValues);
    this.setState({gridValue: updatedGridValues, isComputerPlaying: false});
      
    // check if 'O' won
    if(this.checkIfWon('O', tempGridValues)) {
      let score = this.state.computerScore;
      score += 1;
      this.setState({didWin: true, winner: 'computer', computerScore: score});
      return;
    }
  }

  handleOnClickGrid = (row, col) => {
    return () => { // anonymous arrow function
      // check if computer is playing. If yes, then user cannot interrupt.
      if(this.state.isComputerPlaying) {
        return;
      }

      // if anybody wins, reset the grid.
      if (this.state.didWin || this.state.didTie) {
        this.setState({didWin : false, didTie: false, isComputerPlaying: false, winner: 'Its a draw!', numOfGridsFilled: 0});
        let gridValues = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
        this.setState({gridValues});
        return;
      }

      // continue with other steps if computer is not playing
      const tempGridValues = this.state.gridValues.slice();
      console.log("tempGridValues: ", tempGridValues);

      // assign 'X' to the given grid
      if(tempGridValues[row][col] === ' ') {
        tempGridValues[row][col] = 'X';
        this.setState({gridValue: tempGridValues, numOfGridsFilled: this.state.numOfGridsFilled+1});
      } else {
        return;
      }

      // check if X won
      if(this.checkIfWon('X', tempGridValues)) {
        let score = this.state.userScore;
        score += 1;
        this.setState({didWin: true, winner: 'user', userScore: score});
        return;
      }

      // donot let user interrupt while computer is playing.
      this.setState({isComputerPlaying: true});

      // schedule computer's move
      setTimeout(function() {
        this.scheduleComputersMove(tempGridValues);
      }.bind(this), 100);
    }
  }

  render() {
    const grid_rows = [];
    let value = 1; // this value is used for setting unique key for each grid
    for(let row = 0; row < 3; ++row) {
      for(let col = 0; col < 3; ++col) {
        grid_rows.push(<div className="box" key={value} onClick={this.handleOnClickGrid(row, col)}>
        {this.state.gridValues[row][col]}
        </div>);
        ++value;
      }
    }

    let winTieDiv = <div></div>;
    if (this.state.didWin) {
      winTieDiv = <div className="footerDiv"><strong>{this.state.winner === "user" ? "You" : "Computer"} Won!</strong></div>;
    } else if (this.state.didTie) {
      winTieDiv = <div className="footerDiv"><strong>It was a tie!</strong></div>;
    }

    let winCounter = <div className="footerDiv"><strong>Your score: {this.state.userScore}&nbsp;&nbsp;Computer's score: {this.state.computerScore}</strong></div>;

    return (
      <div>
        <div className="game-board">
          {grid_rows}
        </div>
        {winCounter}
        {winTieDiv}
      </div>
    );
  }
}

export default Game;
