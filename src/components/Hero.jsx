import React from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';
import bighead from '../images/bighead-9.svg';

const Hero = () => {
    return (
        <Container className='py-14'>

            <Grid columns={2} relaxed={'very'} centered stackable>

                <Grid.Column verticalAlign={'top'} textAlign='left' width={8}>
                    <p className='py-2 text-2xl text-[#20B486] font-medium'>START NOW</p>
                    <h1 className='md:leading-[72px] py-2 md:text-6xl text-5xl font-semibold'>
                        Access the Most Accurate <span className='text-[#20B486]'>IQ Tests </span>
                        Online.
                    </h1>
                    <p className='py-2 text-lg text-gray-600'>Find out how you measure up.</p>

                </Grid.Column>

                <Grid.Column textAlign='center' width={8}>
                    <Image size={'medium'} src={bighead} verticalAlign='middle' />

                </Grid.Column>

            </Grid >
        </Container >

    )
}

export default Hero