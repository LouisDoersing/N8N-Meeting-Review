import './App.css';
import BlurText from './components/BlurText';
import TextType from './TextType.jsx'
import Stepper, { Step } from './components/Stepper.jsx';
import { useState } from 'react';
import FileUploader from "./components/FileUploader.jsx";



function App() {
    const handleAnimationComplete = () => {
        console.log('Animation completed!');
    };
    const [selectedFile, setSelectedFile] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Validierungsfunktionen für jeden Step
    const validators = [
    // Step 1: File Upload - nur valid wenn eine Datei ausgewählt ist
     () => selectedFile !== null,
    // Step 2: Name - nur valid wenn Name nicht leer ist
     () => name.trim() !== '',
    // Step 3: Email - nur valid wenn Email nicht leer ist (kannst du erweitern)
     () => email.trim() !== '',
    // Step 4: Immer valid
     () => true
    ];

    return (
    <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#1f1f1f' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
          <BlurText
            text="Meeting"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="inline-block"
          />
        </h1>

        <h2 style={{ fontSize: '1.5rem', color: 'white' }}>
          <TextType
            as="span"
            className="text-2xl text-gray-300"
            text={[
              'Schnell. Elegant. Typed.',
              'React + GSAP Typing Effekt',
              'Individuell anpassbar 🚀'
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
        {/* --- Stepper-Section --- */}
        <div
          style={{
            marginTop: '2rem',
            background: '#262626',
            padding: '1.25rem',
            borderRadius: '12px',
            boxShadow: '0 6px 24px rgba(0,0,0,.25)'
          }}
        >
     <Stepper
       initialStep={1}
       onStepChange={(step) => {
         console.log(step);
       }}
       onFinalStepCompleted={() => console.log('All steps completed!')}
       backButtonText="Previous"
       nextButtonText="Next"
       validators={validators}
     >
       <Step>
         <h2 style={{ color: '#fff', margin: 0 }}>Datei hochladen</h2>
         <div style={{ marginTop: '1em' }}>
           <FileUploader onFileSelect={setSelectedFile} />
         </div>
       </Step>

       <Step>
         <h2 style={{ color: '#fff', margin: 0 }}>Wie ist dein Name?</h2>
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
         <h2 style={{ color: '#fff', margin: 0 }}>Deine Email Adresse?</h2>
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
         <h2 style={{ color: '#fff', margin: 0 }}>Fast geschafft...</h2>
         <p style={{ color: '#cbd5e1' }}>Drücke auf "fertig" um den Prozess abzuschließen. Deine Bewertung des Meetings bekommst du dann per E-Mail zugeschickt.</p>
       </Step>
    </Stepper>
        </div>
        {/* --- /Stepper-Section --- */}
      </div>
    </div>
  );

}


export default App;

