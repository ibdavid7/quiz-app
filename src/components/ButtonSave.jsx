import React from 'react'
import { Loader, Header, Icon, Button, Segment } from 'semantic-ui-react'


const ButtonSave = ({
    type,
    color,
    isDisabled = false,
    isLoading = false,
    onClick = null,
    label,
    isError = false,
    error,
}) => {
    return (
        <>
            <Button
                type={type}
                color={color}
                onClick={onClick}
                disabled={isDisabled}
            >
                <>
                    {!isLoading ? <Icon name='save outline left' /> : <Loader inline active size={'mini'} />}
                    {label}
                </>
            </Button>

            {
                isError &&
                <Segment><Header as={'h3'} color={'red'}>{JSON.stringify(error)}</Header></Segment>
            }
        </>
    )
}

export default ButtonSave;
