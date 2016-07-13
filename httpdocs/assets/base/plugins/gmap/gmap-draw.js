(function($, $STAN) {

  'use strict';

  var params;

  // Click Listeners
  $(window).ready(function() {

    // Gey polygons
    $("body").on("click", "[data-toggle='gmap.get-polygons']", function(event) {

      var target = $(this).attr('data-target') || $(this).closest("[data-gmap-draw]");

      methods.getPolygons.apply(target);

      return false;

    });

    // Gey polygons
    $("body").on("click", "[data-toggle='gmap.clear-polygons']", function(event) {

      var target = $(this).attr('data-target') || $(this).closest("[data-gmap-draw]");

      methods.clearPolygons.apply(target);

      return false;

    });



  });

  // Define Methods
  var methods = {

    init: function(options) {

      // Iterate Through Selectors
      return this.each(function(index) {

        // Set this
        var $this = $(this);

        // Set Options
        var settings = $.extend({
          lat: $this.attr('data-lat') || 0,
          lng: $this.attr('data-lng') || 0,
          zoom: $this.attr('data-zoom') || 5,
          polygons: [],
          polygonOptions: {
            fillColor: '#ef7622',
            fillOpacity: 0.5,
            strokeColor: '#ef7622',
            strokeWeight: 1,
            clickable: true,
            editable: true,
            draggable: true,
            zIndex: 1
          }
        }, options);

        // Set center
        settings.center = new google.maps.LatLng(settings.lat, settings.lng);

        // Create map
        settings.map = new google.maps.Map(this.getElementsByClassName('map')[0], {
          minZoom: 3,
          zoom: parseInt(settings.zoom),
          center: settings.center,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          panControl: false,
          streetViewControl: false,
          zoomControlOptions: settings.zoomcontrol
        });

        // Set drawing controls
        settings.drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: null,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              google.maps.drawing.OverlayType.POLYGON
            ]
          },
          polygonOptions: settings.polygonOptions
        });

        // Set polygon complete listener
        google.maps.event.addListener(settings.drawingManager, 'overlaycomplete', function(polygon) {

          settings.polygons.push(polygon);

        });

        // Attach drawing manager to map
        settings.drawingManager.setMap(settings.map);

        // Save settings
        $this.data('GmapDraw', settings);

        // Init trigger
        $STAN.trigger('gmapdraw.load');

        methods.addPolygonGroup.apply($this);

      });

    },

    setCenter: function(lat, lng, zoom) {

      var settings = $(this).data('GmapDraw');

      settings.lat = lat;
      settings.lng = lng;
      settings.zoom = zoom;

      settings.center = new google.maps.LatLng(settings.lat, settings.lng);

      settings.map.setCenter(settings.center);
      settings.map.setZoom(settings.zoom);

      return $(this);

    },

    clearPolygons: function() {

      var settings = $(this).data('GmapDraw');

      for (var x in settings.polygons) {

        var polygon = settings.polygons[x];

        polygon.overlay.setMap(null);

      }

      $(this).find('textarea').val('');

      settings.polygons = [];

      return $(this);

    },

    resizeMap: function() {

      var settings = $(this).data('GmapDraw');

      var center = settings.map.getCenter();

      google.maps.event.trigger(settings.map, "resize");

      settings.map.setCenter(center);

      return $(this);

    },

    getPolygons: function() {

      var settings = $(this).data('GmapDraw');

      var polygons = [];

      var latlng, polygon, coords;

      for (var x in settings.polygons) {

        polygon = settings.polygons[x].overlay.getPath();

        coords = [];

        for (var i = 0; i < polygon.getLength(); i++) {
          var xy = polygon.getAt(i);

          latlng = {
            lat: xy.lat(),
            lng: xy.lng()
          }
          coords[i] = latlng;
        }

        polygons[x] = coords;

      }

      if (polygons[0]) {
        $(this).find('textarea').val(JSON.stringify(polygons));
      } else {
        $(this).find('textarea').val('');
      }


      return $(this);

    },

    addPolygonGroup: function() {

      var settings = $(this).data('GmapDraw');

      if (!$(this).find('textarea').val()) return false;

      var group = JSON.parse($(this).find('textarea').val());

      for (var x in group) {

        var polygon = group[x];

        methods.addPolygon.apply($(this), [polygon]);

      }


    },

    addPolygon: function(coords) {


      var settings = $(this).data('GmapDraw');

      var $this = $(this);

      var latlng = [];

      for (var y in coords) {

        latlng.push(new google.maps.LatLng(coords[y]['lat'], coords[y]['lng']));

      }

      // Construct the polygon.
      var polygon = new google.maps.Polygon({
        id: settings.polygons.length,
        paths: latlng
      });

      polygon.setOptions(settings.polygonOptions);

      polygon.setMap(settings.map);

      var obj = {
        'overlay': polygon
      };

      settings.polygons.push(obj);



    },


  };

  $.fn.GmapDraw = function(method) {

    if (methods[method]) {

      if (typeof this.data('GmapDraw') !== 'undefined') {
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
