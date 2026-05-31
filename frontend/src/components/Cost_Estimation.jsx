import React, { useState } from "react";

function CostEstimator() {
  const [hotel, setHotel] = useState(150);
  const [food, setFood] = useState(30);
  const [transport, setTransport] = useState(10);
  const [people, setpeople] = useState(5);
  const [days, setdays] = useState(5);
  const [entertainment, setEntertainment] = useState(100);
  const [emergency, setEmergency] = useState(200);
  const [budget, setBudget] = useState(90);
  const [suvenier, setsuvenier] = useState(300)
  const hotelPrice = hotel * days * people;
  const foodPrice = food * days * people;
  const transportPrice = transport * days * people;
  const entertainmentPrice = entertainment * days * people;
  const total = hotelPrice + foodPrice + transportPrice + entertainmentPrice + emergency
  const perPerson = total / people;
  const PerPersonPerDay = perPerson / days;
  const hotelPercent = ((hotelPrice / total) * 100).toFixed(2);
  const foodPercent = ((foodPrice/ total) * 100).toFixed(2);
  const transportPercent = ((transportPrice / total) * 100).toFixed(2);
  const entertainmentPercent = ((entertainmentPrice / total) * 100).toFixed(2);
  const emergencyPercent = ((emergency / total) * 100).toFixed(2);
  const allPercent = hotelPercent + foodPercent + transportPercent + entertainmentPercent + emergencyPercent
  console.log(allPercent)
   
  

  return (
    <div className="Calculator">
      <h2>Trip Budget Calculator estimate</h2>
        <div className="inputs">

      <label>Days: </label>
      <input type="number" value={days} min="1"   onChange={e => setdays(+e.target.value || 0)} /><br/>
      
      <label>People: </label>
      <input type="number" value={people} min="1" onChange={e => setpeople(+e.target.value || 0)} /><br/>
      
      <label>Hotel per night (€): </label>
      <input type="number" value={hotel} onChange={e => setHotel(+e.target.value || 0)} /><br/>
      
      <label>Food per day (€): </label>
      <input type="number" value={food} onChange={e => setFood(+e.target.value || 0)} /><br/>
      
      <label>Transport per day (€): </label>
      <input type="number" value={transport} onChange={e => setTransport(+e.target.value || 0)} /><br/>
      
      <label>Entertainment (€): </label>
      <input type="number" value={entertainment} onChange={e => setEntertainment(+e.target.value || 0)} /><br/>
      
      <label>Emergency (€): </label>
      <input type="number" value={emergency} onChange={e => setEmergency(+e.target.value || 0)} /><br/>
      </div>

      <div className="estimated">
      <h2>Estimated Costs:</h2>
      <h3>Hotel: {hotelPrice}</h3>
      <h3>Food: {foodPrice}</h3>
      <h3>Transport: {transportPrice}</h3>
      <h3>Entertainment: {entertainmentPrice}</h3>
      <h3>Emergency: {emergency}</h3>
      <h3>Total group cost: €{total}</h3>   
      <h3>Per person total: {perPerson}</h3>
      <h3>Per person per day: {PerPersonPerDay}</h3>
    </div>
      <div className="dashboard">
        <h2>Summary Dashboard</h2>
        <h3>Hotel %of total cost: {hotelPercent}%</h3>
      <h3>Food %of total cost: {foodPercent}%</h3>
      <h3>Transport %of total cost: {transportPercent}%</h3>
      <h3>Entertainment  %of total cost: {entertainmentPercent}%</h3>
      <h3>Emergency % of total cost: {emergencyPercent}%</h3>
      </div>
      </div>
      
  );
}

export default CostEstimator;
