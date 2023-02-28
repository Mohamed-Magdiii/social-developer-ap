const express = require('express');
const app = express();
const connectDB = require('./config/db');
var cors = require('cors')
var bodypaser = require('body-parser')
const path = require('path');
const exp = require('constants');
//connect to database
connectDB();

//init middlware
app.use(express.json({extended:false}));
app.use(cors())
app.use(bodypaser.json())


//using routes

app.use('/api/users' , require('./routes/api/users'));
app.use('/api/auth' , require('./routes/api/auth'));
app.use('/api/posts' , require('./routes/api/posts'));
app.use('/api/profile' , require('./routes/api/profile'));


//Serve Static Assets in Production

if(process.env.NODE_ENV === 'production'){
    //set static folder 
    app.use(express.static('client/build'))

    app.get('*' , (req,res)=>{
        res.sendFile(path.resolve(__dirname,'client' , 'build','index.hmtl'))
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT , ()=> console.log(`server run on port ${PORT}`));