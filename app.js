const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const fs = require('fs');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

const facts = () => JSON.parse(fs.readFileSync('./facts.json'));

app.get('/facts', (req, res) => {
    res.status(200).json(facts());
});

app.get('/fact/:id', (req, res) => {
    const fact = facts().find(fact => fact.id === parseInt(req.params.id));
    if (fact) {
        res.status(200).json({"id": fact.id, "fact": fact.fact});
    } else {
        res.status(404).json({ message: 'Fact not found' });
    }
});

app.get('/fact', (req, res) => {
    const fact = facts()[Math.floor(Math.random() * facts().length)];
    res.status(200).json({"id": fact.id, "fact": fact.fact});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});