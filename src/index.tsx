import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from './app';

const rootEl = document.getElementById('root');
// Render the main component into the dom
const render = (Component: React.FC) => {
  ReactDOM.render(<Component />, rootEl);
};

render(App);

if (process.env.NODE_ENV === 'dev') {
  if ((module as any).hot) {
    (module as any).hot.accept('./app', () => {
      const App = require('./app').default;
      render(App);
    });
  }
}
