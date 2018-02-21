const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 5000


app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
const mySqlHost = "localhost";



app.get('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send('Hello from node server');
});
app.get('/movies/', (req, res) => {
    console.log('get request received')
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
    })
    connection.query("SELECT * FROM x00qcbxug94h1hki.movies", (error, result) => {
        if (error){
            return console.log(error);
        }  
        res.send(result);
    });  
    connection.end();  
})
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});
app.listen(PORT, () =>{
    console.log(`App is running on port ${PORT}`);
});