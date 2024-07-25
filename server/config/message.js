const Message =  require('../model/Message');
const router = require('express').Router();


StoreMessage = async (data) => {
    
    try{
        const newMessage = new Message(data);
        const result = await newMessage.save();
        return result;
    }catch (error)
    {
        return error;
    }
   
}

module.exports =  {
    StoreMessage
}