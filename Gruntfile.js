module.exports = function(grunt) {

  require("time-grunt")(grunt);

  var dir = __dirname.split('/').pop();

  var assets = grunt.file.readJSON("httpdocs/assets/assets.json");

  var config = {

    timestamp: grunt.template.today("yyyymmddhhMMss"),

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['httpdocs/inc/**/*', 'httpdocs/*']
      },
      assets: {
        files: ["httpdocs/assets/base/**/**/*", "httpdocs/assets/less/*", "httpdocs/assets/less/**/*", "httpdocs/assets/base/*",
          "httpdocs/assets/js/*", "httpdocs/assets/assets.json"
        ],
        tasks: ["site"]
      }
    },

    php: {
      dev: {
        options: {
          base: "httpdocs",
          open: true,
          hostname: "0.0.0.0",
          port: 8080
        }
      }
    },

    less_imports: {

      site: {
        files: {
          "temp/site.less": assets.less
        }
      }

    },

    less: {

      options: {
        sourceMap: true,
        compress: true,
        report: "min",
        sourceMapBasepath: "httpdocs/",
        sourceMapRootpath: "../../../"
      },

      site: {
        options: {
          sourceMapFilename: "httpdocs/cache/assets/site-<%= timestamp %>.css.map",
          sourceMapURL: "/cache/assets/site-<%= timestamp %>.css.map",
        },
        files: {
          "httpdocs/cache/assets/site-<%= timestamp %>.css": ["temp/site.less"]
        }
      }

    },


    uglify: {

      options: {
        sourceMap: true
      },
      site: {
        files: {
          "httpdocs/cache/assets/site-<%= timestamp %>.js": assets.js
        }
      }

    },

    concat: {
      options: {
        stripBanners: true
      },
      css: {
        options: {
          separator: '\r',
        },

        src: ['bower_components/material-design-icons/iconfont/material-icons.css',
          'httpdocs/cache/assets/site-<%= timestamp %>.css'
        ],
        dest: 'httpdocs/cache/assets/' + dir + '-<%= timestamp %>.css',
      },
      js: {
        options: {
          separator: ';\r',
        },
        src: ['httpdocs/cache/assets/jquery.min.js', 'httpdocs/cache/assets/site-<%= timestamp %>.js'], //,  ,
        dest: 'httpdocs/cache/assets/' + dir + '-<%= timestamp %>.js',
      }
    },

    shell: {
      remove_sourcemaps: {
        command: [
          "sed -i.tmp 's/sourceMappingURL=\\/cache\\/assets\\/site-<%= timestamp %>.css.map//g' httpdocs/cache/assets/" + dir + "-<%= timestamp %>.css",
          "sed -i.tmp 's/\\/\\/# sourceMappingURL=jquery.min.map;//g' httpdocs/cache/assets/" + dir + "-<%= timestamp %>.js",
          "sed -i.tmp 's/\\/\\/# sourceMappingURL=site-<%= timestamp %>.js.map//g' httpdocs/cache/assets/" + dir + "-<%= timestamp %>.js",
          "rm -f httpdocs/cache/assets/*.tmp"
        ].join('&&')
      },
      atom: {
        options: {
          failOnError: false
        },
        command: "atom ./"
      },
      site: {
        command: "rm -rf httpdocs/cache/assets/site* && rm -rf httpdocs/cache/assets/" + dir + "* && echo <%= timestamp %> > httpdocs/cache/assets/.timestamp"
      },

      set_folder_permissions: {
        command: "find httpdocs/* -type d -print0 | xargs -0 chmod 0755"
      },
      set_file_permissions: {
        // set permissions for all files in the httpdocs directory and subfolder... excluding less and css directories
        command: 'find httpdocs/* -depth -type f \\( ! -path **/less/*.less \\) \\( ! -path **/js/*.js  \\) -print0 | xargs -0 chmod 0644'
      },
      set_cache_permissions: {
        command: "chmod -R 0777 httpdocs/cache"
      }

    },

  };

  // Init grunt config
  grunt.initConfig(config);

  // Load node modules
  grunt.loadNpmTasks("grunt-php");
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-less-imports");
  grunt.loadNpmTasks('grunt-contrib-concat');


  // register set permissions task
  grunt.registerTask("set_permissions", ["shell:set_folder_permissions", "shell:set_file_permissions", "shell:set_cache_permissions"]);

  // Register frontend tasks
  grunt.registerTask("site", ["shell:site", "less_imports:site", "less:site", "uglify:site", "concat", "shell:remove_sourcemaps"]);

  // Register build task
  grunt.registerTask("update", ["site"]);

  // Add serve task
  grunt.registerTask("serve", ["shell:atom", "site", "php", "watch"]);

  // Register default development task
  grunt.registerTask("default", ["update", "serve"]);

};
