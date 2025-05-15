import { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    
    // Simulated success message
    setSuccessMessage("Your message has been sent successfully!");
    
    // Clear form after submission
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Hide success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h2>Contact Us</h2>
        
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required />
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" required />
          
          <button type="submit" className="btn send-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
