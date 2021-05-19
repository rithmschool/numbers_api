# Numbers API
***

### Frontend development setup :

The backend and frontend are in the same directory and are deployed together.  When working in development mode on the frontend React App, both the backend and frontend need to be running.
```
cd /backend  
npm run start
```
```
cd /frontend  
npm run start 
```
This allows you to see any changes being made to the frontend during development.  
The backend serves a single static file to the client that is pointed to the current build of the react app.  
Running 'npm run build' from the frontend transpiles the React code into a static html file.
The server will serve this static file in deployment.

***


