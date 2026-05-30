document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const responseMsg = document.getElementById("formResponse");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      responseMsg.textContent = result.message;
      responseMsg.style.color = "green";
      form.reset();
    } catch (err) {
      responseMsg.textContent = "Erreur lors de l'envoi du message.";
      responseMsg.style.color = "red";
    }
  });
});
