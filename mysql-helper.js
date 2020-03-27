var mysql = require('mysql')

mysql.createPool({

})

const connection = mysql.createPool({
    host: 'localhost',
    user: 'smartuser',
    password: `nQBoZ\Ndj|:FnG#84k=xna0O:o\Bj81g\8g:sfPT4GqB+0qCH:BndE6i#~:mS/T&`,
    database: 'smartsaver'
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