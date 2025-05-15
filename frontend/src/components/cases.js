import Card from './case-card';

import '../styling/cases.css';

function Case() {

  return (
    <div class="cases-container">
        <h2 class="header">Kjente henvendelser</h2>
        <div class="card-container">
            <Card />
            <Card />
            <Card />
        </div>
    </div>
  );
}

export default Case;
