var mysql = require('../mysql-helper')
var userMessages = require('../models/user_messages')

let messages = {
    id: Number,
    username: String,
    message: String,
    date_created: String,
    likes: Number,
    liked: Boolean
}

messages.getMessageList = async (user = false) =>  {
    let result = false;
    if (!user) // Unauthorized message receivers don't get anything extra.
        result = await messages.getMessages();
    else // Getting messages if you're authorized includes whether or not you've liked the message.
        result = await messages.getMessages(user.username);
    if (!result[0] || result[1].length == 0)
        return [false, "The messages could not be retrieved. Please contact support!"];
    
    let messageList = result[1];
    return [true, messageList];
}

messages.createMessage = async (newMessage, user) =>  {
    // Confirm a message was sent and that the message is of required length.
    let result = messages.validate(newMessage);
    if (!result[0])
        return result;

    messages.username = user.username;
    messages.message = newMessage.message;
    messages.date_created = new Date();
    messages.likes = 0;

    result = await messages.insertMessage(messages);

    if (!result[0] || result[1].length == 0)
        return [false, "The message could not be inserted. Please contact support!"];
    
    return [true, messages];
}

messages.expressFeelings = async (messageId, user) =>  {
    messageId = messageId.messageId; // Getting the message ID from the body. "Why not use que--?"  Too many questions!
    let count = 0; // Used to track whether like was added or removed

    // Confirm a message was sent and that the message is of required length.
    let result = await messages.getMessageById(messageId);
    if (!result[0])
        return result;
    
    // Check if user has liked it already.  Check message ID in user_messages
    result = await userMessages.getMessageLike(user.username, messageId);
    if (!result[0]) {
        // If no, add it.  Store this separately and give it back with the message.
        result = await userMessages.addMessageLike(user.username, messageId);
        if (!result[0])
            return result;
        count++;
    }
    else {
        // If yes, remove it. delete user_messages where ID = and Username = 
        result = await userMessages.removeMessageLike(user.username, messageId);
        if (!result[0])
            return result;
        count--;
    }
    
    // Add/subtract from message like count
    result = await messages.updateLikes(messageId, count);
        
    if (!result[0] || result[1].length == 0)
        return [false, "The message's likes could not be updated."];

    return [result[1].affectedRows == 1, result[1].message];
}

messages.getMessages = async (username = false) =>  {
    try {
        let results = false;
        if (!username)
            results = await mysql.runQuery(
                'SELECT m.id, m.message, m.date_created, m.likes, m.username FROM messages AS m ORDER BY date_created DESC', [])
        else
            results = await mysql.runQuery(
                'SELECT m.id, m.message, m.date_created, m.likes, m.username, um.username AS liked ' +
                'FROM messages AS m LEFT JOIN user_messages AS um ON m.id = um.message_id AND um.username = ? ORDER BY date_created DESC', username)
        if (results.length == 0)
            return [false, results];
        return [true, results];
    } catch (excep) {
        let err = "Failed to get messages |";
        console.log(err, excep);
        return [false, err];
    }
}

messages.getMessageById = async (messageId) => {
    try {
        let results = await mysql.runQuery(
            'SELECT m.id, m.message, m.date_created, m.likes, m.username, um.username AS liked ' +
            'FROM messages AS m LEFT JOIN user_messages AS um ON m.id = um.message_id WHERE m.id = ?', messageId)
        if (results.length == 0)
            return [false, results];
        return [true, results];
    } catch (excep) {
        let err = "Failed to get a message |";
        console.log(err, excep);
        return [false, err];
    }
}

messages.insertMessage = async (message) => {
    try {
        let results = await mysql.runQuery(
            'INSERT INTO messages (username, message, date_created, likes) VALUES (?, ?, ?, ?)'
            , [message.username, message.message, message.date_created, message.likes]);
        if (results.affectedRows == 0)
            return [false, results]
        return [true, results]
    } catch (excep) {
        let err = "Failed to create a message |";
        console.log(err, excep);
        return [false, err];
    }
}

messages.updateLikes = async (messageId, count) =>  {
    try {
        let results = await mysql.runQuery('UPDATE messages SET likes = likes + ? WHERE messages.id = ?', [count, messageId])
        if (results.affectedRows == 0)
            return [false, results]
        return [true, results]
    } catch (excep) {
        let err = "Failed to insert a token |";
        console.log(err, excep);
        return [false, err];
    }
}

messages.validate = (newMessage) => {
    if (!newMessage || newMessage == {})
        return [false, "No message was sent"];
    if (!newMessage.hasOwnProperty('message'))
        return [false, "You're missing a message"];
    if (newMessage.message.length < 0)
        return [false, "Your message is too short"];
    if (newMessage.message.length > 1234)
        return [false, "Your message is too long.  Max of 1234 characters."];

    // All checks have passed.  Wahoo!
    return [true, newMessage];
}

module.exports = messages