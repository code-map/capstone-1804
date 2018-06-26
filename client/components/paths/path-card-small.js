import React from 'react'
//import Card from '@material-ui/core/Card'
import { Redirect } from 'react-router'
import {Link} from 'react-router-dom'
import styled from "styled-components";


const Card = styled.div`
margin: 20px;
width: 400px;
height: 150px;
box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
display: flex;
padding: 0;
overflow:auto
`
const CardContent = styled.div`
  padding-left: 30px;
  box-sizing: border-box;

`


const PathCardSmall = (props) => {
   const {img, name, username, rating, description} = props
    return(
      <div>
      {
        // <Link to={`/`}>
          <Card >
            <img src={img} style={{height:150}}/>
            <CardContent>
              <h3>{name}</h3>
              <p>{rating}</p>
              <p>{description}</p>
            </CardContent>
          </Card>
        // </Link>
      }
      </div>
    )}


export default PathCardSmall
