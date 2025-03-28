import React from 'react';
import ReactDOM from 'react-dom/client';
// import StarRating from './StarRating';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// root.render(
//   <React.StrictMode>
//     <StarRating maxRating = {5} messages = {['Terrible','Okay','Average','Good','Amazing']} defaultRating = {3} />
//   </React.StrictMode>
// );

