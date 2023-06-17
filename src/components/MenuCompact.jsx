import React from 'react'
import { Icon, Menu } from 'semantic-ui-react'



const MenuCompact = ({ onClick, activeItem, items }) => {

    return (
        <Menu compact stackable icon='labeled' size={'mini'} pointing >
            {items.map((item, index) => {
                return (
                    <Menu.Item
                        name={item.name}
                        active={activeItem === item.name}
                        onClick={onClick}
                        fitted={'horizontally'}
                    >
                        <Icon name={item.icon} size={'mini'} />
                        {item.name}
                    </Menu.Item>

                )
            })
            }
        </Menu>
    )
}


export default MenuCompact;