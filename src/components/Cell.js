// src/components/Cell.js
import React from 'react';
import './Cell.css';

const Cell = ({ isClicked, onClick, isStart, isEnd }) => {
  let cellClassName = 'cell';
  if (isClicked) cellClassName += ' clicked';
  if (isStart) cellClassName += ' start';
  if (isEnd) cellClassName += ' end';

  return <div className={cellClassName} onClick={onClick}></div>;
};

export default Cell;
