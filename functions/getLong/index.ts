import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { urlService } from '../services';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    await urlService.getLongUrl(context);
};

export default httpTrigger;