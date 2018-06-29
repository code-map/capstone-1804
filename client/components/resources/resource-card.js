import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import { Link } from 'react-router-dom'
import {ResourceReviews} from './'
import {Stars} from '../reviews'
import {connect} from 'react-redux'
import {getAllReviewsOfResource} from '../../store'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import PropTypes from 'prop-types';

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',

  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flexStart',
    alignItems: 'flexStart',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 120,
    height: 120,
  },
  type: {
    width: 120,
  },
  imageSide: {
    justifyContent: 'flexStart',
    alignItems: 'flexStart',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flexStart',
    alignItems: 'flexStart',
    flexGrow: 10
  }

}

class ResourceCard extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      expanded : false,
    }
    this.props.getResourceReviews(this.props.resourceProperties.name)
  }

  handleDropdownCollapse = () => {
    this.setState({
        expanded: false,
    })
  }

  handleDropdownExpand = (resourceName) => {
    this.setState({
        expanded: true,
    })
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn
    const {classes, theme} = this.props
    return(
      <div style={styles.container}>
          <Card className={classes.card}>
              <div className={classes.details}>
              {isLoggedIn &&
                <Checkbox
                  onChange={this.props.handleCompletedClick()}
                  checked={this.props.checkForComplete()}
                  disableRipple
                />
              }
              </div>
              <div className={classes.row}>
                <a href={this.props.resourceProperties.url} target="_blank">
                <div className={classes.imageSide}>
                    {
                      this.props.resourceProperties.imageUrl ?
                        <CardMedia className={classes.cover} image={this.props.resourceProperties.imageUrl} /> :
                        <CardMedia className={classes.cover} image="../../default.png" />
                    }
                </div>
                </a>
                <a href={this.props.resourceProperties.url} target="_blank">
                <div className={classes.textContent}>
                    <Typography variant="title"> {this.props.resourceProperties.name} </Typography>
                    <Typography variant="subheading"> {this.props.resourceProperties.level} </Typography>
                    <Stars value={this.props.resourceProperties.rating} />
                </div>
                </a>
              </div>
              <div className={classes.details}>
                { this.state.expanded ?
                  <ExpandLess onClick={() => this.handleDropdownCollapse()} /> :
                  <ExpandMore onClick={() => this.handleDropdownExpand()} />
                }
              </div>
        </Card>
        <Collapse
          in      = {this.state.expanded}
          timeout = "auto" unmountOnExit
        >
          <List component="div" disablePadding>
            <ListItem button>
              <ListItemText className={classes.cover}>
                type: {this.props.resourceProperties.type}
              </ListItemText>
              <ListItemText >
                {this.props.resourceProperties.description}
              </ListItemText>
            </ListItem>
          </List>
          <ResourceReviews resourceName={this.props.resourceProperties.name} reviews={this.props.reviews}/>
        </Collapse>
        
      </div>
    )
  }
}

ResourceCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapState = (state) => {
  return({
    reviews: state.resource.reviews
  })
}

const mapDispatch = (dispatch) => {
  return({
    getResourceReviews : (resourceName) => {
      dispatch(getAllReviewsOfResource(resourceName))
    }
  })
}

export default connect(mapState, mapDispatch)(withStyles(styles, { withTheme: true })(ResourceCard))
