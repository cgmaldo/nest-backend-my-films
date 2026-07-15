import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";

@Injectable()
export class CommonService {
    private readonly logger = new Logger('Auth');

    handleError(error: any) {
        if (error.code === '23505') {
            throw new BadRequestException(error.detail);
        }
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error check server logs');
    }

    fileNameFromUrl(url: string) {
        const partsUrl = url.split('/');
        if (partsUrl.length === 0) return '';
        return partsUrl[partsUrl.length - 1];
    }

    slugFromTitle(title: string) {
        return title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '_');
    }

}
