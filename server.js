const express = require('express');
const cors = require('cors');
const app = express();

// Configuration CORS pour accepter les requêtes du front-end
app.use(cors({
  origin: 'https://kx4389.github.io/Formulaire-front/' // ← Remplacez par votre URL GitHub Pages
}));

app.use(express.json());

// Route POST pour le formulaire
app.post('/api/contact', (req, res) => {
  try {
    const { prenom, nom, telephone, email } = req.body;
    
    // Validation minimale
    if (!prenom || !nom || !telephone || !email) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    console.log("Nouveau contact reçu:", { prenom, nom, telephone, email });
    res.status(200).json({ message: "Données enregistrées avec succès!" });

  } catch (error) {
    console.error("Erreur du serveur:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// Route GET de test
app.get('/', (req, res) => {
  res.send('Backend du formulaire de contact - Opérationnel');
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).send("Endpoint non trouvé");
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});
