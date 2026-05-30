const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config(); // ✅ charge les variables depuis .env

const app = express();
app.use(express.static("public"));
app.use(express.json());

// Configurer Nodemailer avec variables .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // ✅ ton adresse Gmail
    pass: process.env.EMAIL_PASS  // ✅ ton mot de passe d’application
  }
});

// Route contact
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // ✅ tu reçois les messages sur ton adresse
    subject: `Nouveau message de ${name}`,
    text: `Nom: ${name}\nEmail: ${email}\nMessage:\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erreur envoi email:", error);
      res.status(500).json({ message: "Erreur lors de l'envoi du message." });
    } else {
      console.log("Email envoyé:", info.response);
      res.json({ message: "Merci pour votre message, nous vous répondrons bientôt !" });
    }
  });
});

// Route portfolio
app.get("/api/portfolio", (req, res) => {
  const categories = ["tables", "armoires", "chaises"];
  const data = {};

  categories.forEach(cat => {
    const dir = path.join(__dirname, "public/images/meubles", cat);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir)
        .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
      data[cat] = files;
    } else {
      data[cat] = [];
    }
  });

  res.json(data);
});

// Route extensions
app.get("/api/extensions", (req, res) => {
  const dir = path.join(__dirname, "public/extensions");
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(file => /\.(rbz|zip|rb)$/i.test(file))
    : [];
  res.json(files);
});

app.listen(3000, () => console.log("🚀 Serveur lancé sur http://localhost:3000"));
