const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const data = JSON.parse(fs.readFileSync('agri_data.json', 'utf8'));

app.get('/', (req, res) => {
    res.send('AgriDose Backend is Running');
});

app.get('/plants', (req, res) => {
    res.json(data);
});

app.get('/pesticides/manual', (req, res) => {
    const { crop, substance, area } = req.query;
    if (!crop || !substance || !area) {
        return res.status(400).json({ error: 'Missing parameters' });
    }
    const entry = data.find(p => p.name === crop);
    if (!entry) return res.status(404).json({ error: 'Crop not found' });

    const product = entry.pesticides?.find(p => p.active_substance === substance);
    if (!product) return res.status(404).json({ error: 'Substance not found' });

    const dosage = parseFloat(product.dosage_per_ha) * parseFloat(area);
    res.json({ ...product, total_dosage: dosage });
});

app.get('/pesticides/auto', (req, res) => {
    const { crop, symptoms } = req.query;
    const entry = data.find(p => p.name === crop);
    if (!entry || !entry.pesticides) return res.status(404).json({ error: 'No data found' });

    const suggestions = entry.pesticides.filter(p => {
        return symptoms ? p.usage.toLowerCase().includes(symptoms.toLowerCase()) : true;
    });

    res.json(suggestions);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});