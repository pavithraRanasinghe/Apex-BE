import express from "express";

const router = express.Router();

router.get('/', (req,res)=>{
    res.status(200)
    .json({
        msg: "Success",
        data: {
            name:'test'
        }
    })
})

router.post('/', (req,res)=>{
    
})

export default router;