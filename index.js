const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { dbConnection } = require("./lib/mongoose");

const { config } = require("./config");

const {
  logErrors,
  errorHandler,
  wrapErrors,
} = require("./utils/middleware/errorHandlers");
const notFoundHandler = require("./utils/middleware/notFoundHandler");
const facturasApi = require("./routes/facturas");
const categoriasApi = require("./routes/categorias");
const productosApi = require("./routes/productos");
const proveedoresApi = require("./routes/proveedores");
const authApi = require("./routes/auth");
const usuariosApi = require("./routes/usuarios");

const app = express();

dbConnection();

app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join("public")));

// Rutas
usuariosApi(app);
proveedoresApi(app);
facturasApi(app);
categoriasApi(app);
productosApi(app);
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
