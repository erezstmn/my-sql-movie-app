const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000


app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
app.use(bodyParser.json());

const mySqlHost = "localhost";

app.post('/movies', (req, res) => {   
    let movie_name = req.body.movie_name;
    let genre = req.body.genre;
    let release_year= req.body.release_year;    
    const connection = mysql.createConnection({
        host: 'tviw6wn55xwxejwj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user:'vddz3a51wdk49rc4',
        password:'pxh153k7dxyuvt4n'
    });
    connection.connect((error) => {
        if (error){
            return console.log(error);
        }    
        console.log('Connected!');
    });
    connection.query(`INSERT INTO x00qcbxug94h1hki.movies (movie_name, genre, release_year) VALUES ('${movie_name}', '${genre}', '${release_year}')`, (error, result) => {
        if (error){
            res.status(400).send(error);
        }
        res.send(result);
    });
    connection.end();
});
app.get('/movies', (req,res) => {
    let movie = req.query.movie_name;  
    const connection = mysql.createConnection({
        host: 'tviw6wn55xwxejwj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user:'vddz3a51wdk49rc4',
        password:'pxh153k7dxyuvt4n'
    });
    connection.connect((error) => {
        if (error){
            return console.log(error);
        }    
        console.log('Connected!');
    });
    
    connection.query(`SELECT * FROM x00qcbxug94h1hki.movies where movie_name = "${movie}"`, (error, result) => {
        if (error){
            res.status(400).send(error);
        }
        res.send(result);

    });
    connection.end();
      
});
app.get('/movies/search', (req, res) => {
    let genreToMatch = req.query.genre;
    let fromYear = req.query.from -1;
    let toYear = req.query.to +1;
    const connection = mysql.createConnection({
        host: 'tviw6wn55xwxejwj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user:'vddz3a51wdk49rc4',
        password:'pxh153k7dxyuvt4n'
    });
    connection.connect((error) => {
        if (error){
            return console.log(error);
        }    
        console.log('Connected');       
    });
    connection.query(`SELECT movie_name, avarage_rating FROM x00qcbxug94h1hki.movies WHERE (release_year BETWEEN ${fromYear} AND ${toYear}) AND (genre = '${genreToMatch}')`, (error, result) => {
        console.log(result);
        res.send(result);
    });
    connection.end();
});
app.patch('/movies/', (req,res) => {
    let movie = req.query.movie_name; 
    let newScore = parseInt(req.query.score, 10);
    const connection = mysql.createConnection({
        host: 'tviw6wn55xwxejwj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user:'vddz3a51wdk49rc4',
        password:'pxh153k7dxyuvt4n'
    });
    connection.connect((error) => {
        if (error){
            return console.log(error);
        }    
        console.log('Connected!');
    });
    let currentAvg, numOfRatings;
    connection.query(`SELECT avarage_rating, number_of_ratings FROM x00qcbxug94h1hki.movies where movie_name = "${movie}"`,(error, result) => {
        if (error){
            res.status(400).send(error);
        }        
        currentAvg = parseFloat(result[0].avarage_rating, 10);
        numOfRatings = parseInt(result[0].number_of_ratings, 10); 
        numOfRatings++;
        let newAvarage = ((currentAvg * (numOfRatings-1)) + newScore) / numOfRatings;                  
        let sql = `UPDATE x00qcbxug94h1hki.movies SET avarage_rating = ${newAvarage}, number_of_ratings = ${numOfRatings} WHERE movie_name= "${movie}"`
        connection.query(sql,
            (error, result) => {
            if (error){
                console.log(error);
                res.status(400).send(error);
            }
            res.send(result);
        });
        connection.end();
    });
    
});
app.get('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send('Hello from node server');
});
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});
app.listen(PORT, () =>{
    console.log(`App is running on port ${PORT}`);
});