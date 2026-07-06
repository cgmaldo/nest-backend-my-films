import { v7 as uuidv7 } from "uuid";
import { TypeFileExtension } from "../interfaces/TypeFilesExtension.interface";

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if (!file) return callback(new Error('File in empty'), false);
    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = TypeFileExtension;
    if (validExtensions.includes(fileExtension)) {
        return callback(null, `${uuidv7()}.${fileExtension}`);
    }
    callback(null, false);
}
