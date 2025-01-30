import transporter from "./transporter.js";

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: "SaaS Dashboard",
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetURL}">here</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendPasswordResetEmail;
