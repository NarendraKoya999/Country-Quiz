// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Update the import statement
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';


const rootElement = document.getElementById('root');

// Replace ReactDOM.render with createRoot().render
const root = createRoot(rootElement); // Use createRoot from react-dom/client
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
