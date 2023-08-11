import React from "react";
function Tablemini(prop) {
  const data = prop.data;
  let trendz = data.trend == 3 ? "Significant rise" : (data.trend == 2 ? "Minor rise" : (data.trend == 1) ? "No rise" : data.trend)
  // console.log("tabledata"+JSON.stringify(data));
  return (
    <tr bgcolor="#e5e5e5" key={data.id}  >
      <td style={prop.stylz}>{data.name}</td><td>{Number(data.velocityX).toFixed(2)}</td><td>{Number(data.velocityY).toFixed(2)}</td><td>{Number(data.velocityZ).toFixed(2)}</td><td>{Number(data.temperature).toFixed(2)}</td><td>{(data.healthScore == 0) ? "NA" : data.healthScore + "%"}</td><td>{trendz}</td></tr>

  )
}
export default Tablemini;