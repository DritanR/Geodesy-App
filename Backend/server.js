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
    brojNaBaranje: String,
    imeIPrezime: String,
    adresa: String,
    telefonskiBroj: String,
    vidNaUsloga: String,
    ko: String,
    kp: String,
    date: String,
    files: [{
        filename: String,
        originalName: String
    }],
})

const NameModel = mongoose.model('Client', NameSchema)

const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'));


app.post('/add/client', async (req, res) => {
    const { id, brojNaBaranje, imeIPrezime, adresa, telefonskiBroj, vidNaUsloga, ko, kp, date } = req.body

    try {

        const existingClient = await NameModel.findOne({ id })

        if (existingClient) {
            return res.status(400).json({ message: 'Client with this ID alredy exists!' })
        }

        const newClient = new NameModel({ id, brojNaBaranje, imeIPrezime, adresa, telefonskiBroj, vidNaUsloga, ko, kp, date })
        await newClient.save()

        res.status(201).json({ message: 'Client data saved sucessfully!' })
    } catch {
        res.status(500).json({ message: 'An error occurred while saving the client data.' })
    }
})

app.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query.toLowerCase();
        const data = await NameModel.find({
            imeIPrezime: { $regex: query, $options: 'i' }
        });

        const ids = data.map(item => item.id);

        res.json({ data, ids });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
});



app.get('/get/client', async (req, res) => {
    const { imeIPrezime, id } = req.query;

    try {
        let query = {}

        if (imeIPrezime) {
            query.imeIPrezime = { $regex: new RegExp(imeIPrezime, 'i') }
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
        res.json({ message: 'Client deleted successfully!' })
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


app.post('/clearValue/:clientId', async (req, res) => {
    const { clientId } = req.params;
    const { field } = req.body;

    try {
        const updateObj = {};
        updateObj[field] = '';

        await NameModel.findByIdAndUpdate(clientId, { $set: updateObj });
        res.json({ message: `Value for field ${field} cleared successfully for client ${clientId}` });
    } catch (error) {
        console.error('Error clearing value:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

//Add files to client

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload/:clientId', upload.array('files'), async (req, res) => {
    const clientId = req.params.clientId;
    const uploadedFiles = req.files;

    try {
        const fileArray = uploadedFiles.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            // Add more fields if needed
        }));

        const updatedClient = await NameModel.findByIdAndUpdate(clientId, {
            $push: {
                files: { $each: fileArray },
            },
        });

        res.json({ message: 'Files uploaded successfully!' });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/get/files/:clientId', async (req, res) => {
    const clientId = req.params.clientId;

    try {
        const client = await NameModel.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const files = client.files;
        res.json({ files });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.delete('/delete/file/:clientId/:filename', async (req, res) => {
    const clientId = req.params.clientId;
    const filename = req.params.filename;

    try {
        await NameModel.findByIdAndUpdate(clientId, {
            $pull: { files: { filename: filename } }
        });

        // Fetch the updated client data
        const updatedClient = await NameModel.findById(clientId);
        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({ message: 'File deleted successfully!', updatedClient });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));