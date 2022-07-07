import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {HashRouter as Router,  Route,  Link,  NavLink} from 'react-router-dom';

class ItemComp extends Component {
  render() {
   return (
        <div className="App-header">
          <h1>This is Index Content</h1>
        </div>
    );
  }
}

class SearchComp extends Component {
  render() {
    return (
        <div className="App-header">
          <h1>This is Search Content</h1>
        </div>
    );
  }
}

class EditComp extends Component {
  render() {
    return (
        <div className="App-header">
          <h1>This is edit Content</h1>
        </div>
    );
  }
}

class AboutComp extends Component {
  render() {
    return (
        <div className="App-header">
          <h1>Hi, I'm Urvi</h1>
          <p>This is my appication about cat data.<br/>
            The item page has information about various cats like name, breed, description,age.<br/>
            It also has owner information so that we can know which owner has which cat.<br/>
            This application also has search facility to search about particular cat.<br/>
            Edit functionality works to edit data of cat.<br/>
          </p>
        </div>
    );
  }
}

class App extends Component {
	render() {
		return (
		<Router>
		  <div className="App">             
			<header className="navbar">
				<NavLink exact to="/">Item</NavLink>              
				<NavLink to="/search">Search</NavLink>              
				<NavLink to="/edit">Edit</NavLink>
				<NavLink to="/about">About</NavLink>              
			</header>
			<Route exact path="/" component={ItemComp}/>			
			<Route path="/search" component={SearchComp}/>            
			<Route path="/edit" component={EditComp}/> 
            <Route path="/about" component={AboutComp}/> 
            
            <footer>
                Copyright 2019
            </footer>
		  </div>
		</Router>
		);
	}
}
export default App;
