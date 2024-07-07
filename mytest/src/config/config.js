const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test001',
})
module.exports = db;

// app.post('/login', (req, res) => {
//     const username = req.body.username
//     const password = req.body.password
//     db.query('SELECT * FROM test001 WHERE users = ? AND password = ?', [username, password], (error, results) => {
//         if (error) {
//           console.log(error);
//           res.status(500).send('Internal server error');
//         } 
//         else {
//           if (results.length > 0) {
//             res.status(200).send('Login successful');
//           } 
//         }
//       });
//     });
    


// app.listen(3333, () => {
//     console.log("runing backend server")
// })
