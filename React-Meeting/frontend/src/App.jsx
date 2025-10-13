import './App.css';
import BlurText from './text/BlurText.jsx';
import TextType from './text/TextType.jsx'
import Stepper, { Step } from './components/Stepper.jsx';
import { useState } from 'react';
import FileUploader from "./components/FileUploader.jsx";
import FadeContent from "./motion/FadeContent.jsx"
import SplashCursor from './motion/SplashCursor.jsx'
import StaggeredMenu from './components/StaggeredMenu.jsx';
import './components/StaggeredMenu.css';
import InfoSection from './components/InfoSection.jsx'
import GradualBlur from './motion/GradualBlur.jsx';




function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitOk, setSubmitOk] = useState(false);

  // <- HIER: Endpoint deines Backends eintragen
  const API_URL = 'https://n8n.srv1017386.hstgr.cloud/webhook-test/hjhbbfkiajpjoojndhnfdk';

  const validators = [
    () => selectedFile !== null,   // Datei gewählt?
    () => name.trim() !== '',      // Name nicht leer
    () => email.trim() !== '',     // Email nicht leer (ggf. Regex)
    () => true
  ];

  async function handleFinalSubmit() {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitOk(false);

      const form = new FormData();
      form.append('file', selectedFile); // Feldname "file" -> im Backend erwarten
      form.append('name', name);
      form.append('email', email);

      const res = await fetch(API_URL, {
        method: 'POST',
        body: form, // KEIN content-type setzen, Browser setzt Boundary selbst
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Upload fehlgeschlagen (${res.status}): ${text}`);
      }

      setSubmitOk(true);
      // Optional: Antwort verarbeiten
      // const data = await res.json();
    } catch (err) {
      setSubmitError(err.message || 'Unbekannter Fehler');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{minHeight:'100vh', padding:'2rem'}}>
      {/* ... Header/Intro ... */}
      <div style={{maxWidth:'900px', margin:'0 auto', backgroundColor:'#000', marginTop:'2rem'}}>
        {/* --- Stepper-Section --- */}
        <div
          style={{
            marginTop:'5rem',
            background:'#262626',
            padding:'1.25rem',
            borderRadius:'12px',
            boxShadow:'0 6px 24px rgba(0,0,0,.25)'
          }}
        >
          <Stepper
            initialStep={1}
            onStepChange={(step) => console.log(step)}
            onFinalStepCompleted={handleFinalSubmit} // <-- HIER anbinden
            backButtonText="Previous"
            nextButtonText={isSubmitting ? 'Sending…' : 'Next'}
            validators={validators}
          >
            {/* Step 1: Datei */}
            <Step>
              <h2 style={{color:'#fff', margin:0}}>Datei hochladen</h2>
              <div style={{marginTop:'1em'}}>
                <FileUploader onFileSelect={setSelectedFile}/>
              </div>
            </Step>

            {/* Step 2: Name */}
            <Step>
              <h2 style={{color:'#fff', margin:0}}>Wie ist dein Name?</h2>
              <input
                value={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder="Ich heiße..."
                style={{
                  marginTop:'0.75rem', background:'#111', color:'#fff',
                  border:'1px solid #3f3f46', borderRadius:'8px', padding:'0.5rem 0.75rem', outline:'none'
                }}
              />
            </Step>

            {/* Step 3: E-Mail */}
            <Step>
              <h2 style={{color:'#fff', margin:0}}>Deine Email Adresse?</h2>
              <input
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="E-mail Adresse"
                style={{
                  marginTop:'0.75rem', background:'#111', color:'#fff',
                  border:'1px solid #3f3f46', borderRadius:'8px', padding:'0.5rem 0.75rem', outline:'none'
                }}
              />
            </Step>

            {/* Step 4: Zusammenfassung + Hinweis */}
            <Step>
              <h2 style={{color:'#fff', margin:0}}>Fast geschafft…</h2>
              <p style={{color:'#cbd5e1'}}>
                Drücke auf <b>Complete</b>, um alles zu senden. Die Auswertung erhältst du per E-Mail.
              </p>

              {isSubmitting && (
                <p style={{color:'#94a3b8'}}>Sende Daten… bitte nicht schließen.</p>
              )}
              {submitOk && (
                <p style={{color:'#22c55e'}}>Erfolgreich übermittelt! 🎉</p>
              )}
              {submitError && (
                <p style={{color:'#ef4444'}}>Fehler: {submitError}</p>
              )}
            </Step>
          </Stepper>
        </div>
        {/* --- /Stepper-Section --- */}
      </div>
    </div>
  );
}

export default App;
