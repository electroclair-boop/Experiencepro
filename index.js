const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const plans = [
  {
    id: 4,
    name: 'PACK BASIC',
    price: '19.99€',
    duration: '12 MOIS',
    features: ['+15,000 Chaînes HD/4K', 'Qualité SD/HD/FHD', 'Playlist M3u & Xtream', '1 Appareil', 'Support 24/7', 'VOD & Replay', '99.9% Serveur Uptime'],
    popular: false
  },
  {
    id: 2,
    name: 'PACK STANDARD',
    price: '29.99€',
    duration: '12 MOIS',
    features: ['+25,000 Chaînes 4K/UHD', 'Qualité 4K/UHD Stable', 'Playlist M3u & Xtream', '2 Appareils', 'Support 24/7', 'VOD & Replay', 'Mises à jour Gratuites' ],
    popular: false
  },
  {
    id: 5,
    name: 'PACK GOLD PRO',
    price: '39.99€',
    duration: '12 MOIS',
    features: ['SPÉCIAL MONDIAL 2026', 'Toutes les Chaînes Sport', 'Qualité 4K Ultra HD Plus', '4 Appareils Simultanés', 'Support Prioritaire VIP', 'Technologie Anti-Freeze 5.0', 'Toutes les VOD Illimitées'],
    popular: true
  },
  {
    id: 3,
    name: 'PACK PREMIUM',
    price: '49.99€',
    duration: '12 MOIS',
    features: ['Expérience Pro Totale', 'Meilleure Stabilité 4K', 'Playlist M3u & Xtream', '4 Appareils', 'Support VIP Dédié', 'VOD & Replay 4K', 'Chaînes Adultes (Optionnel)' ],
    popular: false
  }
];

app.get('/api/plans', (req, res) => {
  res.json(plans);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Nouveau message de contact :', { name, email, message });
  res.status(200).json({ success: true, message: 'Message reçu !' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

module.exports = app;
