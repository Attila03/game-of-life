import React,  { Component } from 'react';
import styled from  'styled-components';

import Cell from './Cell';

const StyledGame = styled.div`
  margin: 20px;

  .controls {
    text-align: center;
  }

  button {
    display: inline-block;
    width: 110px;
    height: 40px;
    margin: 20px;
    border: none;
    background: crimson;
    color: white;
    font-size: 18px;
    box-shadow: 1px 1px 5px black;
  }

  button:hover {
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.8;
  }

  button:disabled:hover {
    cursor: not-allowed;
  }

  label {
    color: darkred;
  }

  .grid-row {
    width: 50px;
    height: 25px;
    margin-right: 15px;
    text-align: center;
  }

  .grid-column {
    width: 50px;
    height: 25px;
    margin-right: 15px;
    text-align: center;
  }

  .generation_count {
    text-align: center;
    margin: 10px;
  }

  .main_grid {
    display: grid;
    margin: auto;
    width: ${props => `${props.dimension.column*11}px`};
    height: ${props => `${props.dimension.row*11}px`};
    grid-template-columns: ${props => `repeat(${props.dimension.column}, 11px)`};
    grid-template-rows: ${props => `repeat(${props.dimension.row}, 11px)`};
    border: 10px solid grey;
    border-radius: 8px;
  }
`

let interval;


class Game extends Component {

  state = {
    grid: null,
    dimension: {
      row: 50,
      column: 80
    },
    running: false
  }

  componentDidMount () {

    let grid = this.generateRandomGrid(this.state.dimension.row, this.state.dimension.column)

    this.setState({grid: grid})
  }

  generateRandomGrid = (row, column) => {
    
    let grid = new Array(row).fill(null).map(() => {
      return Array(column).fill(null).map(() => Math.random() < 0.85 ? 0 : 1)
    })

    return grid
  }

  setGrid = (event) => {
    event.preventDefault();
    let row = this.row.value ? +this.row.value : 20;
    let column = this.column.value ? +this.column.value: 20;
    let grid = this.generateRandomGrid(row, column)
    this.setState({grid: grid, dimension: {row: row, column: column}})
  }

  startStopHandler = () => {

    if (this.state.running) {
      clearInterval(interval);
      interval = undefined;
    }
    this.setState(prevState => {
      return {running: !prevState.running}
    })
  }

  clearHandler = () => {
    let {row, column} = this.state.dimension
    
    let grid = new Array(row).fill(null).map(() => {
      return Array(column).fill(0)
    })
    this.setState({grid: grid})
  }

  countNeighbours = (i,j) => {
    let neighbours = [[i-1, j-1], [i-1, j], [i-1, j+1], [i, j-1], [i, j+1], [i+1, j-1], [i+1, j], [i+1, j+1]]
    let count = 0;

    for(let pair of neighbours) {
       count += ( this.state.grid[pair[0]] &&  ( this.state.grid[pair[0]][pair[1]] === 1) ) ? 1 : 0
    }

    return count;
  }

  updateGrid = (i, j) => {
    if (this.state.running && interval) {
      clearInterval(interval);
      interval=undefined;
    }
    this.setState(prevState => {
      return {
        grid: [
          ...prevState.grid.slice(0, i), 
          [...prevState.grid[i].slice(0, j), prevState.grid[i][j] === 1 ? 0 : 1, ...prevState.grid[i].slice(j+1, )],
          ...prevState.grid.slice(i+1,)]
      }
    })
  }

  shouldBeAlive = (i, j) => {
    let count = this.countNeighbours(i, j);
    switch (this.state.grid[i][j]) {
      case 1:
        return count === 2 || count === 3 ? true : false
      case 0:
        return count === 3 ? true : false
      default:
        return
    }
  }

  generateNextGen = () => {

    let {row, column} = this.state.dimension
    let nextGen = new Array(row).fill(null).map(() => Array(column).fill(0))
    for (let i = 0;i<row;i++){
      for (let j = 0;j<column;j++) {
        if (this.shouldBeAlive(i,j)) nextGen[i][j] = 1
      }
    }
    
    this.setState({grid: nextGen})
  }


  render () {

    // let t0 = performance.now()
    let cells = null

    if (this.state.grid) {

      let {row, column} = this.state.dimension
      
      cells = new Array(row).fill(null).map(() => [])

      for (let i = 0; i<row;i++) {
        for (let j = 0; j<column;j++) {
          cells[i][j] = <Cell
                          // onClick={ () => this.updateGrid(i, j) }
                          onClick = {this.updateGrid}  
                          x = {i}
                          y = {j}
                          alive={this.state.grid[i][j] === 1 ? true: false} 
                          key={`${i}${j}`}/>
        }
      }
    }

    // let t1 = performance.now()

    // console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate.');



    if (this.state.running && !interval) {
      interval = setInterval(this.generateNextGen, 200);
    }

  
    return (
      <div>
        
        <StyledGame dimension={this.state.dimension}>
          <div className='controls'>
            <button onClick={this.generateNextGen} disabled={this.state.running}>NEXT GEN</button>
            <button onClick={this.startStopHandler}>{this.state.running ? 'STOP' : 'START'}</button>
            {/* <button onClick={this.pauseHandler}>PAUSE</button> */}
            <button onClick={this.clearHandler} disabled={this.state.running}>CLEAR</button>
            <div>
              <form onSubmit={this.setGrid}>
                <label>
                  ROWS: 
                  <input 
                    type='number' 
                    className='grid-row' 
                    ref={(input) => { this.row = input; }} 
                    max="100" 
                    min="1"/>
                </label>
                <label>
                  COLUMNS: 
                  <input 
                    type='number' 
                    className='grid-column' 
                    ref={(input) => { this.column = input; }} 
                    max="100" 
                    min="1"/>
                </label>
                <button disabled={this.state.running} type='submit'>SET GRID</button>
              </form>
            </div>
          </div>
          <div className='main_grid'>{cells}</div>
        </StyledGame>
      </div>
      
    )
  }
}

export default Game;