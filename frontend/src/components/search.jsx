import React, { useState } from "react";

function Destination() {
  const [search, setSearch] = useState("");


  console.log(search)
  return (
    <div className="destinationSearch">
      <h1>Search</h1>
      <input 
        type="text" 
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </div>
  );
}

export default Destination;
