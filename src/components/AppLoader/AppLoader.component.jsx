import React from 'react';

import "./AppLoader.css"
import { Dimmer, Loader } from 'semantic-ui-react';

export const AppLoader = (props) => {
    return (<Dimmer active={props.loading}>
        <Loader size="huge" content="Loading..." />
    </Dimmer>)
}