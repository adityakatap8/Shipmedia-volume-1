import React from 'react'
import './CatalogueFestivals.css'
import { useNavigate } from "react-router-dom";
import logo1 from "../catalogueFestivals/media/row10Data.jpg"; 
import logo2 from "../catalogueFestivals/media/row2Data.jpg";
import logo3 from "../catalogueFestivals//media/row3Data.jpg"; 
import logo4 from "../catalogueFestivals//media/row4Data.jpg";
import logo5 from "../catalogueFestivals//media/row5Data.jpg";
import logo6 from "../catalogueFestivals//media/row6Data.jpg";
import logo7 from "../catalogueFestivals//media/row7Data.jpg";
import logo8 from "../catalogueFestivals//media/row8Data.png";
import logo9 from "../catalogueFestivals//media/row9Data.png";
import logo10 from "../catalogueFestivals//media/row10Data.jpg";

const CatalogueFestivals = () => {
  const navigate = useNavigate();

  const thumbnails = [
    { img: logo1, id: "row1Data", name:"Cannes Film Festival"},
    { img: logo2, id: "row2Data", name:"Berlin International Film Festival (Berlinale)"},
    { img: logo3, id: "row3Data", name:"Venice Film Festival"},
    { img: logo4, id: "row4Data", name:"Toronto International Film Festival (TIFF)"},
    { img: logo5, id: "row5Data", name:"Sundance Film Festival"},
    { img: logo6, id: "row6Data", name:"Tribeca Film Festival"},
    { img: logo7, id: "row7Data", name:"South by Southwest (SXSW)"},
    { img: logo8, id: "row8Data", name:"Telluride Film Festival"},
    { img: logo9, id: "row9Data", name:"AFI Fest"},
    { img: logo10, id: "row10Data", name:"New York Film Festival"},
  ];

  return (
    <div className='file-list m-2 p-2 '>

        <h3 style={{ marginBottom: "5px", marginTop:"2px" }}>Browse Festival</h3>
        <div className="file-preview-list">                    
            {thumbnails.map((file, index) => (
                <div key={index} className="file-preview-item">
                  <img src={file.img} alt={file.img} onClick={() => navigate("/page14", { state: { id: file.id } })} style={{ cursor: "pointer" }}  />
                  <h4 title={file.name}>{file.name}</h4>
                </div>
            ))}
        </div>

    </div>

  );
};

export default CatalogueFestivals