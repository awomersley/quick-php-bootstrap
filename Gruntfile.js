module.exports = function(grunt) {

  require("time-grunt")(grunt);

  var dir = __dirname.split('/').pop();

    var config = {

        timestamp: grunt.template.today("yyyymmddhhMMss"),

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            options: {
                livereload: true
            },
            html: {
                files: ['httpdocs/inc/**/*','httpdocs/*']
            },
            assets: {
              files: ["httpdocs/assets/less/*", "httpdocs/assets/js/*"],
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
              "temp/site.less": ["httpdocs/assets/less/variables.less", "httpdocs/assets/less/*"]
            }
          }

        },

        less: {

          options:{
            sourceMap:true,
            compress:true,
            report:"min",
            sourceMapBasepath: "httpdocs/",
            sourceMapRootpath:"../../../"
          },

          site: {
            options: {
              sourceMapFilename: "httpdocs/cache/assets/site-<%= timestamp %>.css.map",
              sourceMapURL: "/cache/assets/site-<%= timestamp %>.css.map",
            },
            files: {
              "httpdocs/cache/assets/site-<%= timestamp %>.css": ["temp/site.less"]
            }
          },

          bootstrap: {
            options: {
              sourceMap:false,
              paths: ["bower_components/bootstrap/less"],
            },
            files: {
              "httpdocs/assets/libs/bootstrap/bootstrap.min.css": ["httpdocs/assets/libs/bootstrap/custom-build.less"]
            }
          },

        },


        uglify: {

          options:{
            sourceMap:true
          },
          site: {
            files: {
              "httpdocs/cache/assets/site-<%= timestamp %>.js": ["httpdocs/assets/js/*"]
            }
          },
          bootstrap:{
            options:{
              sourceMap:false
            },
            src: [
              'bower_components/bootstrap/js/transition.js',
              'bower_components/bootstrap/js/alert.js',
              'bower_components/bootstrap/js/button.js',
              'bower_components/bootstrap/js/carousel.js',
              'bower_components/bootstrap/js/collapse.js',
              'bower_components/bootstrap/js/dropdown.js',
              'bower_components/bootstrap/js/modal.js',
              'bower_components/bootstrap/js/tooltip.js',
              'bower_components/bootstrap/js/popover.js',
              'bower_components/bootstrap/js/scrollspy.js',
              'bower_components/bootstrap/js/tab.js',
              'bower_components/bootstrap/js/affix.js'
            ],
            dest: 'httpdocs/assets/libs/bootstrap/bootstrap.min.js'
          },

        },

        concat: {
          options: {
            stripBanners:true
          },
          css: {
            options: {
              separator: '\r',
            },
            src: ['httpdocs/assets/libs/bootstrap/bootstrap.min.css', 'httpdocs/assets/libs/fontawesome/css/font-awesome.min.css', 'httpdocs/cache/assets/site-<%= timestamp %>.css'],
            dest: 'httpdocs/cache/assets/'+dir+'-<%= timestamp %>.css',
          },
          js: {
            options: {
              separator: ';\r',
            },
            src: ['httpdocs/assets/libs/jquery/jquery.min.js', 'httpdocs/assets/libs/bootstrap/bootstrap.min.js', 'httpdocs/cache/assets/site-<%= timestamp %>.js'], //,  ,
            dest: 'httpdocs/cache/assets/'+dir+'-<%= timestamp %>.js',
          }
        },

        shell: {
          remove_sourcemaps:{
            command: [
              "sed -i.tmp 's/sourceMappingURL=\\/cache\\/assets\\/site-<%= timestamp %>.css.map//g' httpdocs/cache/assets/"+dir+"-<%= timestamp %>.css",
              "sed -i.tmp 's/\\/\\/# sourceMappingURL=jquery.min.map;//g' httpdocs/cache/assets/"+dir+"-<%= timestamp %>.js",
              "sed -i.tmp 's/\\/\\/# sourceMappingURL=site-<%= timestamp %>.js.map//g' httpdocs/cache/assets/"+dir+"-<%= timestamp %>.js",
              "rm -f httpdocs/cache/assets/*.tmp"
            ].join('&&')
          },
          update_libs:{
            command:[
              'bower install',
              'mkdir -p httpdocs/assets/libs/jquery/ && cp bower_components/jquery/dist/jquery.min.js httpdocs/assets/libs/jquery/',
              'mkdir -p httpdocs/assets/libs/fontawesome/css/ && cp bower_components/fontawesome/css/font-awesome.min.css httpdocs/assets/libs/fontawesome/css/',
              'mkdir -p httpdocs/assets/libs/fontawesome/fonts/ && cp bower_components/fontawesome/fonts/* httpdocs/assets/libs/fontawesome/fonts/',
              'mkdir -p httpdocs/cache/fonts && cp bower_components/fontawesome/fonts/* httpdocs/cache/fonts',
            ].join('&&')
          },
          atom:{
            options: {
              failOnError:false
            },
            command: "atom ./"
          },
          site:{
            command: "rm -rf httpdocs/cache/assets/site* && rm -rf httpdocs/cache/assets/"+dir+"* && echo <%= timestamp %> > httpdocs/cache/assets/.timestamp"
          },

          set_folder_permissions: {
            command: "find httpdocs/* -type d -print0 | xargs -0 chmod 0755"
          },
          set_file_permissions: {
            // set permissions for all files in the httpdocs directory and subfolder... excluding less and css directories
            command: 'find httpdocs/* -depth -type f \\( ! -path **/less/*.less \\) \\( ! -path **/js/*.js  \\) -print0 | xargs -0 chmod 0644'
          },
          set_cache_permissions : {
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
    grunt.registerTask("set_permissions",     ["shell:set_folder_permissions", "shell:set_file_permissions", "shell:set_cache_permissions"]);

    // Register frontend tasks
    grunt.registerTask("site",                ["shell:site", "less_imports:site", "less:site", "uglify:site", "concat", "shell:remove_sourcemaps"]);

    // Register build task
    grunt.registerTask("update",              ["shell:update_libs", "less:bootstrap", "uglify:bootstrap", "site"]);

    // Add serve task
    grunt.registerTask("serve",               ["shell:atom", "site", "php", "watch"]);

    // Register default development task
    grunt.registerTask("default",             ["update", "serve"]);

};
