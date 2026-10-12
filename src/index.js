import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'normalize.css'
import { BrowserRouter } from 'react-router-dom';
import './styles/globals.css'
import { registerServiceWorker } from './app/registerServiceWorker';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

registerServiceWorker();
