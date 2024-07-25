const express = require('express');
const mongoose = require('mongoose');
const dotenv  = require('dotenv');
const cors  = require('cors');
const WebSocket = require('ws');


dotenv.config();
const app = express();
//use CORS for cross origin platform
app.use(cors());
//When hit API to get data use express.json();
app.use(express.json());

//Set ALL the routes and using api/auth prefix to hit the auth API's
const authRoutes = require('./routes/auth');
const { encrypt } = require('./config/utils');
const { StoreMessage } = require('./config/message');
app.use('/api/auth', authRoutes);



//Make a connection with database
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log("Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 4001;

//PORT Listen 
const server = app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

//Setup a WebSocket to implement chat functionality
// We are running websocket and http server on same PORT
// If you want not same PORT then set different PORT on the server side eg. port : 3000
const wsServer = new WebSocket.Server({ server });

wsServer.on('connection', ws => {
    // ws.on('message', message => {
    //     const parsedMessage = JSON.parse(message);
    //     console.log(parsedMessage);
    //     // Handle incoming messages, encrypt and save to DB
    //   });
    
    //   ws.send(JSON.stringify({ message: 'Welcome!' }));
    ws.on('message', async (data, isBinary) => {
        // Handle incoming messages, encrypt and save to DB
        const Msg = isBinary ? data : data.toString();
        const parseData = JSON.parse(Msg);
        const encryptedData = await  encrypt(parseData.content);
        const Messagedata = {
            sender : parseData.sender,
            receiver : parseData.receiver,
            content : encryptedData.encryptedData
        }

        StoreMessage(Messagedata).then(result => {
            console.log(result);
        })
        
        ws.send("Thanks Buddy!");
    });

    // ws.send(JSON.stringify({ message: 'Welcome!' }));
})