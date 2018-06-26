import React from 'react'
import Card from '@material-ui/core/Card'
import { Redirect } from 'react-router'
import {Link} from 'react-router-dom'

const styles = {
  container: {
  }
}


class PathCardSmall extends React.Component {
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
            <p>
              {this.props.username}
            </p>
            <p>
              {this.props.rating}
            </p>
          </Card>
        </Link>
      }
      </div>
    )
  }
}

export default PathCardSmall
