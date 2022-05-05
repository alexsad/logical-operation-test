import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Sign from './sign/Sign';
import GlobalStyle from './GlobalStyle';
import LoadingScreen from './pages/LoadingScreen';

const GameFrame = styled.div`
  background-color: #444444;
  font-family: font-family: 'Signika', sans-serif;
  font-size: 1rem;

  * {

    /* width */
    ::-webkit-scrollbar {
        width: 15px;
    }
  
    /* Track */
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px #080705; 
        border-radius: 6px;
        background-color: #d7d7d7;
        border-top: 2px solid #76550e;
        border-bottom: 2px solid #76550e;
    }
  
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #9e9e9e; 
        border-radius: 6px;
    }
  
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #868686; 
    }

  }

  /* Works on Firefox */
  * {
      scrollbar-width: 15px;
      scrollbar-color: #080705 rgba(50,50,50,.2);
  }

  a, input[type="color"] {
      text-decoration: none;
      color: inherit;
      &:active, &:visited {
          color: inherit;
      }
  }
`;

const AppWrap = styled.div`
  position: absolute;
  width: 100vw;
  min-height: 100vh;
  // overflow: hidden;
`;

const MapBuilder = React.lazy(() => import('./map-builder/MapBuilder'));

function App() {
  return (
    <AppWrap>
      <header className="App-header">
          <GlobalStyle/>
              <React.Suspense fallback={<LoadingScreen/>}>
                <Router>
                  <Switch>
                    <GameFrame>
                        <Sign>                  
                        <Route path="/" exact={true} component={MapBuilder} />
                          <Route path="/map-builder" render={
                          () => <MapBuilder/>
                        } />
                      </Sign>
                    </GameFrame>
                  </Switch>
                </Router>
              </React.Suspense>
      </header>
    </AppWrap>
  );
}

export default App;
