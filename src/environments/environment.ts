// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    SERVER_URL: `http://www.htc.com/api/admin/`,
    INIT_JSON: 'http://localhost:4201/assets/app-data.json',
    debug: true,
    production: false,
    hmr: false
};
