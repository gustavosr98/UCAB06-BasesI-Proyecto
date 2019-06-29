import React from 'react';
import axios from 'axios';

import {Modal, Button} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import {MenuDashBoard} from "../components/MenuDashBoard";
import {Scheduler} from "../components/Scheduler";


export class AgregarHorario extends React.Component {
    constructor(props){
        super(props)

        this.state  = {
            goBack : false
        }
    }

    render = () => (
        <div>
            <MenuDashBoard title="Agregar horario"/>
            <Scheduler editable={true}/>
                {this.state.goBack && <Redirect to="/dashboard" /> }

        </div>
    )
}