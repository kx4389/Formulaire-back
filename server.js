const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route pour recevoir les données
app.post('/api/contact', (req, res) => {
    const { prenom, nom, telephone, email } = req.body;
    console.log("Nouveau contact :", { prenom, nom, telephone, email }); // ← Ajoute ';' ici
    res.status(200).json({ message: "Données reçues avec succès !" });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`)); // ← Ajoute backticks
