const mysql = require('mysql')
const express = require('express')
const app = express()

const querys = {
    'clientes': `SELECT PatNum, FName, LName, HmPhone, WkPhone, WirelessPhone FROM patient`,
    'clinicas': `SELECT ClinicNum, Description, City FROM clinic`,
    'consulta': {

        'geral': `SELECT p.PatNum, p.FName, p.LName, p.HmPhone, p.WkPhone, p.WirelessPhone, a.*  
        FROM patient AS p LEFT JOIN appointment AS a ON p.PatNum = a.PatNum`,
        'isnew': ` WHERE a.IsNewPatient = 1`,
    }

}

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'opendental'
});


connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

app.get('/clientes', function (req, res) {
    connection.query(querys.clientes, (error, results, fields) => {
        if (error) throw error;
        res.json({ "qtd": results.length })
    })

})

app.get('/clientes/:id', function (req, res) {
    connection.query(querys.clientes + ` WHERE PatNum = ${req.params.id}`, (error, results, fields) => {
        if (error) throw error;
        console.log(results.length)
        if (results.length > 0) {
            res.json({ results })
        } else {
            res.json({ "ERRO": "CLIENTE NÃO ENCONTRADO" })
        }
    })

})


app.get('/clinicas', function (req, res) {
    connection.query(querys.clinicas, (error, results, fields) => {
        if (error) throw error;
        res.json({ results })
    })

})

app.get('/clinicas/:id', function (req, res) {
    connection.query(querys.clinicas + ` WHERE ClinicNum = ${req.params.id}`, (error, results, fields) => {
        if (error) throw error;
        console.log(results.length)
        if (results.length > 0) {
            res.json({ results })
        } else {
            res.json({ "ERRO": "CLINICA NÃO ENCONTRADO" })
        }
    })

})
app.get('/clinicas/:id/clientes', function (req, res) {
    connection.query(querys.clientes + ` WHERE ClinicNum = ${req.params.id}`, (error, results, fields) => {
        if (error) throw error;
        console.log(results.length)
        if (results.length > 0) {
            res.json({ results })
        } else {
            res.json({ "ERRO": "CLINICA NÃO ENCONTRADO" })
        }
    })

})


app.get('/teste', function (req, res) {
    connection.query(querys.teste, (error, results, fields) => {
        if (error) throw error;
        res.json({ results })
    })

})

app.get('/consulta', function (req, res) {
    connection.query(querys.consulta.geral, (error, results, fields) => {
        if (error) throw error;
        res.json({ "qtd":results.length, results })
    })

})

app.get('/consulta/isnew', function (req, res) {
    connection.query(querys.consulta.isnew, (error, results, fields) => {
        if (error) throw error;
        res.json({"qtd": results.length, results})
    })
})

app.listen(3000)

