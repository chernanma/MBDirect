import React, { useEffect, useState } from "react";
import "./style.css";
import Row from "../Row";
import Col from "../Col";
import { Link } from "react-router-dom";
import * as FaIcons from 'react-icons/fa';
import * as BiIcons from 'react-icons/bi';
import * as MdIcons from 'react-icons/md';
import * as TiIcons from 'react-icons/ti';


function CardAd(props) { 
  const [companiesData, setCompaniesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [imageSRC, setImageSRC] = useState();

  useEffect(() => {
    setImageSRC(props.adResults.image);
    if(!props.adResults.image){
      setImageSRC(window.location.origin + "/images/no-image.png");     
    }
    setCompaniesData(props.companiesData);
    setUsersData(props.usersData)    
  }, [])

  return (
    <div className="card mb-3" id={props.adResults.id} key={props.adResults.key}>
      <div className="card-header">
        <Row>
          <Col size="md-10">
            <h3>
              {props.adResults.name}
            </h3>
          </Col>
          <Col size="md-2">            
              <>                
                <Link
                  to={`edit/${props.adResults.id}`}
                  className="btn btn-sm btn-primary mr-1"
                >
                  Edit
                </Link>
                <button id={props.adResults.id} value={props.adResults.id} onClick={props.deleteAd} className="btn btn-sm btn-danger" >
                  Delete
                </button>
              </>            
          </Col>
        </Row>
      </div>
      <div className="card-body">
        <Row>
          <Col size="md-4">
            <span>
              <h5><BiIcons.BiUserPin/> {props.adResults.id} </h5>              
            </span>
            <span>
              <h5><MdIcons.MdDescription/> {props.adResults.description}</h5> 
            </span>
            <span>
              <h5><FaIcons.FaPercent/> Discount: {props.adResults.discount} </h5>              
            </span>
            <span>
              <h5><TiIcons.TiTickOutline/> {props.adResults.status} </h5>              
            </span>
          </Col>
          <Col size="md-4">
            <span>
              <h5><FaIcons.FaRegCalendarPlus/> {props.adResults.start_date}</h5> 
            </span>
            <span>
                <h5><FaIcons.FaRegCalendarMinus/> {props.adResults.end_date}</h5>
            </span>
            <span>
              {companiesData.map((result) => (
                <>
                {result.id === props.adResults.CompanyId ? (
                  <h5 key={props.adResults.id}>
                    Company: {result.name}
                  </h5>
                ):(
                  <></>
                )}
                </>
              ))}                
            </span>
            <span>
            {usersData.map((result) => (
                <>
                {result.id === props.adResults.UserId ? (
                  <h5 key={props.adResults.id}>
                    User: {result.first_name} {result.last_name} 
                  </h5>
                ):(
                  <></>
                )}
                </>
              ))}       
            </span>   

          </Col>
          <Col size="md-4">
              <img className="rounded-circle img-fluid " src={imageSRC}
              data-holder-rendered="true" alt="adImage"/>           
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default CardAd;
