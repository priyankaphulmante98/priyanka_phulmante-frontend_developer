import React from "react";

function Navbar() {
  function myFunction() {}
  return (
    <div>
      {
        <header>
          <div className="toggle-btn" onClick={() => myFunction()}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="logo">
            <img
              src="https://thumbs.dreamstime.com/b/illustration-deep-space-spacex-logo-over-vector-stars-195641422.jpg"
              alt=""
            />
          </div>

          <nav id="nav">
            <ul>
              <li to="#">MISSION</li>
              <li to="#">LAINCHES</li>
              <li to="#">CAREERS</li>
              <li to="#">UPDATES</li>
              <li to="#">HUMAN SPACEFLIGHT</li>{" "}
            </ul>
          </nav>
        </header>
      }
    </div>
  );
}

export default Navbar;
