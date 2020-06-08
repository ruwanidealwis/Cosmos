//create stars
import React from "react";
var starArray = [];
const newSmallStar = () => {
  return (
    <div
      className="star"
      style={{
        top: Math.random() * 100 + "%",
        position: "fixed",
        left: Math.random() * 100 + "%",
        width: "1.5px",
        height: "1.5px"
      }}
    ></div>
  );
};
const createSmallStar = () => {
  for (let i = 0; i <= 200; i++) {
    let star = newSmallStar();

    starArray.push(star);
  }
};
const stars = () => {
  createSmallStar(starArray);
  console.log(starArray);
  return <div className="starArray">{starArray}</div>;
};
export default stars;
