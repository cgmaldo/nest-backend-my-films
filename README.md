<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Backend MyFilms
## Antecedentes:

Existiendo previamente una aplicación creada en ReactJs que emplea la API TMDB y Firebase Authorization y Cloud Database cuyo finalidad es buscar información sobre películas.

La aplición tiene las siguinetes funcionalidades:

- Permitirá registrar nuevos usuarios y hacer login con usuario/contraseña o bien con un sso de una cuenta Gmail.

- Los usuarios que esten autenticados en la aplicación, podrán almacenar películas como vistas, pendientes o favoritas.

- Será posible listar las últimas peliculas vistas, o todas en formato panel de carátulas o bien el línea de tiempo con miniatura de carátula.

- Cuando se seleccione una película después de realizar una búsqueda, se mostrará de ésta a parte de título, título original, año, duración, país/es, eq. Técnico, reparto, géneros, sinopsis, la fecha en la que se vió por última vez.


## Objetivo:

Almacenar la información de películas vistas, pendientes y favoritas de un usuario en una base de datos PostgreSQL utilizando una api Restful realizada con NestJs, documentando dicha api con Swagger.