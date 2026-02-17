import React, { useState } from "react";
import styles from "./Contact.module.css";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.headerSection}>
        <h1>Contact Us</h1>
        <p>We’d love to hear from you! Reach out anytime.</p>
      </div>

      <div className={styles.container}>
        {/* LEFT: Contact Details */}
        <div className={styles.contactDetails}>
          <h2>Get in Touch</h2>

          <div className={styles.infoBox}>
            <Phone className={styles.icon} />
            <p>+91 7888757414</p>
          </div>

          <div className={styles.infoBox}>
            <Mail className={styles.icon} />
            <p>support@mealify.com</p>
          </div>

          <div className={styles.infoBox}>
            <MapPin className={styles.icon} />
            <p>Rajpura, Punjab, India</p>
          </div>

          <iframe
            className={styles.map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3437.1749718000056!2d76.65720287529291!3d30.516091096070895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fc32344a6e2d7%3A0x81b346dee91799ca!2sChitkara%20University!5e0!3m2!1sen!2sin!4v1763385318812!5m2!1sen!2sin"></iframe>
        </div>

        {/* RIGHT: Form */}
        <div className={styles.formBox}>
          <h2>Send a Message</h2>
          <form onSubmit={handleSubmit}>
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <label>Your Message</label>
            <textarea
              name="message"
              required
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
