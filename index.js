const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3001;

app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>');
})

app.get('/info', (request, response) => {
    const phoneBookSize = persons.length;
    const currentDate = new Date().toString();

    response.send(`<p>Phonebook has info for ${phoneBookSize} people</p>
        <p>${currentDate}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.post('/api/persons', (request, response) => {
    const person = request.body;

    if (!person.name || !person.number){
        return response.status(400).json({error: 'name and number is required'})
    }

    if (persons.filter(p => p.name === person.name).length !== 0)
    {
        return response.status(400).json({error: 'name must be unique'})
    }

    const maxId = persons.length > 0
    ? Math.max(...persons.map(person => Number(person.id)))
    : 0

    person.id = maxId + 1;

    persons = persons.concat(person)

    response.json(person);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    }

    response.status(404).send(`Person with id: ${id} not found`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})