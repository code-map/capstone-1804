import React from 'react'
import {Stars} from '../reviews'
import {connect} from 'react-redux'

import {getAllReviewsOfResource} from '../../store'

import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import CardMedia from '@material-ui/core/CardMedia'
import Chip from '@material-ui/core/Chip'
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
    const {isLoggedIn} = this.props
    const {classes, theme} = this.props
    const resourceImg = this.props.resourceProperties.imageUrl
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

                <div className={classes.details}>
                  <i className="material-icons" onClick={()=>this.props.removeResourceCard()}>
                    clear
                  </i>
               </div>
              }


        </Card>
        <Collapse
          in      = {this.state.expanded}
          timeout = "auto" unmountOnExit
        >
          <List component="div">
            <ListItem>
              <Stars value={this.props.resourceProperties.rating} />
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
              <Typography>Link to <a href={this.props.resourceProperties.url} target="_blank">
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
