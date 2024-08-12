import multer from "multer";
import { nanoid } from "nanoid";
import { AppError } from "../utils/appError.js";

const fileUpload=(folderName)=>{

    const storage = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, `uploads/${folderName}`);
        },    
        filename: function (req, file, cb) {
            cb(null, nanoid() + '-' + file.originalname);
        }
    });

    function fileFilter(req,file,cb){
        if(file.mimetype.startsWith('image')){
            cb(null, true);
            
        } else {
            cb(new AppError('Only images !',402),false);
        }
    }
    const upload = multer({ storage,fileFilter });

    return upload;
}

export const uploadSingleFile= (fieldName,folderName)=>fileUpload(folderName).single(fieldName)
export const uploadMixOfFile= (arrayOfFields,folderName)=>fileUpload(folderName).fields(arrayOfFields)
