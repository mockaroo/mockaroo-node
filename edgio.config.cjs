// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config
module.exports = {
  // The name of the site in Edgio to which this app should be deployed.
  name: "mockaroo-docs",

  // The name of the team in Edgio to which this app should be deployed.
  team: "mockaroo",

  // Overrides the default path to the routes file. The path should be relative to the root of your app.
  // routes: 'routes.js',
  origins: [],

  environments: {
    production: {
      hostnames: [{ hostname: "docs.mockaroo.com" }],
    },
  },
};
