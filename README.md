# 🚀 NASA Exoplanet Query: Habitability Analysis Pipeline

Aplikasi web end-to-end untuk menganalisis dan memprediksi tingkat kelayakan huni (*habitability*) eksoplanet menggunakan data langsung dari NASA Exoplanet Archive.

Proyek ini dikembangkan sebagai bagian dari penelitian akademik Program Studi Informatika.

---

## 🌌 Deskripsi Sistem

Sistem ini mengintegrasikan:

* Pengambilan data real-time melalui layanan TAP (Table Access Protocol)
* Model Machine Learning (Random Forest Classifier)
* Backend API berbasis FastAPI
* Dashboard interaktif berbasis Next.js
* Analisis feature importance untuk interpretabilitas model

Pipeline dirancang modular, scalable, dan siap untuk deployment.

---

## 🌟 Fitur Utama

### 1. Ingesti Data Real-time

Mengambil parameter eksoplanet secara langsung:

* Radius Planet
* Massa Planet
* Suhu Planet
* Parameter Stellar
* Jarak Sistem

### 2. Inference Machine Learning

* Model: Random Forest Classifier
* Output: Habitability Score
* Model diserialisasi menggunakan joblib

### 3. Dashboard Analisis Fitur

Menampilkan:

* Feature Importance
* Visualisasi kontribusi parameter
* Interpretasi hasil prediksi

### 4. Klasifikasi Otomatis Tipe Planet

Kategori:

* Rocky Planet
* Gas Giant
* Lava Planet
* Ice Planet

Berdasarkan kombinasi metrik stellar dan planetari.

### 5. UI Modern

* Next.js 14
* TypeScript
* Tailwind CSS
* Framer Motion

---

## 🧠 Insight Machine Learning

Model Random Forest menghasilkan:

* Training Accuracy: 1.00

### Feature Importance

| Fitur                      | Kontribusi |
| -------------------------- | ---------- |
| Radius Planet (R⊕)         | ~61.25%    |
| Massa Planet (M⊕)          | ~31.22%    |
| Parameter Stellar & Sistem | Sisanya    |

Interpretasi:

* Radius merupakan faktor paling dominan.
* Massa berpengaruh terhadap gravitasi dan retensi atmosfer.
* Parameter stellar tetap relevan namun kontribusinya lebih kecil.

---

## 🛠️ Teknologi

### Frontend

* Next.js 14
* TypeScript
* Tailwind CSS
* Framer Motion

### Backend

* Python
* FastAPI
* Uvicorn

### AI & Data Science

* Scikit-Learn
* Pandas
* NumPy
* Joblib

---

## 📂 Struktur Proyek

```
.
├── backend/
│   ├── habitability_model.pkl
│   ├── main.py
│   ├── train_model.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🚀 Cara Menjalankan

### 1. Setup Backend

```
cd backend
python -m venv venv
```

Aktivasi virtual environment:

Windows:

```
.\venv\Scripts\activate
```

Mac/Linux:

```
source venv/bin/activate
```

Install dependency:

```
pip install -r requirements.txt
```

Train model (opsional):

```
python train_model.py
```

Jalankan API:

```
python main.py
```

Server berjalan di:

```
http://localhost:8000
```

---

### 2. Setup Frontend

```
cd frontend
npm install
npm run dev
```

Akses di:

```
http://localhost:3000
```

---

## 🔄 Alur Sistem

1. Frontend mengirim request ke FastAPI
2. Backend mengambil data NASA
3. Data dipreprocessing
4. Model melakukan inference
5. Hasil dikirim ke frontend
6. Dashboard menampilkan skor dan analisis fitur

---

## 📈 Roadmap

* Integrasi SHAP untuk explainable AI
* Hyperparameter tuning
* Cross-validation evaluation
* Deployment ke cloud
* CI/CD pipeline

---
