const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// MySQL
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'db'
})

app.get('', (req, res)=>{
    res.send('Server OK ')
});
// Get all users
app.get('/users', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * from users', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data are: \n', rows)
        })
    })
})

// Get an user
app.get('/users/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data are: \n', rows)
        })
    })
});

// Delete a user
app.delete('/users/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`user with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data are: \n', rows)
        })
    })
});

// Add user
app.post('/users', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body
        connection.query('INSERT INTO users SET ?', params, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`user has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data are: \n', rows)

        })
    })
});


app.put('/users', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err

        const { id, name, age, weight, height, gender } = req.body

        connection.query('UPDATE users SET name = ?, age = ?, weight = ?, height = ?, gender = ? WHERE id = ?', [name, age, weight, height, gender, id], (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`user with the name: ${name} has been added.`)
            } else {
                console.log(err)
            }

            console.log('The data are: \n', rows)

        })
    })
})


// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))
