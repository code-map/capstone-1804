import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import { Link } from 'react-router-dom'
import {ResourceReviews} from './'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

//type of media
//name
//description
//link
//ratings
//dropdown
//reviews and feedback

//component properties are:
//name
//url
//type
//imageUrl
//description
//ratings
//isAuth = true/false (

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid'
  }
}

class ResourceCard extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      expanded : false,
    }
  }

  handleDropdownCollapse = () => {
    this.setState({
        expanded: false,
    })
  }

  handleDropdownExpand = () => {
    this.setState({
        expanded: true,
    })
  }

  render() {
    let {isLoggedIn} = this.props
    isLoggedIn = true
    console.log('resourceProperties', this.props.resourceProperties)
    return(
      <div style={styles.container}>

          <ListItem
            role={undefined}
            dense
            button
            disableRipple
          >
            {isLoggedIn &&
              <Checkbox
                onChange={this.props.handleCompletedClick()}
                checked={this.props.checkForComplete()}
                disableRipple
              />
            }

            <a href={this.props.resourceProperties.url} target="_blank">
              {
                this.props.resourceProperties.imageUrl ?
                  <img src={this.props.resourceProperties.imageUrl} width={75} /> :
                  <img src="../../default.png" width={75} />
              }

              <ListItemText primary={this.props.resourceProperties.name} />
              <ListItemText>
                level: {this.props.resourceProperties.level}
              </ListItemText>

              <ListItemText>
                rating: {this.props.resourceProperties.rating}
              </ListItemText>

            </a>

            { this.state.expanded ?
              <ExpandLess onClick={() => this.handleDropdownCollapse()} /> :
              <ExpandMore onClick={() => this.handleDropdownExpand()} />
            }

          </ListItem>
        <Collapse
          in      = {this.state.expanded}
          timeout = "auto" unmountOnExit
        >
          <List component="div" disablePadding>
            <ListItem button>
              <ListItemText>
                description: {this.props.resourceProperties.description}
              </ListItemText>
              <ListItemText>
                type: {this.props.resourceProperties.type}
              </ListItemText>
            </ListItem>
          </List>
          <ResourceReviews resourceName={this.props.resourceProperties.name}/>
        </Collapse>
      </div>
    )
  }
}

export default ResourceCard
