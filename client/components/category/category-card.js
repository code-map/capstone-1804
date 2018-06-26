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
      <Link to={`/category/${props.category.name}`}>
        <Card>
          <h4>
            {props.category.name}
          </h4>
          <h4>
            {props.category.popularity}
          </h4>
        </Card>
      </Link>
    </div>
  )
}

export default CategoryCard
