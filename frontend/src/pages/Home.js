import Cases from '../components/cases';
import "../styling/format.css";
// import Request from '../components/request';

function Home() {
  return (
    <>
      <div className="container">
        <h1>Digital Servicedesk</h1>
        <p>
          Velkommen til vår digitale Servicedesk.
          Her kan du se etter saker / problemer som vi holder på med, i tillegg til saker som er løst.
          Er det kanskje noe du sliter med og vi ikke er tilgjengelig, kan det hende at du finner en løsning her :)
        </p>
      </div>
      <Cases Header="Nylige problemer" Crop={{amount: 3}}/>

      <Cases Header="Løste problemer" Crop={{amount: 3}} Status="solved"/>
    </>
  );  
}   

export default Home;
