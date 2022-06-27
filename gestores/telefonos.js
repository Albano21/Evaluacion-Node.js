const mariadb = require('mariadb')
const config = require("../config/bd")

async function agregar(nuevo) {
    const conn = await mariadb.createConnection(config)
    const valores = [nuevo.numero, nuevo.id_tipo, nuevo.documento]
    await conn.query("insert into telefonos (numero, id_tipo, documento) values (?, ?, ?)", valores)
    conn.end()
}

async function consultar_todos() {
    const conn = await mariadb.createConnection(config)
    let telefonos = await conn.query("select * from telefonos")
    conn.end()
    return telefonos
}

async function consultar(id) {
    const conn = await mariadb.createConnection(config)
    let telefonos = await conn.query("select * from telefonos where id_telefono = ?", [id])
    conn.end()
    return telefonos[0]
}

async function borrar(id) {
    const conn = await mariadb.createConnection(config)
    await conn.query("delete from telefonos where id_telefono = ?", [id])
    conn.end()
}

async function modificar(telefono) {
    const conn = await mariadb.createConnection(config)
    const valores = [telefono.numero, telefono.id_tipo, telefono.documento, telefono.id]
    await conn.query("update telefonos set numero = ?, id_tipo = ?, documento = ? where id_telefono = ?", valores)
    conn.end()
}

async function buscar_telefonos_por_sufijo(sufijo){
    const conn = await mariadb.createConnection(config)
    const simbolo_porcentaje = "%"
    sufijo = simbolo_porcentaje + sufijo
    const valores = [sufijo]
    let telefonos = await conn.query("select * from telefonos where numero like ? ", valores)
    conn.end()
    return telefonos
}


exports.agregar = agregar
exports.consultar_todos = consultar_todos
exports.consultar = consultar
exports.borrar = borrar
exports.modificar = modificar
exports.buscar_telefonos_por_sufijo = buscar_telefonos_por_sufijo
