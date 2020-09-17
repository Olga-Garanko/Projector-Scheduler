import React from 'react';
import { render } from 'react-dom';
import App from './app'
import './style.scss';

render(<App />, document.getElementById('root'))

module.hot && module.hot.accept();
