import {psql} from '../postgreConnection'

const daoYacimientoConfiguracion = {
    consultarTodos() {
        return psql.query(`
            SELECT * FROM YACIMIENTO_CONFIGURACION
        `)
    },

    consultar( id ){
        return psql.query(`
            SELECT * FROM YACIMIENTO_CONFIGURACION
            WHERE y_id_yacimiento_configuracion = ${id}
        `)
    },

    insertar (y_nombre,y_capacidad_explotacion,mineral_id,unidad_id){
        const qry = `
            INSERT INTO YACIMIENTO_CONFIGURACION 
                (y_id_yacimiento_configuracion,y_nombre,y_capacidad_explotacion,mineral_id,unidad_id) VALUES 
            (DEFAULT,'${y_nombre}',${y_capacidad_explotacion},${mineral_id},${unidad_id}) RETURNING (y_id_yacimiento_configuracion);
        `
        console.log(qry)
        return psql.query(qry)
    },

    eliminar( id ){
        return psql.query(`
            DELETE FROM YACIMIENTO_CONFIGURACION
            WHERE y_id_yacimiento_configuracion = ${id}
        `)
    },

    BorrarRequisitos( id ) {
        return psql.query(`
            DELETE FROM MINE_YACI
            WHERE yacimiento_configuracion_id = ${id}
        `)
    },

    BorrarEtapas ( id ) {
        return psql.query(`
            DELETE FROM ETAPA_CONFIGURACION
            WHERE yacimiento_configuracion_id = ${id}
        `)
    },

    modificar (y_id_yacimiento_configuracion,y_nombre,y_capacidad_explotacion,mineral_id,unidad_id) {
        return psql.query(`
            UPDATE YACIMIENTO_CONFIGURACION
            SET y_nombre = '${y_nombre}',
                y_capacidad_explotacion = ${y_capacidad_explotacion},
                mineral_id = ${mineral_id},
                unidad_id = ${unidad_id}
            WHERE y_id_yacimiento_configuracion = ${y_id_yacimiento_configuracion}
        `)
    },

    consultarRequisitos( id ) {
        return psql.query(`
            SELECT * 
            FROM MINE_YACI
            WHERE yacimiento_configuracion_id = ${id}
        `)
    },

    proyectosAsociados( id ) {
        return psql.query(`
        SELECT P.p_id_proyecto 
        FROM PROYECTO P, YACIMIENTO Y
        WHERE Y.y_id_yacimiento = P.yacimiento_id
        AND Y.yacimiento_configuracion_id = ${id}
        `)
    }

}

export {daoYacimientoConfiguracion}