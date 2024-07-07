import React, { useState } from 'react';
import './crad.css';
import CardWork from './cradswrork';
import CardSuccess from './cradsuccessfully';
import CardDeadline from './craddeadline';
function Crads() {
  const [activeButton, setActiveButton] = useState('primary');

  const showCard = (cardId) => {
    setActiveButton(cardId);
  };

  return (
    <div>
      <div className="App">
        <button
          id="primaryButton"
          className={`button ${activeButton === 'primary' ? 'active' : ''}`}
          style={{ backgroundColor: activeButton === 'primary' ? '#1976d2' : 'gray' }}
          onClick={() => showCard('primary')}
        >
          Work
        </button>
       
        <button
          id="successButton"
          className={`button ${activeButton === 'success' ? 'active' : ''}`}
          style={{ backgroundColor: activeButton === 'success' ? '#5bca60' : 'gray' }}
          onClick={() => showCard('success')}
        >
          SuccessFully
        </button>
        <button
          id="errorButton"
          className={`button ${activeButton === 'error' ? 'active' : ''}`}
          style={{ backgroundColor: activeButton === 'error' ? '#d32f2f' : 'gray' }}
          onClick={() => showCard('error')}
        >
          Deadline
        </button>
      </div>
      <div>
        {activeButton === 'primary' && (
          <div id="primaryCard" className="card">
            <h6>WORK</h6>
            <CardWork />
          </div>
        )}
        {activeButton === 'success' && (
          <div id="successCard" className="card">
                <h6>SuccessFully</h6>
                <CardSuccess/>
          </div>
        )}
        {activeButton === 'error' && (
          <div id="errorCard" className="card">
             <h6>Deadline</h6>
            <CardDeadline/>
            </div>
        )}
      </div>
    </div>
  );
}

export default Crads;
