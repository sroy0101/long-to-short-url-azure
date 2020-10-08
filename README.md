## Long-to-Short-Url-Azure

A starter application to convert a long url to a short one using Azure functions (instead of Express of Node-Express)

If you want to set up a short url service for whatever reason, such as security or cost saving, and you want to host it on Azure as a function, you can use this project as the base and build on it. 

This project currently provides the conversion from long to a short url. Other functionalities, such as redirection and administration, are required in order to make it into a full short url service. 

The advantages of hosting as Azure functions are many as detailed here: [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)

### Installation
1. Clone the repo to your local folder. 
2. > npm install - to install the app packages. 
3. This app needs access to a postgres server instance, remote or local. Create a database called "shortUrl" in the server. 
4. Run the db/createdb.sql to create the "urls" table. 
5. Add the database server access information, in the src/config.ts file. 
6. > npm run start - to start the application. 

### Usage Examples
With the application running and listening on port 7071: 
1. To get a shortUrl for an url such as http://aVeryVeryLongUrl.com, use the browser to open the following url:

    http://localhost:7071/api/getshort?longUrl=http://aVeryVeryLongUrl.com

Expected response: 
    http://localhost:7071/bS4G4d

where "bS4G4d" is a randomly generated value unique to the given long url. 

2. To get the long url associated with a short Url that was previously generated, use the browser to open the following as the following example:

    http://localhost:7071/getLong?shortUrl=bS4G4d

Expected response (example) :

    http://aVeryVeryLongUrl.com


## Azure Deployment
To deploy on Azure click here: [Azure Deployment](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-function-vs-code?pivots=programming-language-typescript)

Note: As this app uses the postgreSQl database, you will need to configure a postgresSQL database on Azure and configure the login details in the config.ts accordingly used to create the connection string. 
