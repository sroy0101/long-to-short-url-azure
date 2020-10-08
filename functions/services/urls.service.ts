import { Context } from '@azure/functions';
import * as data from './data';

/**
 * Returns a randomly generated short url for a given long url. 
 * Or, the previously assigned short url for the given long url. 
 * /getShort?shortUrl=<long url value>.
 * The protocol and host for long url will be the same as the current. 
 * Example returned long url = https://xyz.com/dmzKek
 */
export async function getShortUrl ({req, res} : Context): Promise<void> {
    const host = req.headers.host; 
    const protocol = req.url.split(':')[0]; 
    const badLongUrlResponse = `Bad long url. Usage example: ${protocol}://${host}/api/getShort?longUrl=http(s)://www.xyz.com>`;
    const createShortUrlErrorResponse = `Could not create a short url. Please try again.`;
    try {
        if(req.url) {
            const urlParamValue = req.url.split('?')[1];
            if(urlParamValue && urlParamValue.indexOf('=') > -1) {
                await createShortUrl(urlParamValue.split('=')[1])
                    .then((result) => {
                        res.status(201).json({shortUrl: `${protocol}://${host}/${result.shortUrl}`});
                    }).catch ((error) => {
                        throw new Error(createShortUrlErrorResponse);
                    });
            } else {
                throw new Error(badLongUrlResponse);
            }
        } else {
            throw new Error(badLongUrlResponse);
        }
    } catch (error) {
        res.status(400).json({"Error": error.message});
    }
}


/**
 * Returns the long url associated with a valid previously assigned shortUrl. 
 * /getLong?shortUrl=<short url value> 
 * Example returned long url - https://www.xyz123.com
 */
export async function getLongUrl ({req, res} : Context) {
    const host = req.headers.host; 
    const protocol = req.url.split(':')[0]; 

    const badShortUrlResponse = `Bad short url. Usage example: ${protocol}://${host}/api/getLong?shortUrl=dmgKek`;
    const createLongUrlErrorResponse = `Long url could not be found`;
    try {
        if(req.url) {
            const urlParamValue = req.url.split('?')[1];
            if(urlParamValue && urlParamValue.indexOf('=') > -1) {
                await data.getLongUrlByShort(urlParamValue.split('=')[1])
                    .then((result) => {
                        let response = result? result : createLongUrlErrorResponse;
                        res.status(201).json({longUrl: `${response}`});

                    }).catch(error => {
                        throw new Error(createLongUrlErrorResponse);
                    });
            } else {
                throw new Error(badShortUrlResponse);
            }
        } else {
            throw new Error(badShortUrlResponse);
        }
    } catch (error) {
        res.status(400).json({"Error": error.message});
    }    
}


/**
 * Converts a long url to short. 
 * The generated url only contains permissible character for url - alphanumeric (upper and lowercase) and a few special characters (total 66). 
 * Short url = base-66 conversion of a 10 digit random number to a string using the permissible characters.   
 * If the long url was previously converted, it will return the same shortUrl. 
 * @param longUrl The long url to be converted to short url. 
 */
async function createShortUrl(longUrl: string) {
    let result = { "shortUrl": "" };
    if(!longUrl) {
        return (result);
    }
    let isSaveShortUrl: boolean = false;

    result.shortUrl =  await data.getShortUrlByLong(longUrl);

    if(!result.shortUrl) {
        let urlId  = Math.floor(Math.random() * 10000000000);
        isSaveShortUrl = true;

        const alphaLower = "abcdefghijklmnopqrstuvwxyz";
        const allowedUrlCharacters =  alphaLower + alphaLower.toUpperCase() + "0123456789" + "-._~";
        let urlChars = allowedUrlCharacters.split('');

        let shortUrl: string[] = [];

        while( urlId > 0) {
            let index = Math.floor(urlId % urlChars.length);
            shortUrl.push(urlChars[index].toString());
            urlId = Math.floor(urlId / urlChars.length);
        }

        result.shortUrl = shortUrl.reverse().join('');
    }

    // Save the url and its id
    if(isSaveShortUrl) {
        await data.saveUrls(longUrl, result.shortUrl).then(() => {
        }).catch ((error) => {
            return "Error: The url could not be converted."
        });
    }
    return result;
}

export default { getShortUrl, getLongUrl };