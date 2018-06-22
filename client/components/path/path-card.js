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
           <h3>
             {this.props.name}
           </h3>
           <h3>
             {this.props.username}
           </h3>
           <h3>
             {this.props.rating}
           </h3>
         </Card>
        </Link>
      }
      </div>
    )
  }
}

export default PathCard

