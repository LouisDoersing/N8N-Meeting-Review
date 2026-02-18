import './App.css';
import BlurText from './text/BlurText.jsx';
import TextType from './text/TextType.jsx';
import Stepper, { Step } from './components/Stepper.jsx';
import { useState } from 'react';
import FileUploader from "./components/FileUploader.jsx";
import FadeContent from "./motion/FadeContent.jsx";
import InfoSection from './components/InfoSection.jsx';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // States für Allgemeine Fragen
  const [meetingGoalType, setMeetingGoalType] = useState('none');
  const [meetingGoalText, setMeetingGoalText] = useState('');

  // NEU: Multi-Auswahl für Meeting-Typen
  const [selectedMeetingTypes, setSelectedMeetingTypes] = useState([]);
  const [customMeetingType, setCustomMeetingType] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitOk, setSubmitOk] = useState(false);

  const API_URL = 'HIER_BEREITGESTELLTE_URL_EINFÜGEN';

  // Meeting-Typ Optionen mit mehr Auswahlmöglichkeiten
  const meetingTypeOptions = [
    { value: 'team-daily', label: 'Teammeeting / Daily', icon: '👥', description: 'Regelmäßige Teamabstimmung' },
    { value: 'project', label: 'Projektmeeting', icon: '📋', description: 'Projektbezogene Besprechung' },
    { value: 'decision', label: 'Entscheidungsmeeting', icon: '✅', description: 'Entscheidungen treffen' },
    { value: 'information', label: 'Informationsmeeting', icon: '📢', description: 'Informationen weitergeben' },
    { value: 'brainstorm', label: 'Brainstorming', icon: '💡', description: 'Ideen sammeln & entwickeln' },
    { value: 'problem-solving', label: 'Problemlösung', icon: '🔧', description: 'Probleme analysieren & lösen' },
    { value: 'review', label: 'Fortschrittskontrolle', icon: '📊', description: 'Status & Fortschritt prüfen' },
    { value: 'alignment', label: 'Kurze Abstimmung', icon: '⚡', description: 'Schnelle Klärung eines Themas' },
    { value: 'workshop', label: 'Workshop', icon: '🎯', description: 'Vertiefte Arbeit an einem Thema' },
    { value: 'client', label: 'Kundenmeeting', icon: '🤝', description: 'Kundengespräch oder -präsentation' },
    { value: 'planning', label: 'Planungsmeeting', icon: '📅', description: 'Planung von Aufgaben & Zeiträumen' },
    { value: 'retro', label: 'Retrospektive', icon: '🔄', description: 'Rückblick & Verbesserungen' },
  ];

  // Handler für Multi-Auswahl der Meeting-Typen
  const handleMeetingTypeToggle = (typeValue) => {
    setSelectedMeetingTypes(prev => {
      if (prev.includes(typeValue)) {
        return prev.filter(t => t !== typeValue);
      } else {
        return [...prev, typeValue];
      }
    });
  };

  // Hilfsfunktion: prüft, ob Meetingziel-Text max. 2 Sätze hat und max. 150 Zeichen
  const isGoalTextValid = () => {
    if (meetingGoalType === 'none') return true;
    const text = meetingGoalText.trim();
    if (!text) return false;

    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(Boolean);

    const charCount = text.length;

    return sentences.length > 0 &&
           sentences.length <= 2 &&
           charCount > 0 &&
           charCount <= 150;
  };

  // Step-Validatoren
  const validators = [
    () => selectedFile !== null,
    () => isGoalTextValid() && (selectedMeetingTypes.length > 0 || customMeetingType.trim() !== ''),
    () => name.trim() !== '',
    () => email.trim() !== '',
    () => true
  ];

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  // Funktion zum Aktualisieren des MeetingGoalText mit Zeichenlimit
  const handleMeetingGoalTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= 150 || newText.length < meetingGoalText.length) {
      setMeetingGoalText(newText);
    }
  };

  async function handleFinalSubmit() {
  try {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitOk(false);

    const form = new FormData();

    // 1) File
    form.append('file', selectedFile);

    // 2) Simple fields
    form.append('name', name.trim());
    form.append('email', email.trim());

    // 3) Goal (nur wenn gesetzt)
    const goal = meetingGoalType === 'text' ? meetingGoalText.trim() : '';
    form.append('goal', goal);

    // 4) Types (mehrfaches Feld -> kommt in n8n als Array an)
    selectedMeetingTypes.forEach((t) => form.append('types', t));

    // Optional: custom type als extra "types"
    if (customMeetingType.trim()) {
      form.append('types', customMeetingType.trim());
    }

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
    setSubmitError(err?.message || 'Unbekannter Fehler');
  } finally {
    setIsSubmitting(false);
  }
}


  return (
    <div>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#000', marginTop: '2rem' }}>
        <h1 className="h1-style glow">
          <BlurText
            text="Meetingschmiede"
            className="h1-text"
            delay={10}
            animateBy="words"
            direction="top"
            animationFrom={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
            animationTo={[{ opacity: 1, y: 0, filter: 'blur(0px)' }]}
            onAnimationComplete={handleAnimationComplete}
          />
        </h1>

        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <h2 style={{ fontSize: '1.5rem' }}>
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
          <div
            style={{
              marginTop: '5rem',
              background: '#262626',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 6px 24px rgba(0,0,0,.25)'
            }}
          >
            <Stepper
              initialStep={1}
              onStepChange={(step) => { console.log(step); }}
              onFinalStepCompleted={handleFinalSubmit}
              backButtonText="Zurück"
              nextButtonText={isSubmitting ? 'Wird gesendet…' : 'Weiter'}
              validators={validators}
            >
              {/* 1. Datei hochladen */}
              <Step>
                <h2 style={{ color: '#fff', margin: 0 }}>Datei hochladen</h2>
                <div style={{ marginTop: '1em' }}>
                  <FileUploader onFileSelect={setSelectedFile} />
                </div>
              </Step>

              {/* 2. Allgemeine Fragen mit Multi-Auswahl */}
              <Step>
                <div style={{ maxWidth: '650px', margin: '0 auto' }}>
                  <h2 style={{
                    color: '#fff',
                    marginBottom: '2rem',
                    fontSize: '1.8rem',
                    textAlign: 'center'
                  }}>
                    Allgemeine Fragen
                  </h2>

                  {/* Frage 1: Ziel des Meetings */}
                  <div style={{
                    marginBottom: '2rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      <span style={{
                        background: 'rgba(56, 161, 105, 0.2)',
                        color: '#38a169',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>1</span>
                      <h3 style={{
                        color: '#fff',
                        margin: 0,
                        fontSize: '1.2rem',
                        fontWeight: '500'
                      }}>
                        Was ist das Ziel des Meetings?
                      </h3>
                    </div>

                    <div style={{
                      display: 'grid',
                      gap: '0.75rem',
                      marginBottom: '1.5rem'
                    }}>
                      {/* Option 1: Kein Meetingziel */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="radio"
                          name="meeting-goal"
                          value="none"
                          checked={meetingGoalType === 'none'}
                          onChange={() => setMeetingGoalType('none')}
                          style={{ display: 'none' }}
                        />
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '1rem 1.25rem',
                          background: meetingGoalType === 'none' ? 'rgba(56, 161, 105, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${meetingGoalType === 'none' ? '#38a169' : 'rgba(255, 255, 255, 0.15)'}`,
                          borderRadius: '10px',
                          transition: 'all 0.2s',
                          flex: 1
                        }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${meetingGoalType === 'none' ? '#38a169' : '#718096'}`,
                            background: meetingGoalType === 'none' ? '#38a169' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}>
                            {meetingGoalType === 'none' && (
                              <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: 'white'
                              }}></span>
                            )}
                          </div>
                          <div>
                            <div style={{
                              color: '#fff',
                              fontWeight: '500',
                              marginBottom: '0.25rem'
                            }}>
                              Kein Meetingziel
                            </div>
                            <div style={{
                              color: '#94a3b8',
                              fontSize: '0.9rem'
                            }}>
                              Ohne vordefiniertes Ziel fortfahren
                            </div>
                          </div>
                        </div>
                      </label>

                      {/* Option 2: Meetingziel beschreiben */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="radio"
                          name="meeting-goal"
                          value="text"
                          checked={meetingGoalType === 'text'}
                          onChange={() => setMeetingGoalType('text')}
                          style={{ display: 'none' }}
                        />
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '1rem 1.25rem',
                          background: meetingGoalType === 'text' ? 'rgba(56, 161, 105, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${meetingGoalType === 'text' ? '#38a169' : 'rgba(255, 255, 255, 0.15)'}`,
                          borderRadius: '10px',
                          transition: 'all 0.2s',
                          flex: 1
                        }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${meetingGoalType === 'text' ? '#38a169' : '#718096'}`,
                            background: meetingGoalType === 'text' ? '#38a169' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}>
                            {meetingGoalType === 'text' && (
                              <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: 'white'
                              }}></span>
                            )}
                          </div>
                          <div>
                            <div style={{
                              color: '#fff',
                              fontWeight: '500',
                              marginBottom: '0.25rem'
                            }}>
                              Meetingziel beschreiben
                            </div>
                            <div style={{
                              color: '#94a3b8',
                              fontSize: '0.9rem'
                            }}>
                              Gib bis zu zwei Sätze ein (max. 150 Zeichen)
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>

                    {meetingGoalType === 'text' && (
                      <div style={{ marginTop: '1rem' }}>
                        <textarea
                          value={meetingGoalText}
                          onChange={handleMeetingGoalTextChange}
                          placeholder="Zum Beispiel: 'Wir wollen die Projektziele für Q4 definieren und Zuständigkeiten klären.'"
                          rows={4}
                          style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.07)',
                            color: '#fff',
                            border: meetingGoalText.length > 150 ? '1px solid #f56565' : '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            padding: '1rem',
                            fontSize: '1rem',
                            lineHeight: '1.5',
                            resize: 'vertical',
                            outline: 'none',
                            fontFamily: 'inherit',
                            transition: 'border 0.2s'
                          }}
                        />
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '0.5rem',
                          fontSize: '0.85rem',
                          color: '#94a3b8'
                        }}>
                          <span>Tipp: Halte dein Ziel präzise und messbar</span>
                          <span style={{
                            color: meetingGoalText.length > 150 ? '#f56565' : '#94a3b8',
                            fontWeight: meetingGoalText.length > 150 ? 'bold' : 'normal'
                          }}>
                            {meetingGoalText.length}/150 Zeichen
                          </span>
                        </div>
                      </div>
                    )}

                    {!isGoalTextValid() && meetingGoalType === 'text' && (
                      <div style={{
                        background: 'rgba(245, 101, 101, 0.1)',
                        border: '1px solid #f56565',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        marginTop: '1rem'
                      }}>
                        <p style={{
                          color: '#f56565',
                          margin: 0,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span>⚠️</span>
                          {meetingGoalText.length > 150
                            ? 'Bitte halte dich an maximal 150 Zeichen.'
                            : meetingGoalText.trim() === ''
                            ? 'Bitte gib dein Meetingziel ein.'
                            : 'Bitte gib maximal zwei Sätze ein.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Frage 2: Art des Meetings - MULTI-AUSWAHL */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      <span style={{
                        background: 'rgba(56, 161, 105, 0.2)',
                        color: '#38a169',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>2</span>
                      <div>
                        <h3 style={{
                          color: '#fff',
                          margin: 0,
                          fontSize: '1.2rem',
                          fontWeight: '500',
                          marginBottom: '0.25rem'
                        }}>
                          Welche Art von Meeting ist das?
                        </h3>
                        <p style={{
                          color: '#94a3b8',
                          fontSize: '0.9rem',
                          margin: 0
                        }}>
                          Mehrfachauswahl möglich - Meetings haben oft mehrere Zwecke
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '0.75rem',
                      marginBottom: '1.5rem'
                    }}>
                      {meetingTypeOptions.map((type) => {
                        const isSelected = selectedMeetingTypes.includes(type.value);
                        return (
                          <div
                            key={type.value}
                            onClick={() => handleMeetingTypeToggle(type.value)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              padding: '1.25rem 1rem',
                              background: isSelected ? 'rgba(56, 161, 105, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                              border: `2px solid ${isSelected ? '#38a169' : 'rgba(255, 255, 255, 0.15)'}`,
                              borderRadius: '10px',
                              transition: 'all 0.2s',
                              height: '100%',
                              cursor: 'pointer',
                              position: 'relative'
                            }}
                          >
                            {isSelected && (
                              <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '20px',
                                height: '20px',
                                background: '#38a169',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem'
                              }}>
                                ✓
                              </div>
                            )}
                            <div style={{
                              fontSize: '1.75rem',
                              marginBottom: '0.5rem'
                            }}>
                              {type.icon}
                            </div>
                            <div style={{
                              color: '#fff',
                              fontWeight: '500',
                              marginBottom: '0.25rem',
                              fontSize: '0.95rem'
                            }}>
                              {type.label}
                            </div>
                            <div style={{
                              color: '#94a3b8',
                              fontSize: '0.85rem',
                              lineHeight: '1.3'
                            }}>
                              {type.description}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Eigene Bezeichnung */}
                    <div style={{
                      marginTop: '1.5rem',
                      paddingTop: '1.5rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <h4 style={{
                        color: '#fff',
                        fontSize: '1rem',
                        marginBottom: '0.75rem'
                      }}>
                        Eigene Bezeichnung (optional)
                      </h4>
                      <input
                        value={customMeetingType}
                        onChange={(e) => setCustomMeetingType(e.target.value)}
                        placeholder="z.B. Kick-off, Retrospektive, Leadership-Meeting …"
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.07)',
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          padding: '0.875rem 1rem',
                          fontSize: '1rem',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                      <p style={{
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                        marginTop: '0.5rem'
                      }}>
                        Wird zu den ausgewählten Typen hinzugefügt
                      </p>
                    </div>

                    {/* Ausgewählte Typen anzeigen */}
                    {selectedMeetingTypes.length > 0 && (
                      <div style={{
                        background: 'rgba(56, 161, 105, 0.1)',
                        border: '1px solid rgba(56, 161, 105, 0.3)',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginTop: '1rem'
                      }}>
                        <div style={{
                          color: '#38a169',
                          fontWeight: '500',
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span>📋</span>
                          Ausgewählte Meeting-Typen:
                        </div>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}>
                          {selectedMeetingTypes.map(typeValue => {
                            const type = meetingTypeOptions.find(t => t.value === typeValue);
                            return (
                              <span key={typeValue} style={{
                                background: 'rgba(56, 161, 105, 0.2)',
                                color: '#fff',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '16px',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}>
                                {type.icon} {type.label}
                              </span>
                            );
                          })}
                          {customMeetingType.trim() !== '' && (
                            <span style={{
                              background: 'rgba(107, 114, 128, 0.2)',
                              color: '#fff',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '16px',
                              fontSize: '0.85rem'
                            }}>
                              ✏️ {customMeetingType}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Validierungsmeldung */}
                    {selectedMeetingTypes.length === 0 && customMeetingType.trim() === '' && (
                      <div style={{
                        background: 'rgba(245, 101, 101, 0.1)',
                        border: '1px solid #f56565',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        marginTop: '1rem'
                      }}>
                        <p style={{
                          color: '#f56565',
                          margin: 0,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span>⚠️</span>
                          Bitte wähle mindestens einen Meeting-Typ aus oder gib eine eigene Bezeichnung ein.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Step>

              {/* 3. Name */}
              <Step>
                <div style={{ maxWidth: '650px', margin: '0 auto' }}>
                  <h2 style={{ color: '#fff', margin: 0 }}>Wie ist dein Name?</h2>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Gib hier deinen Namen ein..."
                    style={{
                      marginTop: '1.5rem',
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.07)',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '0.875rem 1rem',
                      fontSize: '1rem',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </Step>

              {/* 4. Email */}
              <Step>
                <div style={{ maxWidth: '650px', margin: '0 auto' }}>
                  <h2 style={{ color: '#fff', margin: 0 }}>Deine E-Mail-Adresse?</h2>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-Mail-Adresse für das Ergebnis"
                    type="email"
                    style={{
                      marginTop: '1.5rem',
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.07)',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '0.875rem 1rem',
                      fontSize: '1rem',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                  <p style={{
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    marginTop: '0.75rem'
                  }}>
                    Du erhältst deine Meeting-Analyse an diese E-Mail-Adresse.
                  </p>
                </div>
              </Step>

              {/* 5. Abschluss */}
              <Step>
                <div style={{ maxWidth: '650px', margin: '0 auto' }}>
                  <h2 style={{ color: '#fff', margin: 0 }}>Fast geschafft...</h2>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginTop: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>
                      Drücke auf "Fertig" um den Prozess abzuschließen. Deine detaillierte Bewertung des Meetings
                      bekommst du dann per E-Mail zugeschickt.
                    </p>

                    {isSubmitting && (
                      <div style={{
                        background: 'rgba(56, 161, 105, 0.1)',
                        border: '1px solid rgba(56, 161, 105, 0.3)',
                        borderRadius: '8px',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}>
                        <div className="spinner" style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid #38a169',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        <span style={{ color: '#38a169' }}>
                          Daten werden gesendet… Bitte schließe das Fenster nicht.
                        </span>
                      </div>
                    )}

                    {submitOk && (
                      <div style={{
                        background: 'rgba(56, 161, 105, 0.1)',
                        border: '1px solid rgba(56, 161, 105, 0.3)',
                        borderRadius: '8px',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}>
                        <span style={{ fontSize: '1.25rem' }}>🎉</span>
                        <div>
                          <div style={{ color: '#38a169', fontWeight: '500' }}>
                            Erfolgreich übermittelt!
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            Deine Meeting-Analyse wird jetzt erstellt und dir per E-Mail zugeschickt.
                          </div>
                        </div>
                      </div>
                    )}

                    {submitError && (
                      <div style={{
                        background: 'rgba(245, 101, 101, 0.1)',
                        border: '1px solid #f56565',
                        borderRadius: '8px',
                        padding: '1rem'
                      }}>
                        <div style={{ color: '#f56565', fontWeight: '500', marginBottom: '0.25rem' }}>
                          Fehler beim Senden
                        </div>
                        <div style={{ color: '#fca5a5', fontSize: '0.9rem' }}>
                          {submitError}
                        </div>
                        <button
                          onClick={handleFinalSubmit}
                          style={{
                            marginTop: '0.75rem',
                            background: '#f56565',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          Erneut versuchen
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Step>
            </Stepper>
          </div>
        </FadeContent>
        {/* --- /Stepper-Section --- */}
      </div>

      {/* Spinner Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;