import "../styling/format.css";
import Cases from '../components/cases';
import NewCase from '../components/new-case';
// import Request from '../components/request';

function Admin() {
  return (
    <>
      <div className="container">
        <h1>Administrering</h1>
        <NewCase />
        <button className="normal-button">Lag ny bruker</button>
      </div>

      <Cases Header="Konfigurering: Alle saker" Config={true}/>
    </>
  );  
}   

export default Admin;
