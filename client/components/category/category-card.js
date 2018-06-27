import React from 'react'
import Card from '@material-ui/core/Card'
import { Link } from 'react-router-dom'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid',
    maxWidth: '600px'
  }
}

const CategoryCard = (props) => {
  return(
    <div>
      <Link to={`/category/${props.categoryName}`}>
        <Card>
          <h2>
            {props.categoryName}
          </h2>
          <h5>
            subscribers: 
            {props.userCount}
          </h5>
        </Card>
      </Link>
    </div>
  )
}

export default CategoryCard
