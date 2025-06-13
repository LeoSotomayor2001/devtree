import { Router } from "express";

const router=Router()

//autenticacion y registro
router.post('/auth/register',(req,res)=>{
    console.log('hola register')
})


export default router