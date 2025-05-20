import '../../styling/login-card.css';

function LoginCard() {

  return (
    <div className="test">
      <div className="login-card">
          <h3>Logg inn</h3>
          <form>
            <input type="text" placeholder="Brukernavn" required />
            <input type="password" placeholder="Passord" required />
            <button type="submit">Logg inn</button>
          </form>
      </div>
    </div>
  );
}

export default LoginCard;
