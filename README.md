# Portal-Frontend

## Module

### Creation

Generate a new module deriving from the template by using `generate-module.sh` script.

Usage: 

```bash
./scripts/generate-module.sh -m MyModule
```
This command generates a new module named __MyModule__ in `modules/` directory. The `README.md` in that folder shows the route to the __Hello World__ View. 

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
or add backend-URL:
```
VUE_APP_BACKEND_URL=http://localhost:8000 npm run serve
```


### Compiles and minifies for production
```
npm run build
```
or add backend-URL:
```
VUE_APP_BACKEND_URL=http://localhost:8000 npm run serve
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```
