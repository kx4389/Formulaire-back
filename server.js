require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(morgan('dev'));

// Configuration CORS
const allowedOrigins = [
    'https://votre-utilisateur.github.io',
    'http://localhost:3000'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origine non autorisée'));
        }
    },
    methods: ['POST'],
    optionsSuccessStatus: 200
}));

// Limiteur de requêtes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite de requêtes
    message: "Trop de requêtes depuis cette IP"
});
app.use(limiter);

app.use(express.json({ limit: '10kb' }));

// Validation des données
const validateData = (data) => {
    const errors = {};
    if (!/^[a-zA-ZÀ-ÿ -]{2,30}$/.test(data.prenom)) errors.prenom = "Prénom invalide";
    if (!/^[a-zA-ZÀ-ÿ -]{2,30}$/.test(data.nom)) errors.nom = "Nom invalide";
    if (!/^\+?[\d\s]{10,15}$/.test(data.telephone)) errors.telephone = "Téléphone invalide";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Email invalide";
    return errors;
};

// Route principale
app.post('/api/contact', (req, res) => {
    try {
        const errors = validateData(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ 
                status: 'fail',
                errors 
            });
        }

        console.log("Nouveau contact:", req.body);
        res.status(200).json({ 
            status: 'success',
            message: 'Message reçu avec succès' 
        });

    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur interne du serveur' 
        });
    }
});

// Route de santé
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        timestamp: new Date().toISOString() 
    });
});

// Gestion des erreurs 404
app.all('*', (req, res) => {
    res.status(404).json({ 
        status: 'error',
        message: 'Endpoint non trouvé' 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});
