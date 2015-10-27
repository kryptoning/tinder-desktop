module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat:{
      options: {
        separator: ';'
      },
      deps:{
        src:[
          'node_modules/angular/angular.js',
          'node_modules/angular-ui-router/release/angular-ui-router.js',
          'node_modules/angular-*/angular-*.js',
        ],
        dest: 'dist/js/deps.js'
      },
      app:{
        src:[
          'js/**/*.js'
        ],
        dest: 'dist/js/app.js'
      }
    },
    cssmin: {
      deps: {
        src: ['node_modules/angular-material/angular-material*.min.css'],
        dest: 'dist/css/deps.css'
      },
      app: {
        src: ['css/**/*.css'],
        dest: 'dist/css/app.css'
      }
    },
    watch:{
      appJS:{
        files: ['<%= concat.app.src %>'],
        tasks: ['concat:app']
      },
      appCSS:{
        files: ['<%= cssmin.app.src %>'],
        tasks: ['cssmin:app']
      },
    }
  });
  // Load the npm installed tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // The default tasks to run when you type: grunt
  grunt.registerTask('default', ['concat', 'cssmin']);

  grunt.registerTask('watches', ['watch:appJS', 'watch:appCSS']);
};
