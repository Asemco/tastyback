var mysql = require('../mysql-helper')

let userMessages = {
    id: Number,
    username: String,
    message_id: Number
}

userMessages.getMessageLike = async (username, messageId) =>  {
    try {
        let results = await mysql.runQuery(
            'SELECT * FROM user_messages AS um WHERE um.username = ? AND um.message_id = ?', [username, messageId])
        if (results.length == 0)
            return [false, results];
        return [true, results];
    } catch (excep) {
        let err = "Failed to find a like |";
        console.log(err, excep);
        return [false, err];
    }
}

userMessages.addMessageLike = async (username, messageId) =>  {
    try {
        let results = await mysql.runQuery(
            'INSERT INTO user_messages (username, message_id) VALUES (?, ?)', [username, messageId])
        if (results.length == 0)
            return [false, results];
        return [true, results];
    } catch (excep) {
        let err = "Failed to add a like |";
        console.log(err, excep);
        return [false, err];
    }
}

userMessages.removeMessageLike = async (username, messageId) =>  {
    try {
        let results = await mysql.runQuery(
            'DELETE FROM user_messages WHERE user_messages.username = ? AND user_messages.message_id = ?', [username, messageId])
        if (results.length == 0)
            return [false, results];
        return [true, results];
    } catch (excep) {
        let err = "Failed to remove a like |";
        console.log(err, excep);
        return [false, err];
    }
}

module.exports = userMessages