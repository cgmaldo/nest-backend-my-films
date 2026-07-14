import { User } from "src/auth/entities/user.entity";
import { TypeFileExtension } from "../interfaces/TypeFilesExtension.interface";

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if (!req.user) return callback(new Error('Bad request'), false);
    const { id } = req.user as User;
    if (!file) return callback(new Error('File in empty'), false);
    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = TypeFileExtension;
    if (validExtensions.includes(fileExtension)) {
        return callback(null, `${id}.${fileExtension}`);
    }
    callback(null, false);
}
