import "../styling/format.css";
import Cases from '../components/cases';
// import Request from '../components/request';

function Admin() {
  return (
    <>
      <div className="container">
        <h1>Administrering</h1>
        <button className="normal-button">Lag ny sak</button>
        <button className="normal-button">Lag ny bruker</button>
      </div>

      <Cases Header="Konfigurering: Alle saker" Config={true}/>
    </>
  );  
}   

export default Admin;
