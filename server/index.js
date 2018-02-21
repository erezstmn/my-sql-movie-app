const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000


app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
app.get('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send('Hello from node server');
});
app.get('/movies/', (req, res) => {
    console.log('get request received')
    res.send(`Hello from the servre running on ${PORT}`);
})
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});
app.listen(PORT, () =>{
    console.log(`App is running on port ${PORT}`);
});