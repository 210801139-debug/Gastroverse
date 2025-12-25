// Initialize EmailJS with your Public Key
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key

document
  .getElementById("forgotPasswordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;

    // Send email using EmailJS
    emailjs
      .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        to_email: email,
        message: "This is a reset email for your password.",
      })
      .then(function (response) {
        alert("Reset link sent successfully to " + email);
        document.getElementById("forgotPasswordForm").reset();
      })
      .catch(function (error) {
        alert("Failed to send email. Please try again.");
        console.error("EmailJS Error:", error);
      });
  });
