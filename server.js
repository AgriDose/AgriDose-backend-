const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ تفعيل CORS للسماح بالاتصال من Netlify
app.use(cors());
app.use(express.json());

// ✅ قراءة قاعدة البيانات من الملف (تأكد أن الملف بجانب هذا الملف)
const data = JSON.parse(fs.readFileSync('Agridose_data_full.json', 'utf8'));

// ✅ نقطة اختبار رئيسية
app.get('/', (req, res) => {
  res.send('Agridose is running ✅');
});

// ✅ نقطة جلب النباتات حسب النوع (خضروات، حبوب، أشجار مثمرة)
app.get('/plants', (req, res) => {
  const type = req.query.type;
  if (!type || !data[type]) {
    return res.status(400).json({ error: 'Invalid type' });
  }
  res.json(data[type]);
});

// ✅ نقطة مستقبلية للأسمدة أو الأدوية يمكن إضافتها لاحقًا

// ✅ تشغيل الخادم
app.listen(PORT, () => {
  console.log(`✅ Agridose backend is running on port ${PORT}`);
});
