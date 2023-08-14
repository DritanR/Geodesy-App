const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser');
const { scryRenderedDOMComponentsWithTag } = require('react-dom/test-utils');

mongoose.connect('mongodb+srv://GeodezyApp:GeodezyApp1234@cluster0.krvd4ee.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const NameSchema = new mongoose.Schema({
    id: Number,
    broj: String,
    name: String,
    city: String,
    province: String,
    streetAdress: String,
    postalCode: Number,
    phoneNumber: String,
    vid: String,
    ko: String,
    kp: String,
    date: String
})

const NameModel = mongoose.model('Client', NameSchema)

const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

app.post('/add/client', async (req, res) => {
    const { id, broj, name, city, province, streetAdress, postalCode, phoneNumber, vid, ko, kp, date } = req.body

    try {
        const newClient = new NameModel({ id, broj, name, city, province, streetAdress, postalCode, phoneNumber, vid, ko, kp, date })
        await newClient.save()

        res.status(201).json({ message: 'Client data saved sucessfully!' })
    } catch {
        res.status(500).json({ message: 'An error occurred while saving the client data.' })
    }
})

app.get('/search/:name', async (req, res) => {
    try {
        const name = req.params.name.toLowerCase();
        const data = await NameModel.find({
            name: { $regex: name, $options: 'i' }
        });

        const ids = data.map(item => item.id);

        res.json({ data, ids });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
});



app.get('/get/client', async (req, res) => {
    const { name, id } = req.query;

    try {
        let query = {}

        if (name) {
            query.name = { $regex: new RegExp(name, 'i') }
        }

        if (id) {
            query.id = id
        }

        const clients = await NameModel.find(query)

        if (!clients || clients.length < 1) {
            return res.status(404).json({ message: 'This client does not exist!' })
        }

        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' })
    }
})

app.delete('/delete/client/:id', async (req, res) => {
    try {
        const id = req.params.id
        await NameModel.findByIdAndDelete(id)
        res.json({ message: 'Item deleted successfully!' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' })
    }
})


app.put('/update/client/:id', async (req, res) => {
    const clientId = req.params.id;
    const updatedData = req.body;
  
    try {
      await NameModel.findByIdAndUpdate(clientId, updatedData);
      res.json({ message: 'Client data updated successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating client data.' });
    }
  });

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));