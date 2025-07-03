const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ تفعيل CORS
app.use(cors());
app.use(express.json());

// ✅ قراءة قاعدة البيانات من الملف
const data = JSON.parse(fs.readFileSync('Agridose_data_full.json', 'utf8'));

// ✅ نقطة اختبار رئيسية
app.get('/', (req, res) => {
  res.send('Agridose is running ✅');
});

// ✅ جلب النباتات حسب النوع (خضروات، حبوب، أشجار مثمرة)
app.get('/plants', (req, res) => {
  const type = req.query.type;
  if (!type || !data[type]) {
    return res.status(400).json({ error: 'Invalid type' });
  }
  res.json(data[type]);
});

// ✅ نقطة جلب بيانات السماد أو الدواء إن احتجتها لاحقًا

// ✅ تشغيل الخادم
app.listen(PORT, () => {
  console.log(`✅ Agridose backend running on port ${PORT}`);
});
