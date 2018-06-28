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
    const { name, uid, slug, owner, rating, userCount} = this.props
    return(
      <div style={styles.card} >
      {
        <Link to={`/paths/${uid}/${slug}`}>
         <Card>
           <h2>
             {name}
           </h2>
           <h3>
             by:
             {owner}
           </h3>
           <h5>
             rating:
             {rating}
           </h5>
           <h5>
             subscribers:
             {userCount}
           </h5>
         </Card>
        </Link>
      }
      </div>
    )
  }
}

export default PathCard

