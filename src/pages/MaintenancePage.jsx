import { useEffect } from 'react';
import './maintenance-page.css';

export default function MaintenancePage() {
  useEffect(() => {
    document.title = 'PAZ Thriving Tribe | Site care in progress';
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, follow');
  }, []);

  return (
    <main className="maintenance-page">
      <header className="maintenance-header">
        <a className="maintenance-brand" href="/" aria-label="PAZ Thriving Tribe">
          <img src="/logo/logomain.png" alt="" />
          <span>
            <strong>PAZ THRIVING TRIBE</strong>
            <small>Learn, grow, and thrive</small>
          </span>
        </a>
        <span className="maintenance-live-status"><i /> Temporary site pause</span>
      </header>

      <section className="maintenance-layout" aria-labelledby="maintenance-title">
        <div className="maintenance-copy">
          <p className="maintenance-eyebrow"><span /> Maintenance in progress</p>
          <h1 id="maintenance-title">We’ll be back soon.</h1>
          <p className="maintenance-description">
            PAZ Thriving Tribe is taking a short pause while we care for the site.
            Thank you for your patience.
          </p>
          <a className="maintenance-contact" href="mailto:pazthrivingtribe@gmail.com">
            Contact the PAZ team <span aria-hidden="true">↗</span>
          </a>
          <p className="maintenance-note">We look forward to welcoming you back.</p>
        </div>

        <figure className="maintenance-illustration" aria-labelledby="maintenance-diagram-title">
          <figcaption className="maintenance-illustration-heading">
            <span id="maintenance-diagram-title">A little site care</span>
            <span className="maintenance-check-count">BACK SOON</span>
          </figcaption>
          <div className="maintenance-artwork" role="img" aria-label="PAZ Thriving Tribe website taking a short maintenance pause">
            <div className="maintenance-browser-art">
              <div className="maintenance-browser-bar"><i /><i /><i /><span>pazthrivingtribe.org</span></div>
              <div className="maintenance-browser-content">
                <img src="/logo/logomain.png" alt="" />
                <div className="maintenance-art-copy">
                  <strong>PAZ THRIVING TRIBE</strong>
                  <span>We’ll be back soon</span>
                  <i><b /></i>
                </div>
              </div>
            </div>
            <div className="maintenance-plant" aria-hidden="true">
              <i className="maintenance-stem" />
              <i className="maintenance-leaf maintenance-leaf-one" />
              <i className="maintenance-leaf maintenance-leaf-two" />
              <i className="maintenance-leaf maintenance-leaf-three" />
              <i className="maintenance-pot" />
            </div>
          </div>
          <p className="maintenance-illustration-note">Growing, learning, and getting ready to welcome you again.</p>
        </figure>
      </section>

      <footer className="maintenance-footer">
        <span>PAZ THRIVING TRIBE</span>
        <span>Thanks for giving us a little time to get this right.</span>
      </footer>
    </main>
  );
}