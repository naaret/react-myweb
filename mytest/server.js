const { useState } = require('react'); 
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./src/config/config');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');
const port = process.env.PORT || 3001;
let gameData = {}; 
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });


// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sqlSelect = 'SELECT * FROM user WHERE username = ?';
    db.query(sqlSelect, [username], async (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal server error');
        }
        if (results.length > 0) {
            const hashedPassword = results[0].password;
            try {
                const match = await bcrypt.compare(password, hashedPassword);

                if (match) {
                    res.status(200).json({ message: 'Login successful', username: results[0].username });
                    gameData = results;
                } else {
                    res.status(401).send('Invalid credentials');
                }
            } catch (error) {
                console.error('Error comparing passwords:', error);
                res.status(500).send('Internal server error');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

// Register Route
app.post('/register', async (req, res) => {
    const { username, password, Rdate, firstname, lastname, email, Phone } = req.body;
    const sqlCheckDuplicate = 'SELECT * FROM user WHERE username = ? OR email = ? OR phone = ?';
    db.query(sqlCheckDuplicate, [username, email, Phone], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Database error');
            return;
        }

        if (result.length > 0) {
            const duplicates = result.map(row => {
                if (row.username === username) return 'ชื่อผู้ใช้';
                if (row.email === email) return 'อีเมล';
                if (row.phone === Phone) return 'เบอร์โทรศัพท์';
            }).filter(item => item);

            res.status(409).send(`ข้อมูลซ้ำ: ${duplicates.join(', ')}`);
        } else {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
                if (err) {
                    console.error('Hashing error:', err);
                    res.status(500).send('Failed to hash password');
                    return;
                }

                const sqlInsert = 'INSERT INTO user (username, password, email, firstname, phone, lastname, dateregister) VALUES (?, ?, ?, ?, ?, ?, ?)';
                db.query(sqlInsert, [username, hashedPassword, email, firstname, Phone, lastname, Rdate], (err, result) => {
                    if (err) {
                        console.error('Error inserting user:', err);
                        res.status(500).send('Failed to register user');
                    } else {
                        res.status(201).send('User registered successfully');
                    }
                });
            });
        }
    });
});

// Endpoint to fetch departments
app.get('/departments', (req, res) => {
    const sqlSelect = 'SELECT * FROM department';
    db.query(sqlSelect, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal server error');
        }
        res.status(200).json(results);
    });
});

app.get('/dashboard', (req, res) => {
    const statuss = "improve";
    if (!gameData || gameData.length === 0) {
        return res.status(400).send('No employee data found');
    }
    const employeeId = `${gameData[0].firstname} ${gameData[0].lastname}`;
    const sqlSelect = 'SELECT * FROM work WHERE employeeId = ? AND status = ? ';
    db.query(sqlSelect, [employeeId, statuss], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal server error');
        }
        res.status(200).json(results);
    });
});

app.get('/dashboard-deadline', (req, res) => {
    const statuss = "improve";
    if (!gameData || gameData.length === 0) {
        return res.status(400).send('No employee data found');
    }
    const employeeId = `${gameData[0].firstname} ${gameData[0].lastname}`;
    const sqlSelect = `
        SELECT * 
        FROM work 
        WHERE employeeId = ? 
        AND status = ? 
        AND endDate BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)
    `;
    db.query(sqlSelect, [employeeId, statuss], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal server error');
        }
        res.status(200).json(results);
    });
});

app.get('/dashboard-successfully', (req, res) => {
    const statuss = "Successfully";
    if (!gameData || gameData.length === 0 || !gameData[0].firstname || !gameData[0].lastname) {
        return res.status(400).send('Invalid gameData');
    }
    const employeeId = `${gameData[0].firstname} ${gameData[0].lastname}`;
    const sqlSelect = 'SELECT * FROM work WHERE employeeId = ? AND status = ?';
    db.query(sqlSelect, [employeeId, statuss], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal server error');
        }
        res.status(200).json(results);
    });
});

app.put('/dashboard/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const sql = 'UPDATE work SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Status updated successfully', result });
    });
});

app.get('/teams', (req, res) => {
    const sqlSelect = 'SELECT * FROM user';
    db.query(sqlSelect, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal server error');
        }
        res.status(200).json(results);
    });
});

// Endpoint to fetch employees by department
app.get('/employees', (req, res) => {
    const { departmentId } = req.query;
    const sqlSelect = 'SELECT * FROM employee WHERE department = ?';
    db.query(sqlSelect, [departmentId], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal server error');
        }
        res.status(200).json(results);
    });
});

app.post('/uploads', upload.single('file'), (req, res) => {
    const imgPath = req.file.path;
    const imgPaths = imgPath.replace("public\\", "");
    const status = "improve";
    const { departmentId, employeeId, projectId, startDate, endDate, details } = req.body;

    const sql = 'INSERT INTO work (departmentId, employeeId, projectId, startDate, endDate, details, imgPath, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [departmentId, employeeId, projectId, startDate, endDate, details, imgPaths, status], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Failed to insert data');
        }
        res.send('Data inserted successfully');
    });
});

app.post('/submit-employee', (req, res) => {
    const { firstname, lastname, department } = req.body;
    const sqlCheck = 'SELECT * FROM department WHERE department = ?';
    db.query(sqlCheck, [department], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        if (result.length === 0) {
            const sqlInsertDepartment = 'INSERT INTO department (department) VALUES (?)';
            db.query(sqlInsertDepartment, [department], (err, result) => {
                if (err) {
                    console.error('Error inserting department:', err);
                    return res.status(500).send('Failed to insert department');
                }
                insertEmployee(firstname, lastname, department, res);
            });
        } else {
            insertEmployee(firstname, lastname, department, res);
        }
    });
});

function insertEmployee(firstname, lastname, department, res) {
    const sqlInsertEmployee = 'INSERT INTO employee (firstname, lastname, department) VALUES (?, ?, ?)';
    db.query(sqlInsertEmployee, [firstname, lastname, department], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.error('Employee already exists:', err);
                res.status(409).json({ message: 'Employee already exists' });
            } else {
                console.error('Error inserting employee:', err);
                res.status(500).send('Failed to insert employee');
            }
        } else {
            res.status(200).json({ message: 'Employee added successfully' });
        }
    });
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
