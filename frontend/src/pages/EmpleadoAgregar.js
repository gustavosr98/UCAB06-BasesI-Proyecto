import React from 'react';
import axios from 'axios';

import {Redirect} from 'react-router-dom';
import {Button} from "react-bootstrap";

import {MenuDashBoard} from "../components/MenuDashBoard";
import {InputText} from "../components/InputText";
import {SectionTitle} from "../components/Header/SectionTitle";
import {InputDate} from "../components/InputDate";
import {GuardarCancelar} from "../components/GuardarCancelar";
import { DropdownArreglado } from '../components/DropdownArreglado';
import {Dropdown} from "../components/Dropdown";

import {cleanerLugar, cleanerCargo} from "../utils/cleaner"

export class EmpleadoAgregar extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            users: [],
            lastIndex : 0,
            nuevo_empleado : {
                e_id_empleado : 0,
                e_cedula : "",
                e_nombre : "",
                e_segundo_nombre : "",
                e_apellido : "",
                e_segundo_apellido : "",
                e_telefono : "",
                e_fecha_nacimiento : "",
                e_fecha_ingreso : "",
                cargo_id : 0,
                estado_id : 11 // DISPONIBLE
            },
            lugar : {
                estado_id : 0,
                municipio_id : 0,
                parroquia_id : 0
            },
            lugares : [],
            cargos : []
        }
    }

    componentDidMount = () => {
        /* !!! OJO !!! FALTA QUERY CARGOS */
        /* !!! OJO 2DA ENTREGA !!! FALTA QUERY USUARIOS */        

        console.log(`----> localhost:4000/consultarLista/lugar`)
        axios.get('http://127.0.0.1:4000/consultarLista/lugar')
          .then( (res) => {
            if(res.status === 200)
              console.log(`<---- (OK 200) localhost:4000/consultarLista/lugar`)
    
            this.setState({
                lugares : res.data.rows
            })
          })
          .then( (resLug) => {
            console.log(`----> localhost:4000/consultarLista/cargo`)
            axios.get('http://127.0.0.1:4000/consultarLista/cargo')
              .then( (res) => {
                if(res.status === 200)
                  console.log(`<---- (OK 200) localhost:4000/consultarLista/cargo`)
        
                this.setState({
                    cargos : res.data.rows
                })

            })
          })
      }

    handleGuardar = () => {
        console.log(`----> localhost:4000/insertar/empleado`)
        return axios.post('http://127.0.0.1:4000/insertar/empleado', 
            {
                ...this.state.nuevo_empleado,
                lugar_id : this.state.lugar.parroquia_id,
                e_genero : this.state.nuevo_empleado.e_genero === 1 ? "m" : "f"
            }
        )
        .then( (res) => {
            if( res.status === 200) {
                console.log(`<---- (OK 200) localhost:4000/insertar/empleado`)
            }
            return res
        }).catch( (err) => {
            return err
        })
    }

    goEmpleado = () => {
        this.setState({
            goEmpleado : true
        })
    }

    addUser = () => {
        console.log(`new users = users [ ${this.state.lastIndex + 1} ]`)
        this.setState( (prev) => ({
            users:[
                ...prev.users, 
                {
                    u_id_usuario : prev.lastIndex + 1,
                    u_correo : null,
                    u_clave : null,
                    rol_id : 0
                }
            ],
            lastIndex : prev.lastIndex + 1
        }))
    }

    removeUser = (id) => {
        console.log(`quitar usuario[ ${id} ]`)
        const usuarioNuevo = this.state.users.filter( (u) => u.u_id_usuario !== id)
        this.setState({
            users : usuarioNuevo
        })
    }

    handleChange = (target) => {
        target=target.target||target;
        console.log(`nuevo_empleado.${target.name} = ${target.value}`)
        this.setState({
            nuevo_empleado :{
                ...this.state.nuevo_empleado,
                [target.name] : target.value
            }
        })
    }

    changeUser = (opcion , id) => {
        if (opcion.label) {
            console.log(`Users[ ${id} ].rol_id <-- ${opcion.value} (${opcion.label})`)
            const nuevosRequisitos = this.state.requisitos.map( req => {
                    if (req.m_id_mine_yaci === id){
                        req.mineral_id = opcion.value
                    }
                    return req
                })
            this.setState({
                requisitos : nuevosRequisitos
            })
        } else {
            console.log(`requisito[ ${id} ].m_cantidad <-- ${opcion.target.value}`)
            const nuevosRequisitos = this.state.requisitos.map( req => {
                if (req.m_id_mine_yaci === id){
                    req.m_cantidad = opcion.target.value
                }
                return req
            })
            this.setState({
                requisitos : nuevosRequisitos
            })
        }
        
    }


    handleChangeLugar = (target) => {
        console.log(`lugar.${target.name} = ${target.value}`)
        this.setState({
            lugar :{
                ...this.state.lugar,
                [target.name] : target.value
            }
        })
    }

    render = () => ( 
        <div>
            <MenuDashBoard title="Crear empleado"/>
            <div className="RowContainer">
                <div className="WideContainer">
                    <div className="FormContainer">
                        <InputText 
                            id="CrearEmpleadoNombre" 
                            label="Nombre"
                            name="e_nombre"
                            onChange={this.handleChange}
                        />
                        <InputText 
                            id="CrearEmpleadoNombre2"
                            label="Segundo Nombre"
                            name="e_segundo_nombre"
                            onChange={this.handleChange}
                        />
                        <InputText 
                            id="CrearEmpleadoApellido" 
                            label="Apellido" 
                            name="e_apellido"
                            onChange={this.handleChange}
                        />
                        <InputText 
                            id="CrearEmpleadoApellido2" 
                            label="Segundo Apellido"
                            name="e_segundo_apellido"
                            onChange={this.handleChange}
                        />
                        <InputText 
                            id="CrearEmpleadoCedula" 
                            label="Número de cédula" 
                            name="e_cedula"
                            onChange={this.handleChange}
                        />
                        <InputText 
                            id="CrearEmpleadoTelefono" 
                            label="Número de teléfono" 
                            name="e_telefono"
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="WideContainer">
                    <div className="FormContainer">
                        <Dropdown id="CrearEmpleadoCargo"
                                  name="cargo_id"
                                  retrieveData={this.handleChange}
                                  placeholder="Cargo..."
                                  options={
                                    cleanerCargo.limpiarListaDropdown(
                                        this.state.cargos
                                      )
                                  }
                        />
                        <Dropdown id="CrearEmpleadoGenero"
                                  name="e_genero"
                                  retrieveData={this.handleChange}
                                  placeholder="Género.."
                                  options={[
                                      {text:"Hombre",id:1},
                                      {text:"Mujer", id:2}]}/>
                        <div className="RowContainer center" style={{width: "80%"}}>
                            <div className="LabelContainer">
                                Fecha de nacimiento : &nbsp;
                            </div>
                            <InputDate 
                                name="e_fecha_nacimiento"
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="RowContainer center" style={{width: "80%"}}>
                            <div className="LabelContainer">
                                Fecha de ingreso :
                            </div>
                            <InputDate
                                name="e_fecha_ingreso"
                                onChange={this.handleChange}
                                style={{float: "right"}}
                            />
                        </div>
                        <Dropdown id="CrearEmpleadoLugarEstado"
                                  name="estado_id"
                                  retrieveData={this.handleChangeLugar}
                                  placeholder="Estado donde vive..."
                                  options={
                                      cleanerLugar.limpiarListaDropdown(
                                          this.state.lugares.filter( l => l.l_tipo === "estado")
                                        )
                                    }
                        />
                        <Dropdown id="CrearEmpleadoLugarMunicipio"
                                  name="municipio_id"
                                  retrieveData={this.handleChangeLugar}
                                  placeholder="Municipio donde vive..."
                                  options={
                                    cleanerLugar.limpiarListaDropdown(
                                        this.state.lugares.filter( l => l.lugar_id === this.state.lugar.estado_id)
                                      )
                                  }
                        />
                        <Dropdown id="CrearEmpleadoLugarParroquia"
                                  name="parroquia_id"
                                  retrieveData={this.handleChangeLugar}
                                  placeholder="Parroquia donde vive..."
                                  options={
                                    cleanerLugar.limpiarListaDropdown(
                                        this.state.lugares.filter( l => l.lugar_id === this.state.lugar.municipio_id)
                                      )
                                  }
                        />
                    </div>
                </div>
                <div className="WideContainer">
                    <div className="FormContainer">
                        <img src="resources/img/Empleado.png" alt="" width="80%" style={{margin: "0 auto"}}/>
                    </div>
                </div>
            </div>

            <div className="Container-90p">
                <div className="LabelContainer">
                    Usuarios asociados al empleado (SEGUNDA ENTREGA)
                </div>
                {
                    this.state.users.map( (usuario,i)=>
                    (
                        <div key={usuario.u_id_usuario} className="cargoHorizontal">
                            <div>
                                <i 
                                    className="zmdi zmdi-close-circle-o LabelIcon pegar-derecha"
                                    onClick={() => this.removeUser(
                                        usuario.u_id_usuario
                                    )}
                                >
                                </i>
                            </div>
                            <div className="ancho-cantidad">
                                <InputText 
                                    id={`Correo_${usuario.u_id_usuario}_`}
                                    label="Correo"
                                    type="text"
                                    name="u_correo"
                                    value={usuario.u_correo}
                                    onChange= { (event) =>
                                        this.changeUsuario(event, usuario.u_id_usuario)
                                    }
                                />
                            </div>
                            <div className="ancho-cantidad">
                                <InputText 
                                    id={`Clave_${usuario.u_id_usuario}_`}
                                    label="Clave"
                                    type="text"
                                    name="u_clave"
                                    value={usuario.u_clave}
                                    onChange= { (event) =>
                                        this.changeUsuario(event, usuario.u_id_usuario)
                                    }
                                />
                            </div>
                            <div className="ancho-mineral">
                                <DropdownV2
                                    placeholder="Rol ..."
                                    onChange={ event => 
                                        this.changeUser(event , usuario.u_id_usuario)
                                    }
                                    options={
                                        cleanerMineral.limpiarListaDropdown(
                                            minerales.filter( m => 
                                                !requisitos.find( r => r.mineral_id === m.m_id_mineral ) &&
                                                m.m_id_mineral !== configuracion_yacimiento.mineral_id
                                            )
                                        )
                                    }
                                />
                            </div>

                        </div>
                        
                    ))
                }
            </div>

            <div className="Container-90p">
                <div className="ButtonAddUser" onClick={this.addUser}>
                    Agregar usuario
                </div>
            </div>

            <GuardarCancelar 
                position="right"
                storeData={this.handleGuardar}
                success={this.goEmpleado}
                decline={this.goEmpleado}
            />

            {this.state.goEmpleado && <Redirect push to="/empleado" /> }
        </div>
    )
}