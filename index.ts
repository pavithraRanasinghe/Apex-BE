import express from 'express';
const PORT = process.env.PORT || 3000;
const app = express();

app.get('/', (req,res)=>{
    res.send('HELLO NODE');
})

app.listen(PORT, ()=> console.log(`Server listen on port ${PORT}`)); 
