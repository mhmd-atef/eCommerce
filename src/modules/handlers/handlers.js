import fs from 'node:fs'
import path from 'node:path'
import { catchError } from "../../middleware/catchError.js"
import { AppError } from '../../utils/appError.js'
import { fileURLToPath } from "node:url";



export const deleteOne=(model,file)=>{
    // delete one document
    
    return catchError(async(req,res,next)=>{
        const document=await model.findByIdAndDelete(req.params.id)
        console.log(document,'document');
        
        document  || next(new AppError('document not found',404))
        
        const imageName= document.image || document.logo || document.imageCover
        let __filename=fileURLToPath(import.meta.url)
        let __dirname=path.dirname(__filename)
        if(imageName){
        let img =path.join(__dirname,`../../../uploads/${file}/${imageName.split('/').pop()}`)
        fs.unlinkSync(img)                       // delete image from server
        }                        
        
        if(document.images){
            document.images.forEach(async img=> {
                const imgsPath=path.join(__dirname,`../../../uploads/${file}/${img.split('/').pop()}`)
                fs.unlinkSync(imgsPath)             // delete images [] from server
                
            })
        }

        !document || res.status(200).json({message:"document successfully deleted",document})
        
    })
}





