import React from "react";

function Banner() {
  return (
    <div className="main-banner-banner-div">
      <div className="left_content_div">
        <div style={{ width: "500px", fontWeight: "bold", padding: "10px" }}>
          <h1 style={{ fontSize: "25px", marginBottom: "10px" }}>
            Vision for Space Exploration
          </h1>
          SpaceX, founded by Elon Musk, is known for its innovative spacecraft,
          including the Dragon capsule. The Dragon capsule is a versatile
          spacecraft designed for cargo and crew missions to the International
          Space Station (ISS). It features an autonomous docking system and is
          used for resupply missions under NASA's Commercial Resupply Services
          program. The Crew Dragon variant transports astronauts, becoming the
          first commercial spacecraft to carry humans to the ISS. It exemplifies
          SpaceX's commitment to advancing space exploration through
          cutting-edge technology and private-sector partnerships.
        </div>
      </div>

      <div className="right_img_div">
        <img
          src="https://scitechdaily.com/images/Futuristic-Medicine-Health-Data-Biotechnology.gif"
          style={{ width: "700px", height: "350px", float: "right" }}
          alt="priya"
        />
      </div>
    </div>
  );
}

export default Banner;
