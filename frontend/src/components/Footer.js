import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">🪳 I-COCKROACH</span>
            <p className="footer-tagline">Instantly. Affordably. Locally.</p>
            <p className="footer-desc">
              Hyperlocal marketplace connecting SME businesses with verified
              college talent.
            </p>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <h4>For Businesses</h4>
              <ul>
                <li><Link to="/post-job">Post a Job</Link></li>
                <li><Link to="/business-dashboard">Business Dashboard</Link></li>
                <li><Link to="/jobs">Browse Talent</Link></li>
                <li><a href="#pricing">Pricing</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>For Students</h4>
              <ul>
                <li><Link to="/jobs">Find Work</Link></li>
                <li><Link to="/student-dashboard">Student Dashboard</Link></li>
                <li><a href="#verify">Get Verified</a></li>
                <li><a href="#trust">Trust Tiers</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} I-COCKROACH. All rights reserved.
          </p>
          <div className="footer-social">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
