// src/components/Grid.js
import React, { useState } from 'react';
import './Grid.css';
import Cell from './Cell';
import carImage from '../assets/car.png';

const GRID_SIZE = 50;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

const Grid = () => {
  const [clickedCells, setClickedCells] = useState(new Array(TOTAL_CELLS).fill(false));
  const [carPosition, setCarPosition] = useState(null);
  const [path, setPath] = useState([]);
  const [message, setMessage] = useState('');
  const [isExploring, setIsExploring] = useState(false);

  const handleCellClick = (index) => {
    const newClickedCells = [...clickedCells];
    newClickedCells[index] = !newClickedCells[index];
    setClickedCells(newClickedCells);
  };

  const handleButtonClick = () => {
    const startCell = findStartCell();
    const endCell = findEndCell();

    if (startCell === null || endCell === null) {
      alert('Invalid start or end cell');
      return;
    }

    setIsExploring(true);
    setMessage('');
    setPath([]); // Reset path
    explore(startCell, endCell);
  };

  const findStartCell = () => {
    for (let i = 0; i < GRID_SIZE; i++) {
      if (!clickedCells[i]) {
        return i;
      }
    }
    return null;
  };

  const findEndCell = () => {
    for (let i = TOTAL_CELLS - GRID_SIZE; i < TOTAL_CELLS; i++) {
      if (!clickedCells[i]) {
        return i;
      }
    }
    return null;
  };

  const explore = (start, end) => {
    const visited = new Array(TOTAL_CELLS).fill(false);
    const stack = [[start, []]];

    const animate = () => {
      if (!isExploring) return;

      if (stack.length === 0) {
        setIsExploring(false);
        setMessage('No path found');
        return;
      }

      const [current, currentPath] = stack.pop();
      visited[current] = true;

      // Update the path
      setPath(currentPath.concat(current));
      setCarPosition(current);

      if (current === end) {
        setIsExploring(false);
        setMessage('Car Reached its Destination');
        return;
      }

      const neighbors = getNeighbors(current, GRID_SIZE, GRID_SIZE);
      for (const neighbor of neighbors) {
        if (!visited[neighbor] && !clickedCells[neighbor]) {
          stack.push([neighbor, currentPath.concat(current)]);
        }
      }

      setTimeout(animate, 150); // Continue animation
    };

    animate();
  };

  const getNeighbors = (cell, rows, cols) => {
    const neighbors = [];
    const row = Math.floor(cell / cols);
    const col = cell % cols;

    if (row > 0) neighbors.push(cell - cols);
    if (row < rows - 1) neighbors.push(cell + cols);
    if (col > 0) neighbors.push(cell - 1);
    if (col < cols - 1) neighbors.push(cell + 1);

    return neighbors;
  };

  const cells = [];
  for (let i = 0; i < TOTAL_CELLS; i++) {
    cells.push(
      <Cell
        key={i}
        isClicked={clickedCells[i]}
        onClick={() => handleCellClick(i)}
        isStart={i === findStartCell()}
        isEnd={i === findEndCell()}
      />
    );
  }

  return (
    <div className="grid-container">
      <div className="grid">
        {cells}
        {carPosition !== null && (
          <img
            src={carImage}
            alt="Car"
            className="car"
            style={{
              top: `${Math.floor(carPosition / GRID_SIZE) * 20}px`,
              left: `${(carPosition % GRID_SIZE) * 20}px`,
              position: 'absolute',
              transition: 'top 0.5s, left 0.5s',
              zIndex: 1,
            }}
          />
        )}
      </div>
      <button className="path-button" onClick={handleButtonClick}>
        Create Path
      </button>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Grid;
