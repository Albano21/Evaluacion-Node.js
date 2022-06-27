const express = require('express')
const gestor_personas = require('../gestores/personas')
const router = express.Router()

router.use(express.json())

// endpoint para consultar todas o para buscar por filtro en apellido y nombre
router.get("/", async (req, res) => {

    const query = req.query
    //rama verdadera: si hay filtro busca con filtro
    if (query.filtro){
        const filtro = query.filtro
        res.json(await gestor_personas.buscar_personas_por_filtro(filtro))
    }
    // rama falsa: no hay filtro trae todos
    else{
        res.json(await gestor_personas.consultar_todas())
    }
 
    res.end()
})




// endpoint para consultar por numero
router.get("/:numero", async (req, res) => {
    let num = parseInt(req.params.numero)
    
    if (!isNaN(num))  { // Si no es NaN, es porque es un número correcto
        let persona_encontrada = await gestor_personas.consultar(num)

        if (persona_encontrada) 
            res.json(persona_encontrada)
        else
            res.status(404).send("No encontrado")
    }
    else
        res.status(400).send("El parámetro debe ser numérico")

    res.end()
})

// endpoint para agregar con body
router.post("/:numero",  async (req, res) => {
    
    let num = parseInt(req.params.numero)
    let nueva = req.body
    nueva.numero = num

    // verifica es numerico
    if (!isNaN(num)){

        const persona = await gestor_personas.consultar(num)

        // verifica que no exista una persona con ese id
        if (!persona){
            gestor_personas.agregar(nueva)
            res.sendStatus(201)
        }
        else{
            res.status(400).send("Ya existe una persona con ese Id")
        }
    }
    else{
        res.status(400).send("El parámetro debe ser numérico")
    }

})

// endpoint para agregar con pathvariables
router.post("/:numero/:nombre/:apellido/:edad", async (req, res) => {
    let num = parseInt(req.params.numero)
    let nom = req.params.nombre
    let ape = req.params.apellido
    let edad = parseInt(req.params.edad)

    
    let nueva = { numero: num, nombre: nom, apellido: ape, edad: edad }

     // verifica es numerico
     if (!isNaN(num)){

        const persona = await gestor_personas.consultar(num)

        // verifica que no exista una persona con ese id
        if (!persona){
            gestor_personas.agregar(nueva)
            res.sendStatus(201)
        }
        else{
            res.status(400).send("Ya existe una persona con ese Id")
        }
    }
    else{
        res.status(400).send("El parámetro debe ser numérico")
    }

})

// endpoint para modificar
router.put("/:numero", async (req, res) =>{
    let num = parseInt(req.params.numero)

    if (!isNaN(num)){
        let persona_encontrada = await gestor_personas.consultar(num)

        if (persona_encontrada){

            let modificada = req.body
            modificada.numero = num
    
            gestor_personas.modificar(modificada)
    
            res.sendStatus(201)
        }
        else{
            res.status(404).send("No encontrado")
        }
    }
    else{
        res.status(400).send("El parámetro debe ser numérico")
    }
    
    res.end();
    
})

// endpoint para borrar por numero
router.delete("/:numero", async (req, res) => {
    let num = parseInt(req.params.numero)
    
    if (!isNaN(num))  { // Si no es NaN, es porque es un número correcto
        let persona_encontrada = await gestor_personas.consultar(num)

        if (persona_encontrada) 
            gestor_personas.borrar(num)
        else
            res.status(404)
    }
    else
        res.status(400).send("El parámetro debe ser numérico")

    res.end()
})

// endpoint para consultar todos los telefonos
router.get("/:id/telefonos", async (req, res) => {
    let num = parseInt(req.params.id)
    if (!isNaN(num)){
        let persona_encontrada = await gestor_personas.consultar(num)

        if (persona_encontrada){
            persona_encontrada.numero = num
            res.json(await gestor_personas.consultar_telefonos(persona_encontrada))
        }
        else{
            res.status(404)
        }
    }
    else{
        res.status(400).send("El parámetro debe ser numérico")
    }

})

// endpoint para consultar todos los telefonos
router.get("/:id/telefonos/:tipo", async (req, res) => {
    let num = parseInt(req.params.id)
    let tipo = parseInt(req.params.tipo)

    if (!isNaN(num) && !isNaN(tipo)){
        let persona_encontrada = await gestor_personas.consultar(num)

        if (persona_encontrada){
            persona_encontrada.numero = num
            res.json(await gestor_personas.consultar_telefonos_por_tipo(persona_encontrada, tipo))
        }
        else{
            res.status(404)
        }
    }
    else{
        res.status(400).send("Los parámetros deben ser numéricos")
    }

})

exports.router = router