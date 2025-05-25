const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./src/connections/connection');

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Main Route');
});

app.get('/users', (req, res) => {
    db.query('select * from user', (error, result) => {
    console.log(result)
    res.send(result)
    })
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM user WHERE id_user = ?', [userId], (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Terjadi kesalahan pada server');
        } else if (result.length === 0) {
            res.status(404).send('User tidak ditemukan');
        } else {
            res.send(result[0]);
        }
    });
});

app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { nama, email } = req.body;

    if (!nama || !email) {
        return res.status(400).send('Nama dan email harus diisi');
    }

    db.query(
        'UPDATE user SET nama_lengkap = ?, email = ? WHERE id_user = ?',
        [nama, email, userId],
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send('Terjadi kesalahan pada server');
            } else if (result.affectedRows === 0) {
                res.status(404).send('User tidak ditemukan');
            } else {
                res.send('User berhasil diupdate');
            }
        }
    );
});

app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM user WHERE id_user = ?', [userId], (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Terjadi kesalahan pada server');
        } else if (result.affectedRows === 0) {
            res.status(404).send('User tidak ditemukan');
        } else {
            res.send('User berhasil dihapus');
        }
    });
});

app.post('/users', (req, res) => {
    const { email, nama_lengkap, jenis_kelamin, no_hp, password, foto_profile } = req.body;

    if (!email || !nama_lengkap || !jenis_kelamin || !no_hp || !password || !foto_profile) {
        return res.status(400).send('Semua field harus diisi');
    }

    db.query(
        'INSERT INTO user (email, nama_lengkap, jenis_kelamin, no_hp, password, foto_profile) VALUES (?, ?, ?, ?, ?, ?)',
        [email, nama_lengkap, jenis_kelamin, no_hp, password, foto_profile],
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send('Terjadi kesalahan pada server');
            } else {
                res.send('User berhasil ditambahkan');
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
