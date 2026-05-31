const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

// Servir les fichiers statiques (images, CSS, JS, HTML)
app.use(express.static("public"));
app.use(express.json());

// Config Nodemailer avec variables Render
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route contact
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
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

// Route portfolio (images)
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

// Route extensions SketchUp
app.get("/api/extensions", (req, res) => {
  const dir = path.join(__dirname, "public/extensions");
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(file => /\.(rbz|zip|rb)$/i.test(file))
    : [];
  res.json(files);
});

// ⚠️ Render impose process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
