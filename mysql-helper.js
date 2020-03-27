var mysql = require('mysql')
var auth = require('./local-variables.js')


mysql.createPool({
    
})

// local-variables.js looks like this internally: module.exports = {mysql_config: {host: '', user: '', password: ``, database: ''}};
const connection = mysql.createPool(auth.mysql_config)


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