const mariadb = require('mariadb')
const config = require("../config/bd")


async function agregar(nueva) {
    const conn = await mariadb.createConnection(config)
    const valores = [nueva.numero, nueva.nombre, nueva.apellido, nueva.edad]
    await conn.query("insert into personas2 (documento, nombre, apellido, edad) values (?, ?, ?, ?)", valores)
    conn.end()
}

async function consultar_todas() {
    const conn = await mariadb.createConnection(config)
    let personas = await conn.query("select * from personas2")
    conn.end()
    return personas
}

async function consultar(num) {
    const conn = await mariadb.createConnection(config)
    let personas = await conn.query("select * from personas2 where documento = ?", [num])
    conn.end()
    return personas[0]
}

async function borrar(num) {
    const conn = await mariadb.createConnection(config)
    await conn.query("delete from personas2 where documento = ?", [num])
    conn.end()
}

async function modificar(persona) {
    const conn = await mariadb.createConnection(config)
    const valores = [persona.nombre, persona.apellido, persona.edad, persona.numero]
    await conn.query("update personas2 set nombre = ?, apellido = ?, edad = ? where documento = ?",valores)
    conn.end()
}

async function consultar_telefonos(persona){
    const conn = await mariadb.createConnection(config)
    const valores = [persona.numero]
    let telefonos = await conn.query("select * from telefonos where documento = ?", valores)
    conn.end()
    return telefonos

}

async function consultar_telefonos_por_tipo(persona, tipo){
    const conn = await mariadb.createConnection(config)
    const valores = [persona.numero, tipo]
    let telefonos = await conn.query("select * from telefonos where documento = ? and id_tipo = ?", valores)
    conn.end()
    return telefonos

}

async function buscar_personas_por_filtro(filtro){
    const conn = await mariadb.createConnection(config)
    const simbolo_porcentaje = "%"
    filtro = simbolo_porcentaje + filtro + simbolo_porcentaje
    const valores = [filtro, filtro]
    let personas = await conn.query("select * from personas2 where apellido like ? or nombre like ? ", valores)
    conn.end()
    return personas
}

exports.agregar = agregar
exports.consultar_todas = consultar_todas
exports.consultar = consultar
exports.borrar = borrar
exports.modificar = modificar
exports.consultar_telefonos = consultar_telefonos
exports.consultar_telefonos_por_tipo = consultar_telefonos_por_tipo
exports.buscar_personas_por_filtro = buscar_personas_por_filtro