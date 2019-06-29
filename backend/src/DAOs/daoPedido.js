import {psql} from '../postgreConnection'

const daoPedido = {
    // CRUD BASICO
    consultarTodos() {
        // RETORNA UNA PROMESA
        return psql.query(`
            SELECT PE.p_id_pedido, PE.p_fecha_solicitud, C.c_nombre , PO.p_nombre,
                   PEPO.p_cantidad, PEPO.p_precio_unitario, 
                   (PEPO.p_cantidad*PEPO.p_precio_unitario*1.16) total, EN.e_nombre
            FROM PEDIDO PE, PEDI_PROD PEPO, PRODUCTO PO, CLIENTE C, (SELECT e_nombre, M.pedido_id
                                                                     FROM ESTADO, PEDI_ESTA, (SELECT MAX(p_id_pedi_esta) q, pedido_id
                                                                                              FROM PEDI_ESTA, ESTADO
                                                                                              WHERE estado_id=e_id_estado
                                                                                                  GROUP BY pedido_id) M
                                                                     WHERE
                                                                         p_id_pedi_esta=M.q AND
                                                                         estado_id=e_id_estado) EN
            WHERE PE.p_id_pedido = PEPO.pedido_id AND
                EN.pedido_id=PE.p_id_pedido AND
                PO.p_id_producto = PEPO.producto_id AND
                C.c_id_cliente = PE.cliente_id;
        `)
    },

    consultar( id ){
        return psql.query(`
            SELECT * FROM MINERAL
            WHERE m_id_mineral = ${id}
        `)
    },

    eliminar( id ){
        return psql.query(`
            DELETE FROM MINERAL
            WHERE m_id_mineral = ${id}
        `)
    },

    insertar({ p_fecha_solicitud, cliente_id }){
        return psql.query(`
            INSERT INTO PEDIDO (p_id_pedido, p_fecha_solicitud, cliente_id)
            VALUES (DEFAULT,
                    ${p_fecha_solicitud ? `'${p_fecha_solicitud}'` : 'NULL'},
                    ${cliente_id ? `'${cliente_id}'` : 'NULL'}) 
                    RETURNING (p_id_pedido)
            `)
    }  ,



    modificar({ m_id_mineral, m_nombre, m_tipo, m_radioactivo, m_fecha_nacionalizacion, m_descripcion }){
        return psql.query(`
            UPDATE MINERAL SET
                m_nombre = ${m_nombre ? `'${m_nombre}'` : 'NULL' },
                m_tipo = ${m_tipo ? `'${m_tipo}'` : 'NULL'},
                m_radioactivo = ${m_radioactivo ? 'TRUE' : 'FALSE'},
                m_fecha_nacionalizacion = ${m_fecha_nacionalizacion ? `'${m_fecha_nacionalizacion}'` : 'NULL'},
                m_descripcion = ${m_descripcion ? `'${m_descripcion}'` : 'NULL'}
                WHERE m_id_mineral = ${m_id_mineral}
        `)
    },

}

export {daoPedido}