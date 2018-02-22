import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import path from 'path';


class App extends Component {
  constructor(){
    super();
    this.state = {
      hideNewMovieForm : true,
      hideRankMovieForm : true,
      hideSearchMovieForm : true,
      hideAddNewMovieButton : false,
      hideRankMovieButton : false,
      hideSearchMovieButton : false,
      hideErrorMessage : true,
      list: []
  
    };
    this.handleAddNewMovie = this.handleAddNewMovie.bind(this);
    this.handleRateMovie = this.handleRateMovie.bind(this);
    this.handleSearchMovie = this.handleSearchMovie.bind(this);    
    this.handleSubmitNewMovie = this.handleSubmitNewMovie.bind(this);
    this.handleSubmitScore = this.handleSubmitScore.bind(this);
    this.handleSearchMovieSubmit = this.handleSearchMovieSubmit.bind(this);
  };  
  handleAddNewMovie(){
    this.setState(() =>{
      return ({
        hideNewMovieForm : false,
        hideRankMovieForm : true,
        hideSearchMovieForm : true,
        hideAddNewMovieButton : true,
        hideRankMovieButton : false,
        hideSearchMovieButton : false,
        hideErrorMessage : true,
        list:[]
      });
    });    
  }
  handleSubmitNewMovie(e) {
    e.preventDefault();
    const name = document.getElementById("newMovieName").value.toLowerCase().trim();    
    const genre = document.getElementById("newMovieGenre").value.toLowerCase();
    const year = document.getElementById("newMovieYear").value;
    if ((name.trim().length === 0) || (!genre) || (!year)){
      this.setState(() => {
        return ({
          hideErrorMessage :false
        });
      });
      return console.log("error");
    }
    this.setState(() => {
      return ({
        hideErrorMessage : true
      });
    });     
    axios.get(`../movies?movie_name=${name}`)
    .then((response) => {
      console.log(response.data);
      if(response.data.length !==0 ){
        alert(`The movie "${name}" already exists in the db`);
      } else{
        axios.post('../movies', {
      movie_name: name,
      genre: genre,
      release_year: year
    })
    .then((response) => {
      console.log(response);
      alert(`The movie "${name}" was added to the DB`);
      this.setState(() =>{
        return ({
          hideNewMovieForm : true,
          hideRankMovieForm : true,
          hideSearchMovieForm : true,
          hideAddNewMovieButton : false,
          hideRankMovieButton : false,
          hideSearchMovieButton : false,
          hideErrorMessage : true,
          list:[]
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
      }     
    })
    .catch((error) => {
      console.log(error);
    });    
  };
  handleRateMovie(){
    this.setState(() =>{
      return ({
        hideNewMovieForm : true,
        hideRankMovieForm : false,
        hideSearchMovieForm : true,
        hideAddNewMovieButton : false,
        hideRankMovieButton : true,
        hideSearchMovieButton : false,
        hideErrorMessage : true,
        list:[]
      });
    });   
  };
  handleSubmitScore(e) {
    e.preventDefault();
    const name = document.getElementById("rankMovieName").value.toLowerCase().trim();
    const score = document.getElementById("score").value;
    if ((name.trim().length === 0) || (!score)){
      this.setState(() => {
        return ({
          hideErrorMessage :false
        });
      });
      return console.log("error");
    }
    this.setState(() => {
      return ({
        hideErrorMessage : true
      });
    });
    axios.get(`../movies?movie_name=${name}`)
    .then((response) => {
      if(response.data.length === 0) {
        alert(`The movie ${name} does not exist in the db`);
      } else{
       axios.patch(`../movies?movie_name=${name}&score=${score}`)
       .then((response) => {
         alert(`The score of ${score} was added to the the movie "${name}"`);
         this.setState(() => {
          return ({
            hideNewMovieForm : true,
            hideRankMovieForm : true,
            hideSearchMovieForm : true,
            hideAddNewMovieButton : false,
            hideRankMovieButton : false,
            hideSearchMovieButton : false,
            hideErrorMessage : true,
            list:[]
          });
         });
       }).catch((error) => {
         console.log(error);
       })
    
      }     
    })
     .catch((error) => {
      console.log(error);
    });    
  };
  handleSearchMovie(){
    this.setState(() => {
      return ({
        hideNewMovieForm : true,
        hideRankMovieForm : true,
        hideSearchMovieForm : false,
        hideAddNewMovieButton : false,
        hideRankMovieButton : false,
        hideSearchMovieButton : true,
        hideErrorMessage : true,
        list:[]
      });
    });   
  };
  handleSearchMovieSubmit(e){
    e.preventDefault();
    const fromYear = document.getElementById("fromYear").value;
    const toYear = document.getElementById("toYear").value;
    const searchGenre = document.getElementById("searchMovieGenre").value.toLowerCase();
    console.log(fromYear, toYear, searchGenre);
    if ((!searchGenre) || (!fromYear) || (!toYear)){
      this.setState(() => {
        return ({
          hideErrorMessage :false
        });
      });
      return console.log("error");
    }
    this.setState(() => {
      return ({
        hideErrorMessage : true
      });
    });
    axios.get(`../movies/search?genre=${searchGenre}&from=${fromYear}&to=${toYear}`)
    .then((response) => {
      
      if (response.data.length === 0){
        this.setState(() => {
          return ({
            list: <p>No movies were found</p>
          });
        });
      } else {
        let movieData = response.data.map((movie) =>{  
        return (<li>Name: {movie.movie_name} || Avarage score: {movie.avarage_rating || 'No ratings'} </li>);
        });
        this.setState(() =>{
          return ({
            list: movieData
          });
        });
      }
      console.log(response.data.movies);
    }).catch((error) => {
      console.log(error);
    });

  };  
  render() {
    return (
      <div className="App">
        <h1 className="App-title">Welcome to My Movie App</h1>        
        <button 
          className='button' 
          onClick={this.handleAddNewMovie}
          hidden={this.state.hideAddNewMovieButton}
          >Add new movie</button>
          <br/>
        <form hidden={this.state.hideNewMovieForm}>
          <fieldset>
          <h3>Add Movie</h3>
          <p 
          hidden={this.state.hideErrorMessage}
          className="ErrorMessage">
          All data fields are required</p>
          Name: 
          <input type="text" placeholder="Movie name" id="newMovieName"/><br/>
          Genre: 
          <select id="newMovieGenre"> 
            <option value="" default selected>Select Genre</option>
            <option value="Comedy">Comedy</option>           
            <option value="Drama">Drama</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>
          </select><br/>
          Release Year: 
          <input 
            placeholder="Year" 
            type="number" 
            min="1888" 
            max="2018"
            id="newMovieYear"
            /><br/><br/>
          <input type="submit" value="Submit movie" onClick={this.handleSubmitNewMovie}/>
          </fieldset>
        </form><br/>
        <br/>        
        <button 
          className='button' 
          onClick={this.handleRateMovie}
          hidden={this.state.hideRankMovieButton}
          >Rate a movie</button>
          <br/>
        <form hidden={this.state.hideRankMovieForm}> 
        <fieldset>
        <h3>Rate Movie</h3>
        <p 
          hidden={this.state.hideErrorMessage}
          className="ErrorMessage">
          All data fields are required</p>
          Name: 
          <input type="text" placeholder="Movie name" id="rankMovieName"/><br/>
          Score (1-10): 
          <input placeholder="Score" type="number" min="1" max="10" id="score"/><br/>
          <input type="submit" value="Submit score" onClick={this.handleSubmitScore}/>
          </fieldset>
        </form> <br/>
        <br/>
        <button 
          className='button' 
          onClick={this.handleSearchMovie}
          hidden={this.state.hideSearchMovieButton}
          >Search movie</button><br/>
        <form hidden={this.state.hideSearchMovieForm}>
        <fieldset>
          <h3>Search Movie</h3>
          <p 
          hidden={this.state.hideErrorMessage}
          className="ErrorMessage">
          All data fields are required</p>
          Release year:   
        <input placeholder="From" type="number" min="1888" max="2018" id="fromYear"/>
        <input placeholder="To" type="number" min="1888" max="2018" id="toYear"/><br/>
          Genre: 
        <select id="searchMovieGenre"> 
            <option value="" default selected>Select Genre</option>
            <option value="Comedy">Comedy</option>           
            <option value="Drama">Drama</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>          
          </select><br/>
          <input type="submit" value="Search" onClick={this.handleSearchMovieSubmit}/>
          <ul> 
            {this.state.list}
          </ul>
          </fieldset>
          </form>
      </div>
    );
  }
}

export default App;
