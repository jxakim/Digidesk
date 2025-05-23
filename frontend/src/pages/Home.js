import Cases from '../components/cases';
// import Request from '../components/request';

function Home() {
  return (
    <>
      <Cases Header="Nylige problemer" Crop={{amount: 3}}/>
    </>
  );  
}   

export default Home;
