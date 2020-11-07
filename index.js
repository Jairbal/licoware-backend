const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const { config } = require("./config");

const proveedoresApi = require("./routes/proveedores");
const authApi = require("./routes/auth");

const { logErrors, errorHandler, wrapErrors} = require('./utils/middleware/errorHandlers');
const notFoundHandler = require('./utils/middleware/notFoundHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

// Rutas
proveedoresApi(app);
authApi(app);

//Catch 404
app.use(notFoundHandler);

//Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`App running in http://localhost:${config.port}`);
});
