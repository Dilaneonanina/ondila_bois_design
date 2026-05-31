const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // ton Gmail
    pass: process.env.EMAIL_PASS    // mot de passe d’application
  }
});

// Route pour formulaire contact
app.post('/send', (req, res) => {
  const mailOptions = {
    from: req.body.email,
    to: process.env.EMAIL_USER,
    subject: `Message de ${req.body.name}`,
    text: req.body.message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur lors de l’envoi du message.');
    } else {
      console.log('Email envoyé: ' + info.response);
      res.status(200).send('Message envoyé avec succès !');
    }
  });
});

// ⚠️ Utiliser process.env.PORT pour Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});
