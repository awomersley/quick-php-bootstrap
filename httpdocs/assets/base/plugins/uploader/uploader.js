(function($, $STAN) {

  'use strict';

  var $this;

  // Click Listeners
  $(window).ready(function() {

    // Set
    $("body").on("click", ".uploader .file i", function() {

      var target = $(this).parents('.uploader');

      return methods.removeFile.apply(target, [$(this).parents('.file')]);

    });

  });

  // Define Methods
  var methods = {

    init: function(options) {

      var _this = this;

      // Iterate Through Selectors
      return this.each(function(index) {

        // Set this
        var $this = $(this);

        // Set Options
        var settings = $.extend({
          currentFile: false,
          fileObjects: [],
          fileCheck: [],
          fileNames: [],
          fileCount: 0,
          post_url: $(this).find("[name='uploader_post_url']").val(),
          max_size: $(this).find("[name='uploader_max_size']").val(),
          allowed_files: $(this).find("[name='uploader_allowed_files']").val(),
          multiple: $(this).find("[name='uploader_multi']").val(),
          refreshOnComplete: $(this).find("[name='uploader_refresh_complete']").val(),
          hideTagAfterUpload: $(this).find("[name='uploader_hide_tag_after_upload']").val(),
        }, options);

        // Save settings
        $this.data('Uploader', settings);

        // Set clicks for alerts
        $(this).find('.alert i').click(function() {
          $(this).parent().css('display', 'none');
        })

        // Add event handlers
        methods.addEventHandlers.apply($(this));

        // IE Handler
        //$('.uploader').on('ieupload', ieUpload);

        // Read files
        if ($(this).find("[data-uploader-files]").val()) {

          var file;
          var files = $.parseJSON($(this).find("[data-uploader-files]").val());

          for (var x in files) {

            file = files[x];

            if (!file['remove']) {

              // Add to file check
              settings.fileCheck.push(file.Name);

              // Set HTML
              methods.setHTML.apply($this, [file.Name, file.Link]);

            }

            // Store file in filename
            settings.fileNames[settings.fileCount] = file;

            // Set upload complete
            methods.uploadComplete.apply($this, [settings.fileCount]);

            // Incriment FileCount
            settings.fileCount++;

          }

        }

      });

    },

    uploadInit: function() {

      var settings = $(this).data('Uploader');

      settings.shownErrors = false;

      if (new XMLHttpRequest().upload) { // Modern browsers

        methods.checkFiles.apply($(this));

      } else { // IE8 and 9

        $('.uploader input').css('display', 'none');

        methods.uploadStart.apply($(this));

        $('.uploader img').css('display', 'block');

        settings.formAction = $(this).parents('form').attr('action');
        if ($(this).parents('form').hasClass('jsform')) settings.jsForm = true;

        $(this).parents('form').attr({
          target: 'uploader_frame',
          action: settings.post_url,
          enctype: 'multipart/form-data'
        }).removeClass('jsform');

        $('[name="uploader_ie"]').val(1);

        $(this).parents('form').submit();

      }

    },

    checkFiles: function() {

      var settings = $(this).data('Uploader');

      $this = $(this);

      // Get input field
      //input = document.getElementById('safile');
      settings.input = $(this).find('.add input').prop("files");

      settings.complete = true;

      // Read input files in to FileNames and FileObjects array
      $.each(settings.input, function(key, value) {

        if ($.inArray(value.name, settings.fileCheck) < 0 && methods.allowedExt.apply($this, [value.name]) && value.size < settings.max_size) {

          settings.complete = false;

          // Store filename in FileCheck
          settings.fileCheck.push(value.name);

          // Store filename in FileNames
          settings.fileNames.push({
            Name: value.name,
            Url: ''
          });

          // Store ID in file object
          value.ID = settings.fileCount;

          // Add file object to FileObjects
          settings.fileObjects.push(value);

          // Set HTML
          methods.setHTML.apply($this, [value.name, false]);

          // Incriment FileCount
          settings.fileCount++;

        } else {

          if (!settings.shownErrors) {

            // Show Error
            if (!methods.allowedExt.apply($this, [value.name])) methods.showError.apply($this, ['fileext']);

            // Show Error
            if ($.inArray(value.name, settings.fileCheck) >= 0) methods.showError.apply($this, ['filedupe']);

            // Show Error
            if (value.size >= settings.max_size) methods.showError.apply($this, ['filesize']);

          }

        }

      });

      settings.shownErrors = true;

      // Upload files if currently not busy
      if (!settings.action && settings.fileObjects[0]) methods.uploadFiles.apply($this);

      if (!settings.action && settings.complete) {
        $STAN.trigger('fileupload.file fileupload.file.complete', $(this), settings);
      }

      if (!settings.action && settings.complete && settings.refreshOnComplete == '1') {
        window.location.href = window.location.href;
      }

      if (!settings.fileObjects[0]) {
        $(this).find('.add input').remove();
        $(this).find('.add').append("<input type='file' name='uploader_file' />");
        methods.addEventHandlers.apply($(this));
      }

    },

    uploadFiles: function() {

      var settings = $(this).data('Uploader');

      $this = $(this);

      methods.uploadStart.apply($(this));

      // Set new data
      var data = new FormData();

      // Add a file to form data
      data.append(0, settings.fileObjects[0]);
      data.append('PostData', $(this).closest('form').serialize());
      data.append('PostJSON', $(this).find("[name='uploader_json']").val());
      data.append('no_validate', 1);
      data.append('uploader_param', $(this).attr('data-param'));

      // Remove file from FileObjects and assign to CurrentFile
      settings.currentFile = settings.fileObjects.splice(0, 1);

      //console.log(settings.post_url);

      // Create Ajax Request
      $.ajax({

        xhr: function() {

          var xhr = new window.XMLHttpRequest();

          xhr.upload.addEventListener("progress", function(event) {

            if (event.lengthComputable) {

              var percent = (event.loaded / event.total) * 100;
              $this.find(".file" + settings.currentFile[0].ID + " .saprogress").css('width', percent + "%");
            }

          }, false);

          return xhr;

        },
        url: settings.post_url,
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(data, textStatus, jqXHR) {

          $('.uploader[data-param="' + data.param + '"]').Uploader('success', data, textStatus, jqXHR);

        }

      });

    },

    success: function(data, textStatus, jqXHR) {

      var settings = $(this).data('Uploader');

      $this = $(this);

      // Update FileNames array with file URL
      settings.fileNames[settings.currentFile[0].ID].Url = data.filename;

      // upload Compelete
      methods.uploadComplete.apply($this, [settings.currentFile[0].ID]);

      // Check for more files to upload
      methods.checkFiles.apply($this);

    },

    addEventHandlers: function() {

      var settings = $(this).data('Uploader');

      $this = $(this);

      // Add listener
      if (new XMLHttpRequest().upload) {

        $(this).find('.add input').on('change', function() {
          methods.uploadInit.apply($(this).closest('.uploader'));
        });

        if (settings.multiple == '1') {
          $(this).find('.add input').attr('multiple', 'multiple');
        }

      } else {

        $(this).find('.add input').on('change', function() {
          methods.uploadInit.apply($(this).closest('.uploader'))
        });

      }


    },

    resetEvents: function() {

      var settings = $(this).data('Uploader');

      onChangeEvent = false;

    },

    showError: function(error) {

      var settings = $(this).data('Uploader');

      $(this).find('.' + error).css('display', 'block');

      $STAN.trigger('fileupload.error fileupload.error.shown', $(this), settings);

      setTimeout(function() {

        $(this).find('.' + error).css('display', 'none');

        $STAN.trigger('fileupload.error fileupload.error.hidden', $(this), settings);

      }, 2000);

    },

    allowedExt: function(filename) {

      var settings = $(this).data('Uploader');

      var re = new RegExp("\.(" + settings.allowed_files + ")+$", "i");
      if (filename.search(re) > 0) return true;
      else return false;

      //if( filename.search(/\.(allowed_files)+$/i)>0 ) return true; else return false;

    },

    setHTML: function(filename, url) {

      var settings = $(this).data('Uploader');

      if (url) {
        var link = "<a href='" + url + "'>";
        var linkEnd = "</a>";
      } else {
        var link = linkEnd = '';
      }

      $(this).find(".files").append("<div class='file file" + settings.fileCount + "' data-file='" + settings.fileCount +
        "'><div class='saprogress'></div><div class='text'>" +
        link +
        filename + linkEnd +
        "<i class='fa fa-times'></i></div></div>");



    },

    uploadStart: function() {

      var settings = $(this).data('Uploader');

      // Set action to true
      settings.action = true;

    },

    multiCheck: function(id) {

      var settings = $(this).data('Uploader');

      $this = $(this);

      $(this).find(".file").each(function() {

        if (id != $(this).attr('data-file')) methods.removeFile.apply($this, [$(this)]);

      });

    },

    uploadComplete: function(id) {

      var settings = $(this).data('Uploader');

      $this = $(this);

      if (id >= 0) {

        // Add uploaded class
        if (settings.hideTagAfterUpload) {
          $(this).find(".file" + id).addClass("hide");
        } else {
          $(this).find(".file" + id).addClass("uploaded");
        }

        // Add click to remove handler
        /*$(this).find(".file" + id + " i").click(function() {

          console.log($this.data('Uploader'));
          methods.removeFile.apply($this, [$(this).parents('.file')]);

        });*/

        $STAN.trigger('fileupload.file fileupload.file.add', $(this), settings);

        if (settings.multiple != '1') methods.multiCheck.apply($(this), [id]);

      }

      // Set action to false
      settings.action = false;

      // Update sa files field
      $(this).find("[data-uploader-files]").val(JSON.stringify(settings.fileNames));

    },

    removeFile: function($this) {

      var settings = $(this).data('Uploader');

      for (var x in settings.fileCheck) {
        if (settings.fileCheck[x] == settings.fileNames[$this.attr('data-file')].Name) {
          settings.fileCheck[x] = false;
        }
      }

      // Set file to false
      settings.fileNames[$this.attr('data-file')].remove = 1;

      // Update sa files field
      $(this).find("[data-uploader-files]").val(JSON.stringify(settings.fileNames));

      // Remove element
      $this.remove();

      // Triggers
      $STAN.trigger('fileupload.file fileupload.file.remove', $(this), settings);

    }

  };

  $.fn.Uploader = function(method) {

    if (methods[method]) {

      if (typeof this.data('Uploader') !== 'undefined') {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      }

      return this;

    } else if (typeof method === 'object' || !method) {

      return methods.init.apply(this, arguments);

    } else {

      $.error('Method ' + method + ' does not exist on jQuery.Datatable');

      return this;

    }

  };

}(jQuery, $STAN));
