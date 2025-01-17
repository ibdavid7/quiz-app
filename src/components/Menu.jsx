import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class MenuExampleContentProp extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu>
        <Menu.Item
          name='A'
          active={activeItem === 'editorials'}
          
          content='A'
          onClick={this.handleItemClick}
        >
        <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png'/>
        </Menu.Item>

        <Menu.Item
          name='A'
          active={activeItem === 'reviews'}
          content='Reviews'
          onClick={this.handleItemClick}
        />

        <Menu.Item
          name='upcomingEvents'
          active={activeItem === 'upcomingEvents'}
          content='Upcoming Events'
          onClick={this.handleItemClick}
        />
      </Menu>
    )
  }
}