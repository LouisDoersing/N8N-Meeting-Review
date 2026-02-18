import { motion } from 'motion/react';
import './InfoSection.css';
import BlurText from "../text/BlurText.jsx";

export default function InfoSection() {
  return (
    <section id="info" className="info-wrap">
        <motion.div
            initial={{opacity: 0, y: 16}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: 0.3}}
            transition={{duration: 0.45}}
            className="info-text"
        >
            <p>
                Lade einfach das Transkript deines Meetings hoch und mache in paar Angaben zu Dir und deinem Meeting – der Rest läuft automatisch.
                Anschließend analysiert unsere KI den Gesprächsverlauf, erkennt Strukturen, Dynamiken und inhaltliche Schwerpunkte und erstellt daraus ein
            gezieltes Feedback speziell für Dich.
        </p>
        <p>
          Das Besondere: Unser System wurde in enger Zusammenarbeit mit erfahrenen Meeting-Expert:innen entwickelt. Dadurch liefert die KI nicht nur oberflächliche Statistiken,
            sondern tiefgehende, inhaltlich fundierte Rückmeldungen zur Gesprächsführung. So erhältst du klare Empfehlungen, um zukünftige Meetings noch strukturierter, effizienter
            und wirkungsvoller zu gestalten.
        </p>
      </motion.div>
    </section>
  );
}
