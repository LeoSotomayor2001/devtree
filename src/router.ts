import { Router } from "express";

const router=Router()

//Routing
router.get('/',(req,res)=>{
    res.send('Hello World')
})


export default router