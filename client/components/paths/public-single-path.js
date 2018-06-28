import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from "styled-components"

import { getSinglePathByUidThunk } from '../../store'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid'
  }
}

class PublicSinglePath extends Component {
  constructor(props){
    super(props)

    this.state = {
      selectedItems: []
    }
  }

  componentDidMount = () => {
    const uid = this.props.match.params.pathUid
    this.props.getPath(uid)
  }


  renderPath = () => {
    const steps = this.props.path[0][0].steps
    const { description, level, name, owner, slug, status, uid } = this.props.path[0][0].details.properties
    return (
      <PageContainer>
        <PathContainer>
          <h3>Path: {name}</h3>
          <div style={styles.container}>
            <List>
              { steps.length > 1 &&
                steps.map(step => {
                  const stepUrl = step.resource.properties.url
                  return (
                  <div key={stepUrl}>
                    <ListItem
                      key={stepUrl}
                      role={undefined}
                      dense
                      button
                      disableRipple
                    >
                      {
                        step.resource.properties.imageUrl ? (
                          <img src={step.resource.properties.imageUrl} width={75} />
                        ) : (
                          <img src="../../default.png" width={75} />
                        )
                      }

                      <ListItemText primary={step.resource.properties.name} />

                      {this.state.selectedItems.indexOf(stepUrl) !== -1 ?
                        <ExpandLess
                          onClick={() => this.handleDropdownClick(stepUrl)}
                        /> :
                        <ExpandMore
                          onClick={() => this.handleCollapseClick(stepUrl)}
                        />
                      }

                    </ListItem>

                    <Collapse
                      in={this.state.selectedItems.indexOf(stepUrl) !== -1}
                      timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem button>
                          <p>In the dropdown for "{step.resource.properties.name}"</p>
                        </ListItem>
                      </List>
                    </Collapse>
                    </div>
                  )
              } ) }
            </List>
          </div>
        </PathContainer>
        </PageContainer>
      )}



  render(){
    if(this.props.path.length){
      return(
        this.renderPath()
      )
    }else{
    return (
      <span />
    )


    }
  }
}

const mapStateToProps = (state) => {
  return {
    path: state.pathReducer.singlePath
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPath: (uid) => {
      dispatch(getSinglePathByUidThunk(uid))
    }
  }
}

const PathContainer = styled.div`
  width: 80vw
  display: flex
  justify-content: center
  flex-direction: column
  margin-top: 20px
`

const PageContainer = styled.div`
  width: 90vw;
  display: flex;
  justify-content: center
`

export default connect(mapStateToProps, mapDispatchToProps)(PublicSinglePath)
