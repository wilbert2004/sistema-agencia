//importamos dotenv
import "dotenv/config";
//importamos la bd q ue nos servira para cpnsultra de dtao s
import { db } from "./src/prisma/db";

//importamos la funcion de crear usuario
async function main() {
  const runtime = await db.connect({
    url: process.env.DATABASE_URL!,
  });

  //crearemos la funcion para un metod get en usuarios
  const usuarios = await db.orm.public.Usuarios.select(
    "idUsuario",
    "nombre",
    "correo",
  ).all();

  console.log(usuarios);
  await runtime.close();
}

//llamamos a la funcion main
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
