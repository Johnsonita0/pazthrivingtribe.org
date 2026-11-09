import { useState } from 'react';
import { supabase } from '../supabaseClient';
import './masterclass.css';

const masterclassEventKey = 'parent-communication-2026-11-21';
const masterclassDetails = {
  date: 'Saturday, 21 November 2026',
  time: '10:00 AM - 11:30 AM',
  fee: '₦10,000',
  bank: 'Wema Bank',
  accountName: 'Paz Thriving Tribe',
  accountNumber: '0125939681',
  whatsappDisplay: '0803 738 3820',
  whatsappNumber: '2348037383820'
};

const initialForm = { name: '', email: '', phone: '' };

export default function MasterclassPage() {
  const [form, setForm] = useState(initialForm);
  const [registrant, setRegistrant] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const registration = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim()
    };

    setSubmitting(true);
    setSubmitError('');

    try {
      const { error } = await supabase.from('masterclass_registrations').insert({
        event_key: masterclassEventKey,
        registrant_name: registration.name,
        email: registration.email,
        phone: registration.phone
      });

      if (error) throw error;
      setRegistrant(registration);
    } catch (error) {
      console.error('Masterclass registration could not be saved:', error);
      setSubmitError(error?.message || 'We could not submit your registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = registrant
    ? `Hello PAZ Thriving Tribe, I have registered for the Parent Masterclass "Getting Your Teenager to Speak to You". Name: ${registrant.name}. Email: ${registrant.email}. Phone: ${registrant.phone}. I have made the ₦10,000 payment and attached my proof of payment.`
    : '';
  const whatsappLink = `https://wa.me/${masterclassDetails.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="masterclass-page">
      <div className="masterclass-card">
        <header className="masterclass-header">
          <span className="masterclass-eyebrow">PAZ Thriving Teens Academy · Parent Masterclass</span>
          <h1>Getting Your Teenager to Speak to You</h1>
          <p>Bridge the communication gap for a closer, happier family.</p>
        </header>

        <section className="masterclass-details" aria-label="Masterclass details">
          <div>
            <span>Date</span>
            <strong>{masterclassDetails.date}</strong>
          </div>
          <div>
            <span>Time</span>
            <strong>{masterclassDetails.time}</strong>
          </div>
          <div>
            <span>Venue</span>
            <strong>Online · Google Meet</strong>
          </div>
          <div>
            <span>Fee per participant</span>
            <strong>{masterclassDetails.fee}</strong>
          </div>
        </section>

        {!registrant ? (
          <section className="masterclass-form-section">
            <h2>Register for the masterclass</h2>
            <p>Enter your contact details to register and see the payment instructions.</p>
            <form className="masterclass-form" onSubmit={handleSubmit}>
              <label>
                <span>Parent or guardian name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  maxLength={120}
                  required
                />
              </label>
              <label>
                <span>Email address</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  maxLength={254}
                  required
                />
              </label>
              <label>
                <span>WhatsApp or phone number</span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  maxLength={40}
                  required
                />
              </label>
              <button type="submit" className="masterclass-primary-button" disabled={submitting}>
                {submitting ? 'Submitting registration…' : 'Continue to payment'}
              </button>
            </form>
            {submitError && <p className="masterclass-submit-error" role="alert">{submitError}</p>}
            <p className="masterclass-privacy-note">Your contact details are shared with PAZ so the team can follow up on your registration.</p>
          </section>
        ) : (
          <section className="masterclass-payment" aria-live="polite">
            <span className="masterclass-payment-badge">Registration details received</span>
            <h2>Pay by bank transfer</h2>
            <p>Transfer {masterclassDetails.fee} using the account below. Your place is confirmed after payment proof is received.</p>
            <dl className="masterclass-bank-details">
              <div><dt>Account name</dt><dd>{masterclassDetails.accountName}</dd></div>
              <div><dt>Bank</dt><dd>{masterclassDetails.bank}</dd></div>
              <div><dt>Account number</dt><dd><strong>{masterclassDetails.accountNumber}</strong></dd></div>
              <div><dt>Amount</dt><dd><strong>{masterclassDetails.fee}</strong></dd></div>
            </dl>
            <a className="masterclass-whatsapp-button" href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
              <span>Send proof of payment on WhatsApp</span>
            </a>
            <p className="masterclass-whatsapp-number">
              WhatsApp: <a href={`https://wa.me/${masterclassDetails.whatsappNumber}`} target="_blank" rel="noopener noreferrer">{masterclassDetails.whatsappDisplay}</a>
            </p>
            <p className="masterclass-privacy-note">WhatsApp will open with your registration details filled in. Attach your payment receipt before sending.</p>
            <button type="button" className="masterclass-edit-button" onClick={() => setRegistrant(null)}>Back to registration form</button>
          </section>
        )}
      </div>
    </main>
  );
}
