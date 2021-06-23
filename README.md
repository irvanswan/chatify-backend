# BACKEND CHATIFY WITH EXPRESS JS
***
## REQUIREMENT

```
1.  Node JS
2.  Express JS
3.  library Multer (for uploading file)
4.  library Cors ( allows a server to indicate any other origins (domain, scheme, or port) than its own from which a browser should permit loading of resources)
5.  library dote env (for privately your settings configuration on database)
6.  library json web tokeb (for hasing data)
7.  library pg (for connect backend with pg admin)
```

## FOLDER FUNCTION

| Folder  | Function |
| ----- | --- |
| models   |  for processing data on database |
| controlers | for connect models and route  |
| route | for routing the API  |
| helpers | for helping the API to processing data  |
| public/uploads | for handle upload file  |

## Folder Structure
```
 ├── controllers         
 │  ├── contactController.js
 │  ├── messageController.js
 │  └── AserController.js
 ├── helpers            
 │  ├── database.js
 │  ├── formResponse.js
 │  ├── hashing.js
 │  ├── queryBuilder.js
 │  ├── upload.js
 │  ├── validation.js
 │  └── AerifyToken.js
 ├── models
 |  ├── tests  
 |  └── App.js
 ├── public
 │  ├── uploads  
 │  │  │── document
 │  │  │── file_images
 │  │  │── images
 ├── route
 │   ├── chat.js
 │   ├── contact.js           
 │   ├── index.js
 │   ├── message.js
 │   └── user.js
 └── .env
```

## [Front End](https://github.com/irvanswan/chatify-frontend)
