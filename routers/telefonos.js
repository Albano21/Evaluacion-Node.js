const express = require('express')
const gestor_telefonos = require('../gestores/telefonos')
const gestor_personas = require('../gestores/personas')
const router = express.Router()

router.use(express.json())

// endpoint para agregar con body
router.post("/",  async (req, res) => {

    let nuevo = req.body

    const persona = await gestor_personas.consultar(nuevo.documento)


    // verificacion de que existe la persona con ese documento
    if(persona){
        gestor_telefonos.agregar(nuevo)
        res.sendStatus(201)
    }
    else{
        res.status(404).send("No hay personas con ese documento")
    }
    
})

// endpoint para consultar todos o para buscar por sufijo
router.get("/", async (req, res) => {

    const query = req.query
    //rama verdadera: si hay sufijo busca con sufijo
    if (query.sufijo){
        const sufijo = query.sufijo
        res.json(await gestor_telefonos.buscar_telefonos_por_sufijo(sufijo))
    }
    // rama falsa: no hay sufijo trae todos
    else{
        res.json(await gestor_telefonos.consultar_todos())
    }
 
    res.end()
})

// endpoint para consultar por numero
router.get("/:id", async (req, res) => {
    let id = parseInt(req.params.id)
    
    if (!isNaN(id))  { // Si no es NaN, es porque es un número correcto
        let telefono_encontrado = await gestor_telefonos.consultar(id)

        if (telefono_encontrado) 
            res.json(telefono_encontrado)
        else
            res.status(404).send("No encontrado")
    }
    else
        res.status(400).send("El parámetro debe ser numérico")

    res.end()
})

// endpoint para borra por numero
router.delete("/:id", async (req, res) => {
    let id = parseInt(req.params.id)
    
    if (!isNaN(id))  { // Si no es NaN, es porque es un número correcto
        let telefono_encontrado = await gestor_telefonos.consultar(id)

        if (telefono_encontrado) 
            gestor_telefonos.borrar(id)
        else
            res.status(404)
    }
    else{
        res.status(400).send("El parámetro debe ser numérico")
    }
       

    res.end()
})

// endpoint para modificar
router.put("/:id", async (req, res) =>{
    let id = parseInt(req.params.id)

    if (!isNaN(id)){
        let telefono_encontrado = await gestor_telefonos.consultar(id)

        if (telefono_encontrado){

            let telefono = req.body
            telefono.id = id
    
            gestor_telefonos.modificar(telefono)
    
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

exports.router = router