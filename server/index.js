const express = require('express')
const app = express();
const cors = require('cors')

app.use(cors());

app.get('/', (req,res) => {
    res.send('Hello from our server!')
})

// React runs on port 3000 by default
app.listen(8080, ()=>{
    console.log('Server Listening on port 8080')
})