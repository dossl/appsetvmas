// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  rootURL: 'https://setvmas.com/api/api/',
  rootURLImages: 'https://setvmas.com/api/',
  guest: 'invitado@gmail.com',
  textsOptions: {
    destacado: {
      header: 'Destacar el anuncio',
      message: 'Utilice esta opción para que su anuncio aparezca destacado en las listas. ¡Llame la atención!'
    },
    masEtiquetas: {
      header: 'Comprar más etiquetas',
      message: 'Utilice esta opción para que su anuncio aparezca destacado en las listas. ¡Llame la atención!'
    },
    autorenovar: {
      header: 'Autorenovar periódicamente',
      message: 'Utilice esta opción para que su anuncio aparezca destacado en las listas. ¡Llame la atención!'
    },
    web: {
      header: 'Anuncie su web',
      message: 'Utilice esta opción para que su anuncio aparezca destacado en las listas. ¡Llame la atención!'
    },
    masImages: {
      header: 'Inserte más imágenes',
      message: 'Utilice esta opción para que su anuncio aparezca destacado en las listas. ¡Llame la atención!'
    },
    bannerInferior: {
      header: 'Anuncie banner inferior',
      message: 'Utilice esta opción para que su anuncio aparezca destacado en las listas. ¡Llame la atención!'
    },
    bannerSuperior: {
      header: 'Anuncie banner superior',
      message: 'Utilice esta opción para que su anuncio aparezca destacado en las listas. ¡Llame la atención!'
    },
  }
  // rootURL: 'https://62.171.171.229/api/api/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
