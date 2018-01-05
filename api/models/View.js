/**
* View.js
*
* @description :: Model that defines a file browser widget view.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      name: {
          type: 'string',
          required: true
      },
      showMenu: {
          type: 'boolean',
          required: true
      },
      showSearch: {
          type: 'boolean',
          required: true
      },
      defaultCategory: {
          type: 'string',
          required: true
      },
      categories: {
          type: 'json',
          required: true
      },
      active: {
          type: 'boolean',
          required: true
      }

  }
};

