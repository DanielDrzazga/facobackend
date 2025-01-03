const mongoose = require('mongoose')

const db_user = 'fullstack'
const db_password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (!db_password) {
  console.error(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const url = `mongodb+srv://${db_user}:${db_password}@cluster0.nrsvw.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({})
    .then((persons) => {
      console.log('Phonebook:')
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
    .catch((err) => {
      console.error(err)
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: name,
    number: number,
  })

  person
    .save()
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch((err) => {
      console.error(err)
      mongoose.connection.close()
    })
} else {
  console.error('Invalid arguments. Use one of the following formats:')
  console.error('1. node mongo.js <password>')
  console.error('2. node mongo.js <password> <name> <number>')
  mongoose.connection.close()
}
