const express = require('express');
const app = express();
const { Sequelize, DataTypes } = require('sequelize');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sequelize = new Sequelize('nodetest', 'root', 'password', {
    dialect: 'mysql'
});

const books = sequelize.define('books', {
    title: DataTypes.STRING,
    desc: DataTypes.STRING
}, {
    tableName: 'books',
});

books.sync({ force: true });

sequelize.authenticate()
    .then(() => {
        console.log('MySQL connected successfully!!');
    }).catch(e => {
        console.log(e);
    });

app.post('/create', async (req, res) => {
    try {
        const data = req.body;
        const creteBook = await books.create(data);
        return res.send({ success: true, data: creteBook })
    } catch (error) {
        return res.status(500).send(error)
    }
});

app.get('/get', async (req, res) => {
    try {
        const getBook = await books.findAll({
            attributes: ['id', 'title', 'desc']
        })
        return res.status(200).send(getBook)
    } catch (error) {
        return res.status(500).send(error)
    }
});

app.get('/getById/:id', async (req, res) => {
    try {
        // const id = req.params.id;
        const getById = await books.findOne({
            where: {
                id: req.params.id
            }
        });
        console.log('hiii', getById);
        return res.status(200).send({ success: true, data: getById })
    } catch (error) {
        return res.status(500).send(error)
    }
});

app.put('/update/:id', async (req, res) => {
    try {
        const data = req.body.data;
        const update = await books.update({
            data
        },
            {
                where: {
                    id: req.params.id
                }
            }
        );
        return res.status(201).send({ success: true, data: update })
    } catch (error) {
        return res.status(500).send(error)
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const deleteBook = await books.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).send('successfully deleted book!!')
    } catch (error) {
        return res.status(500).send(error)
    }
});


app.listen(3000, () => {
    console.log('Express app is running on port 3000');
});