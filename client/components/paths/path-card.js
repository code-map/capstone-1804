import React from 'react'
import Card from '@material-ui/core/Card'
import { Redirect } from 'react-router'
import {Link} from 'react-router-dom'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid',
    maxWidth: '600px'
  }
}


class PathCard extends React.Component {
  constructor(props){
    super(props)
  }
  render() {
    return(
      <div style={styles.card} >
      {
        <Link to={`/path/${this.props.id}`}>
         <Card>
           <h2>
             {this.props.name}
           </h2>
           <h3>
             by: 
             {this.props.owner}
           </h3>
           <h5>
             rating: 
             {this.props.rating}
           </h5>
           <h5>
             subscribers: 
             {this.props.userCount}
           </h5>
         </Card>
        </Link>
      }
      </div>
    )
  }
}

export default PathCard

