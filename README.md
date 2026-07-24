<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Backend MyFilms
## Antecedentes:

Existiendo previamente una aplicación creada en ReactJs que emplea la API TMDB y Firebase Authorization y Cloud Database cuyo finalidad es buscar información sobre películas.

La aplicación tiene las siguinetes funcionalidades:

- Permitirá registrar nuevos usuarios y hacer login con usuario/contraseña o bien con un sso de una cuenta Gmail.

- Los usuarios que esten autenticados en la aplicación, podrán almacenar películas como vistas, pendientes o favoritas.

- Será posible listar las últimas peliculas vistas, o todas en formato panel de carátulas o bien el línea de tiempo con miniatura de carátula.

- Cuando se seleccione una película después de realizar una búsqueda, se mostrará de ésta a parte de título, título original, año, duración, país/es, eq. Técnico, reparto, géneros, sinopsis, la fecha en la que se vió por última vez.

## Objetivo:

Almacenar la información de películas vistas, pendientes y favoritas de un usuario en una base de datos PostgreSQL utilizando una api Restful realizada con NestJs, documentando dicha api con Swagger.

## Puesta en marcha:
1. Clonar el repositorio.

2. Ejecutar:
```
npm install
```
3. Renombrar fichero ***.env-template*** a ***.env***

4. Configurar las variables de entorno.

5. Si no está instalado Docker, instalar y arrancar Docker Desktop.

6. Lanzar base de datos:
```
docker compose up -d
```
7. Aprovisionar en http://neon.com una base de datos en la nube y obtener los datos de conexión. Colocar estos datos en las variables de entorno.

8. Configurar la variable de entrono STAGE a prod para utilizar https en las conexión con la base de datos. Necesario si usa la base de datos en la nube.

9. Arrancar aplicación:
```
npm run start:dev
```