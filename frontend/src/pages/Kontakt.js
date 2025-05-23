import "../styling/kontakt.css";
import "../styling/format.css";
import { Phone, Clock, MapPin } from 'lucide-react';

function Kontakt() {
  return (
    <div className="contact-container">

      <div className="contact-grid">

        <div className="contact-left">
          <h1 className="contact-title">Kontakt Oss</h1>
          <p>
            Har du andre problemer som ikke står her, eller har noe andre spørsmål?
            Vi holder til på enden av biblioteket på Greveskogen Videregående Skole.
          </p>

          <div className="contact-icons">
            <div className="contact-box">
              <MapPin size={23} style={{ marginTop: '7px' }} />
              <p>
                Greveskogen VGS<br />
                Eikveien 2, Tønsberg
              </p>
            </div>

            <div className="contact-box">
              <Clock size={23} style={{ marginTop: '7px' }} />
              <p>Åpningstider:<br />
                Mandag - Fredag, 08:00 - 15:30</p>
            </div>

            <div className="contact-box">
              <Phone size={23} />
              <p>480 37 348</p>
            </div>
          </div>
        </div>


        <form className="contact-form">
          <label>
            Navn:
            <input type="text" name="name" required />
          </label>
          <label>
            E-post:
            <input type="email" name="email" required />
          </label>
          <label>
            Problem:
            <textarea name="message" rows="5" required></textarea>
          </label>
          <button type="submit">Send inn sak</button>
        </form>
      </div>
    </div>
  );  
}   

export default Kontakt;
