import React from 'react';
import { Box, Heading, Text} from 'grommet';
import { Link } from "react-router-dom";


function Nav(props) {
    return (
            <Box fill= "horizontal">
                <AppBar >
                <Link to="/" justify='start'>Pocket Spotter</Link>
                <Link to="/profile"><Heading level='3' margin='none'> Profile</Heading></Link>
                <Text>{props.name}</Text> 
                </AppBar>
            </Box>
    );
}

const AppBar = (props) => (
      <Box
        tag='header'
        direction='row'
        align='center'
        justify='center'
        background='brand'
        pad={{ left: 'medium', right: 'small', vertical: 'small' }}
        elevation='medium'
        style={{ zIndex: '1' }}
        {...props}
    />
);
export default Nav;