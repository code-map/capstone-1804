import React from 'react'
import Card from '@material-ui/core/Card'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'

const styles = {
  container: {
    paddingBottom: 30,
    paddingTop: 20
  },
  header: {
    fontSize: 32,
    fontWeight: 300
  }
}

const CategoryCard = (props) => {
  return(
    <div>
      <Link to={`/category/${props.categoryName}`}>
        <Card style={styles.container}>
          <h2 style={styles.header}>{props.categoryName}</h2>
          <Button color="primary">
            {props.userCount} Subscribers
          </Button>
        </Card>
      </Link>
    </div>
  )
}

export default CategoryCard
