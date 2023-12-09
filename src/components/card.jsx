// Card.js
import React from 'react';
import './card.css';
import profile from '../assets/profile.svg'
import circle from '../assets/circle.png'
import warning from '../assets/warning.png'
import menu from '../assets/menu.png'
const Card = ({ ticket }) => {
  return (
    <div className="card " style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <p className='fcolor fsize1'>{ticket.id}</p>
    <img src={profile}></img>
  </div>
  <h3 className='fsize2'>{ticket.title}</h3>
  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
    <img src={menu} width={25}></img>
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap:'5px'}}>
      <img src={circle} width={13}></img>
      <span className='fcolor fsize1' style={{}}> Feature Request</span>
    </span>
  </div>
</div>


  );
};

export default Card;
