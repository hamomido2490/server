// ======== استدعاء المكتبات ========
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// تحميل متغيرات البيئة من ملف .env (في التطوير فقط)
//dotenv.config();

// ======== استدعاء الراوترات ========
const authRoutes = require('./routes/authRoutes');
const adsRoutes = require('./routes/adsRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const ratingsRoutes = require('./routes/ratingsRoutes');
const statsRoutes = require('./routes/statsRoutes');
const visitsRoutes = require('./routes/visitsRoutes');
const sanitizeMiddleware = require('./middleware/sanitizeMiddleware');

// ======== إنشاء تطبيق Express ========
const app = express();

// ======== ميدل وير ========
app.use(cors());
app.use(express.json());
app.use(sanitizeMiddleware); // تنظيف جميع المدخلات

// ======== التحقق من متغير البيئة الخاص بقاعدة البيانات ========
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('❌ خطأ: متغير البيئة MONGO_URI غير معرف. الرجاء إضافته في لوحة Railway أو ملف .env');
  process.exit(1);
}

// ======== الاتصال بقاعدة البيانات ========
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ تم الاتصال بـ MongoDB بنجاح'))
  .catch(err => {
    console.error('❌ فشل الاتصال بـ MongoDB:', err.message);
    process.exit(1);
  });

// ======== المسارات ========
app.use('/api/auth', authRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/visit', visitsRoutes);

// ملاحظة: لو /api/analysis ليه راوتر مخصص، استبدل statsRoutes بالملف الصحيح
app.use('/api/analysis', statsRoutes);

// ======== إعداد أمان CSP ========
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline'; frame-src *;");
  next();
});

// ======== تشغيل السيرفر ========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`));