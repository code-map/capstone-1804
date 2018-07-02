import React from 'react'
import {Stars} from '../reviews'
import {connect} from 'react-redux'

import {getAllReviewsOfResource} from '../../store'
import ResourceRating from './resource-rating'

import { Grid, Checkbox, List, ListItem, Collapse, Card, Typography, Chip} from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

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
    padding: 15
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    width: '100%'
  },
  textContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flexStart',
    alignItems: 'flexStart',
    width: '100%',
    paddingLeft: 20
  },
  title: {
    fontSize: 16,
    position: 'relative',
    top: 25
  },
  resourceType: {
    float: 'right',
    position: 'relative',
    right: 20
  },
  cover: {
    width: 75,
    height: 75,
    objectFit: 'cover'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flexStart',
    alignItems: 'flexStart',
    flexGrow: 10
  },
  ratingCount: {
    marginLeft: 5
  }
}

class ResourceCard extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      expanded : false,
      avgRating: 0,
      ratingCount: 0
    }
  }

  componentDidMount = async () => {
    const uid = this.props.resourceProperties.uid
    await this.props.getResourceReviews(uid)
  }

  handleDropdownCollapse = () => {
    this.setState({
      expanded: false,
    })
  }

  handleDropdownExpand = async () => {
    const uid = this.props.resourceProperties.uid
    await this.getAverageReviewRating(uid)

    this.setState({
      expanded: true,
    })
  }

  getAverageReviewRating = (uid) => {
    let avgRating = 0
    let ratingCount = 0

    const resourceReview = this.props.reviews.find((review) => {
      return review.hasOwnProperty(uid)
    })

    // console.log('resourceReview', resourceReview)

    if(resourceReview[uid].length > 0){
      const ratingTotal = resourceReview[uid].reduce((acc, review) => {
        return acc + review.score.low
      }, 0)

      ratingCount = resourceReview[uid].length
      avgRating = ratingTotal / ratingCount
    }

    this.setState({
      avgRating,
      ratingCount
    })
  }

  render() {
    const {isLoggedIn} = this.props
    const {classes, theme} = this.props
    const resourceImg = this.props.resourceProperties.imageUrl
    console.log('this.props.reviews', this.props.reviews)
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
                  <img style={styles.cover} src={resourceImg ? resourceImg : "../../default.png" } />
                </div>
                </a>
                <a className={classes.textContent} href={this.props.resourceProperties.url} target="_blank">
                <div>
                  <Grid container>
                    <Grid item xs={9}>
                      <Typography style={styles.title} variant="title"> {this.props.resourceProperties.name} </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <div style={styles.resourceType}>
                        { this.props.resourceProperties.type &&
                          <Chip label={this.props.resourceProperties.type} />
                        }
                      </div>
                    </Grid>
                  </Grid>
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
          <List component="div">
            <ListItem>
              <Stars value={this.state.avgRating}/>
              <span style={styles.ratingCount}>({this.state.ratingCount})</span>
            </ListItem>

            <ListItem>
              <ResourceRating />
            </ListItem>

            <ListItem>
              <Typography style={styles.description}><b>Description</b>: {this.props.resourceProperties.description}</Typography>
            </ListItem>
            { this.props.resourceProperties.level &&
              <ListItem>
                <Typography><b>Level</b>: {this.props.resourceProperties.level}</Typography>
              </ListItem>
            }
            <ListItem>
              <Typography>Visit <a href={this.props.resourceProperties.url} target="_blank">
                {this.props.resourceProperties.name}</a>
              </Typography>
            </ListItem>
          </List>
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
    reviews: state.reviews.allResourceReviews
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
