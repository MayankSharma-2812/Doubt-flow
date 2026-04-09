import "dotenv/config"
import app from "./app.js"

const PORT=5000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})

// Keep process alive for debugging
setInterval(() => {}, 1000 * 60 * 60);