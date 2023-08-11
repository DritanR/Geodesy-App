const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

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
    let data = await NameModel.find({
        name: { $regex: req.params.name, $options: 'i' }
    });
    res.send(data);
});


app.get('/get/client/:name', async (req, res) => {
    const name = req.params.name
    try {
        const client = await NameModel.find({ name })

        if (!client || client.length === 0) {
            return res.status(404).json({ error: 'Client not found' })
        }
        return res.status(200).json(client)
    } catch (err) {
        return res.status(500).json({ error: 'Server error' })
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));