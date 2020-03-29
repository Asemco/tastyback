var crypto = require('crypto')
var mysql = require('../mysql-helper')

let user = {
    id: Number,
    username: String,
    password: String,
    token: String,
}

user.register = async (newUser) => {    
    // Confirm that a user was sent, and the username/password fits requirements
    let result = user.validate(newUser);
    if (!result[0])
        return result;

    user.username = newUser.username;
    user.password = user.hashPassword(newUser.password)
    user.generateToken(user);

    result = await user.createUser(user);
    if (!result[0] || result[1].length == 0)
        return [false, "That username is taken."];

    user.id = result.insertId;

    // Refrain from returning the password to the user.
    delete user.password;
    return [true, user];
}

// Used when the user attempts to login
// We separate the salt and password from the user, then attempt to match a rehashing of their password.
user.login = async (loginUser) =>  {
    let result = await user.getUserByUsername(loginUser.username);
    if (!result[0] || result[1].length == 0)
        return [false, "A user with that username/password doesn't exist."];

    // Set the user from the result
    let dbUser = result[1][0];

    // Separate the salt and password from the user stored in the db.
    let salt = dbUser.password.substr(dbUser.password.length-32)
    let password = dbUser.password.substr(0, dbUser.password.length-32);

    // Rehash the password sent by the user attempting to log in.
    let rehashed = crypto.pbkdf2Sync(loginUser.password, salt, 10000, 80, 'sha512').toString('hex');
    
    // If it doesn't match, the user is not authenticated.
    if (rehashed != password) {
        return false;
    }

    // Generate a token for user to authentication with.
    user.generateToken(dbUser);
    // Store the token in the database, or return failure.
    result = await user.updateToken(dbUser);
    if (!result[0] || result[1].length == 0)
        return [false, "Failed to login.  Please contact support for assistance!"]
    delete dbUser.password;
    return [true, dbUser];
}

user.logout = async (logoutUser) => {    
    // Remove the token from the user
    user.removeToken(logoutUser); 
    
    // Update the database with the "new token"
    result = await user.updateToken(logoutUser);
    console.log("Update result: ", result);
    if (!result[0] || result[1].length == 0)
        return result;
    
    // Inform the user.
    return [true, "Logged out successfully!"];
}

user.validate = (newUser) => {
    if (!newUser || newUser == {})
        return [false, "No user was sent"];
    if (!newUser.hasOwnProperty('username'))
        return [false, "You're missing a username"];
    if (!newUser.hasOwnProperty('password'))
        return [false, "You're missing a password"];
    if (newUser.username.length < 0)
        return [false, "Your username is too short"];
    if (newUser.username.length > 45)
        return [false, "Your username is too long"];
    if (newUser.password.length < 0)
        return [false, "Your password is too short"];
    if (newUser.password.length > 255)
        return [false, "Your password is too long"];

    // All checks have passed.  Wahoo!
    return [true, newUser];
}

// Used upon registration to hash the password and generate a salt.  The salt is stored with the password
user.hashPassword = (password) => {
    let salt = crypto.randomBytes(16).toString('hex'); // 32 characters long
    return crypto.pbkdf2Sync(password, salt, 10000, 80, 'sha512').toString('hex') + salt; // 1** characters long
}

user.generateToken = (user) => {
    // If we have a token collision at 64 chars, thats a big yikes.
    user.token = crypto.randomBytes(32).toString('hex');
}

user.removeToken = (user) =>  {
    user.token = "";
}

user.getUserByUsername = async (username) =>  {
    try {
        let results = await mysql.runQuery('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', username)
        if (results.length == 0)
            return [false, results];
        return [true, results];
    } catch (excep) {
        let err = "Failed to select a user |";
        console.log(err, excep);
        return [false, err];
    }
}

user.getUserByToken = async (token) =>  {
    try {
        let results = await mysql.runQuery('SELECT * FROM users WHERE token = ?', token)
        if (results.length == 0)
            return [false, results]
        return [true, results]
    } catch (excep) {
        let err = "Failed to select a user |";
        console.log(err, excep);
        return [false, err];
    }
}


user.updateToken = async (user) =>  {
    try {
        let results = await mysql.runQuery('UPDATE users SET token = ? WHERE id = ?', [user.token, user.id])
        if (results.affectedRows == 0)
            return [false, results]
        return [true, results]
    } catch (excep) {
        let err = "Failed to insert a token |";
        console.log(err, excep);
        return [false, err];
    }
}

user.createUser = async (user) =>  {
    try {
        let results = await mysql.runQuery('INSERT INTO users (username, password, token) VALUES (LOWER(?), ?, ?)', [user.username, user.password, user.token]);
        if (results.affectedRows == 0)
            return [false, results]
        return [true, results]
    } catch (excep) {
        let err = "Failed to create a user |";
        console.log(err, excep);
        return [false, err];
    }
}

module.exports = user