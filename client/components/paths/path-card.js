import React from 'react'
import Card from '@material-ui/core/Card'
import { Link } from 'react-router-dom'
import {Stars} from '../reviews'

import history from '../../history'

import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'

const styles = {
  header: {
    display: 'flex',
    padding: 10
  },
  chip: {
    float: 'left'
  },
  content: {
    marginTop: 20,
    marginBottom: 40,
    paddingLeft: 40,
    paddingRight: 40
  },
  title: {
    fontSize: 16,
    lineHeight: 1.3,
    paddingBottom: 5
  },
  owner: {
    color: '#9E9E9E'
  },
  meta: {
    padding: '0 20px 30px 20px'
  },
  rating: {
    float: 'left'
  },
  subscribers: {
    float: 'right'
  }
}

const PathCard = ({ name, uid, slug, owner, rating, userCount, category}) => {

  function handleCategoryClick(event, cat){
    event.preventDefault()
    history.push(`/category/${cat}`);
  }

  return(
    <Card>
      <div style={styles.header}>
        <Chip
          style={styles.chip}
          avatar={<Avatar> {category.slice(0, 1).toUpperCase()} </Avatar>}
          label={category}
          clickable
          onClick={(event) => handleCategoryClick(event, category)}
        />
      </div>

      <div style={styles.content}>
        <Link to={`/paths/${uid}/${slug}`}>
          <Typography style={styles.title} align='center' variant="body2">{name}</Typography>
        </Link>
        <Typography style={styles.owner} align='center' variant="body2">by {owner}</Typography>
      </div>

      <div style={styles.meta}>
        <div style={styles.rating}>
          <Stars style={styles.rating} value={rating} />
        </div>
        <div style={styles.subscribers}>
        <Typography variant="body2">{userCount} Subscribers</Typography>
        </div>
      </div>
    </Card>
  )
}

export default PathCard

