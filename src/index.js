import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]}
                   onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
    this.handleClick = this.handleClick.bind(this);
    this.getSquaresFromHistory = this.getSquaresFromHistory.bind(this);
    this.getLastSqures = this.getLastSqures.bind(this);
    this.jumpTo = this.jumpTo.bind(this);
  }

  getSquaresFromHistory(num_step) {
    if (num_step > this.state.history.length - 1) {
      return;
    }
    return this.state.history[num_step].squares.slice();
  }

  getLastSqures() {
    return this.getSquaresFromHistory(this.state.history.length - 1);
  }

  getCurrentStepSquares() {
    return this.getSquaresFromHistory(this.state.stepNumber);
  }

  jumpTo(stepNumber) {
    this.setState({
      history: this.state.history.filter((step, move) => move <= stepNumber),
      stepNumber: stepNumber,
      xIsNext: (stepNumber % 2) === 0,
    });
  }

  handleClick(i) {
    const squares = this.getCurrentStepSquares();
    if (squares[i] != null) return;
    if (calculateWinner(squares) != null) return;
    squares[i] = (this.state.xIsNext ? 'X' : 'O');
    this.setState({
      history: this.state.history.concat([{
        squares: squares,
      }]),
      stepNumber: this.state.stepNumber + 1,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const squares = this.getCurrentStepSquares();
    const winner = calculateWinner(squares);

    const moves = this.state.history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move : 
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
