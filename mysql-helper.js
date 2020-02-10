var mysql = require('mysql')

mysql.createPool({

})

const connection = mysql.createPool({
    host: 'us-cdbr-iron-east-04.cleardb.net',
    user: 'b130b122610560',
    password: '284d61f6',
    database: 'heroku_ac9e59e335d0448'
  })


mysql.runQuery = (query, params) => {

    return new Promise((resolve, reject) => {
        connection.query(query, params, function (error, results) {
            if (error)
                return reject(error);
            
            return resolve(results);
    
        })

    })
}

mysql.runQueryWithTransaction = (query, params, callback) => {
    let result = false;
    connection.beginTransaction(function(err) {
        if (err) 
            throw err;
        
    connection.query(query, params, function (error, results, fields) {
        if (error) {
            return connection.rollback(function() {
                throw error;
            })
        }
        connection.commit(function(err) {
            if (err) {
             return connection.rollback(function() {
                 throw err;
             })
            }
            result = results;
        })
    
    })
    return callback(result);
    })
}

module.exports = mysql