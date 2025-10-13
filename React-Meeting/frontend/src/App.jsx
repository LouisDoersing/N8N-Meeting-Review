import './App.css';
import BlurText from './text/BlurText.jsx';
import TextType from './text/TextType.jsx'
import Stepper, { Step } from './components/Stepper.jsx';
import { useState } from 'react';
import FileUploader from "./components/FileUploader.jsx";
import FadeContent from "./motion/FadeContent.jsx"
import StaggeredMenu from './components/StaggeredMenu.jsx';
import './components/StaggeredMenu.css';
import InfoSection from './components/InfoSection.jsx'

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitOk, setSubmitOk] = useState(false);

  // Menu Items
  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' }
  ];

  const socialItems = [
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' }
  ];

  // Endpoint deines Backends
  const API_URL = 'https://n8n.srv1017386.hstgr.cloud/webhook-test/hjhbbfkiajpjoojndhnfdk';

  const validators = [
    () => selectedFile !== null,
    () => name.trim() !== '',
    () => email.trim() !== '',
    () => true
  ];

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  async function handleFinalSubmit() {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitOk(false);

      const form = new FormData();
      form.append('file', selectedFile);
      form.append('name', name);
      form.append('email', email);

      const res = await fetch(API_URL, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Upload fehlgeschlagen (${res.status}): ${text}`);
      }

      setSubmitOk(true);
    } catch (err) {
      setSubmitError(err.message || 'Unbekannter Fehler');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{minHeight: '100vh', padding: '2rem'}}>
      <div className="staggered-menu-wrapper fixed-wrapper">
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials
          displayItemNumbering
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          changeMenuColorOnOpen
          colors={['#B19EEF', '#5227FF']}
          logoUrl=""
        />
      </div>

      <div style={{maxWidth: '900px', margin: '0 auto', backgroundColor: '#000', marginTop: '2rem'}}>
        <h1 className="h1-style glow">
          <BlurText
            text="Meeting"
            className="h1-text"
            delay={10}
            animateBy="words"
            direction="top"
            animationFrom={{opacity: 0, y: -8, filter: 'blur(2px)'}}
            animationTo={[{opacity: 1, y: 0, filter: 'blur(0px)'}]}
            onAnimationComplete={handleAnimationComplete}
          />
        </h1>

        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <h2 style={{fontSize: '1.5rem'}}>
            <TextType
              as="span"
              className="h2-center"
              text={[
                'Präzises Feedback für jedes Meeting',
                'Effiziente Auswertung dank KI',
                ' Einfach gute Meetings!'
              ]}
              typingSpeed={50}
              deletingSpeed={30}
              pauseDuration={2000}
              loop
              showCursor
              cursorCharacter="|"
              textColors={['#e2e8f0', '#cbd5e1', '#f1f5f9']}
            />
          </h2>
        </FadeContent>

        {/* --- Stepper-Section --- */}
        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <div style={{
            marginTop: '5rem',
            background: '#262626',
            padding: '1.25rem',
            borderRadius: '12px',
            boxShadow: '0 6px 24px rgba(0,0,0,.25)'
          }}>
            <Stepper
              initialStep={1}
              onStepChange={(step) => { console.log(step); }}
              onFinalStepCompleted={handleFinalSubmit}
              backButtonText="Previous"
              nextButtonText={isSubmitting ? 'Sending…' : 'Next'}
              validators={validators}
            >
              <Step>
                <h2 style={{color: '#fff', margin: 0}}>Datei hochladen</h2>
                <div style={{marginTop: '1em'}}>
                  <FileUploader onFileSelect={setSelectedFile}/>
                </div>
              </Step>

              <Step>
                <h2 style={{color: '#fff', margin: 0}}>Wie ist dein Name?</h2>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ich heiße..."
                  style={{
                    marginTop: '0.75rem',
                    background: '#111',
                    color: '#fff',
                    border: '1px solid #3f3f46',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    outline: 'none'
                  }}
                />
              </Step>

              <Step>
                <h2 style={{color: '#fff', margin: 0}}>Deine Email Adresse?</h2>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail Adresse"
                  style={{
                    marginTop: '0.75rem',
                    background: '#111',
                    color: '#fff',
                    border: '1px solid #3f3f46',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    outline: 'none'
                  }}
                />
              </Step>

              <Step>
                <h2 style={{color: '#fff', margin: 0}}>Fast geschafft...</h2>
                <p style={{color: '#cbd5e1'}}>
                  Drücke auf "fertig" um den Prozess abzuschließen. Deine Bewertung des Meetings bekommst du dann per E-Mail zugeschickt.
                </p>

                {/* Status-Nachrichten */}
                {isSubmitting && (
                  <p style={{color: '#94a3b8'}}>Sende Daten… bitte nicht schließen.</p>
                )}
                {submitOk && (
                  <p style={{color: '#22c55e'}}>Erfolgreich übermittelt! 🎉</p>
                )}
                {submitError && (
                  <p style={{color: '#ef4444'}}>Fehler: {submitError}</p>
                )}
              </Step>
            </Stepper>
          </div>
        </FadeContent>
        {/* --- /Stepper-Section --- */}
      </div>

      {/* --- InfoSection --- */}
      <div className="body" style={{backgroundColor: '#000', marginTop: '10rem'}}>
        <p className="h1-style glow section-title">Wie es Funktioniert</p>
        <InfoSection className="info-section"/>
      </div>
    </div>
  );
}

export default App;
