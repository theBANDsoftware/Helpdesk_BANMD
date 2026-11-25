import { Link } from 'react-router';
import { categoryLabels } from '../tickets/ticketsApi';
import { faqSections } from './faqData';

/**
 * FAQ (TB-77). En sida med vanliga problem och korta lösningar,
 * så att den som har ett enkelt fel kan lösa det själv i stället för att anmäla.
 *
 * Svaren fälls ut med <details> och <summary>, som webbläsaren själv gör
 * klickbara och möjliga att nå med tangentbordet.
 */
export default function FaqPage() {
  return (
    <section className="card">
      <h2>FAQ</h2>
      <p>Här är de problem IT får flest ärenden om. Klicka på en fråga för att se svaret.</p>

      {faqSections.map((section) => (
        <div key={section.category} className="faq-section">
          <h3>{categoryLabels[section.category]}</h3>
          {section.items.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      ))}

      <div className="faq-footer">
        <p>Hittade du inget svar?</p>
        <Link className="button" to="/tickets/new">
          Anmäl ett fel
        </Link>
      </div>
    </section>
  );
}
