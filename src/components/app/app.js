import React, { Component } from 'react';
import Header from '../header';
import RandomPlanet from '../random-planet';
import SwapiService from '../../services/swapi-service';
import DummySwapiService from '../../services/dummy-swapi-service';
import ErrorIndicator from '../error-indicator/error-indicator';
import { PeoplePage, PlanetsPage, StarshipPage, LoginPage, SecretPage } from '../pages';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SwapiServiceProvider } from '../swapi-service-context';
import { StarshipDetails } from '../sw-components';

import './app.css';

export default class App extends Component {

  state = {
    hasError: false,
    swapiService: new SwapiService(),
    isLoggedIn: false
  };

  onLogin = () => {
    this.setState({
      isLoggedIn: true
    });
  };

  onServiceChange = () => {
    this.setState(({ swapiService })=> {
      const Service = swapiService instanceof SwapiService ? 
                      DummySwapiService : SwapiService;
      
     return {
       swapiService: new Service()
     }
    })
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    const { isLoggedIn } = this.state;

    if (this.state.hasError) {
      return <ErrorIndicator />
    }
    
    return (
      <SwapiServiceProvider value={this.state.swapiService}>
        <Router>
          <div className="stardb-app">
            <Header onServiceChange={this.onServiceChange} />

            <RandomPlanet />
            <Switch>
              <Route
                path="/"
                render={() => <h2>Welcome to StartDB</h2>}
                exact />
              <Route path="/people/:id?"
                      component={PeoplePage} />
              <Route path="/planets" component={PlanetsPage} />
              <Route path="/starships" component={StarshipPage} exact />
              <Route path="/starships/:id"
                      render={({ match }) => {
                        const { id } = match.params;
                        return <StarshipDetails itemId={id} />
                      }}/>

              <Route
                path="/login"
                render={() => (
                  <LoginPage
                    isLoggedIn={isLoggedIn}
                    onLogin={this.onLogin}/> 
                )} />
              
              <Route
                path="/secret"
                render={() => (
                <SecretPage isLoggedIn={isLoggedIn} />
                )} />

                <Route render={() => <h2>Page not Found</h2>}/>
            </Switch>
        
          </div>
        </Router>
      </SwapiServiceProvider>
    );
  }
}
