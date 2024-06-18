import React from 'react';
import '../css/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <section className="footer-section">
          <h4>Quick Links</h4>
          <ol className="footer-olist">
            <li><a href="/#home">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/#services">Services</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ol>
        </section>
        
        <section className="footer-section">
          <h4>Legal</h4>
          <ul className="footer-ulist">
            <li><a href="https://policies.google.com/terms">Terms of Service</a></li>
            <li><a href="https://policies.google.com/privacy">Privacy Policy</a></li>
            <li><a href="/#disclaimer">Disclaimer</a></li>
          </ul>
        </section>
        
        <section className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: OTools@gmail.com</p>
          <p>Phone: +371 12345678</p>
          <ul className="social-media-list">
            <li><a href="https://facebook.com">Facebook</a></li>
            <li><a href="https://twitter.com">X</a></li>
            <li><a href="https://instagram.com">Instagram</a></li>
          </ul>
        </section>
      </div>

      <p className="footer-copy">© {new Date().getFullYear()} OTools. All rights reserved.</p>
    </footer>
  );
}

export default Footer;