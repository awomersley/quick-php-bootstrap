(function($, $STAN) {

  'use strict';

  var params;

  // Click Listeners
  $(window).ready(function() {

    // Filter
    $('body').on('submit', "[data-toggle='gmap.params']", function(event) {

      var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents("[data-toggle='gmap']");

      return methods.search.apply(target);

    });

    // Show info window
    $("body").on("click", "[data-toggle='gmap.info.show']", function(event) {

      var target = $(this).attr('data-target') || $(this).closest("[data-toggle='gmap']");

      methods.showInfoWindow.apply(target, [$(this).attr('data-type'), $(this).attr('data-id')]);

      return false;

    });

    // Close info window
    $("body").on("click", "[data-toggle='gmap.info.close']", function(event) {

      var target = $(this).attr('data-target') || $(this).closest("[data-toggle='gmap']");

      methods.closeInfoWindow.apply(target);

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
          zoom: $this.attr('data-zoom') || 10,
          searchURL: $this.attr('data-search-url') || false,
          params: $("[data-toggle='gmap.params']"),
          center: false,
          map: false,
          defaultIcon: '/assets/frontend/images/maps/marker.png',
          zoomcontrol: {
            position: google.maps.ControlPosition.LEFT_CENTER
          },
          callback: false,
          markers: [],
          polygons: [],
          infobox: new InfoBox({
            content: '',
            closeBoxURL: ''
          })
        }, options);

        // Set center
        settings.center = new google.maps.LatLng(settings.lat, settings.lng);

        // Create map
        settings.map = new google.maps.Map(this.getElementsByClassName('map')[0], {
          minZoom: 2,
          zoom: parseInt(settings.zoom),
          center: settings.center,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          panControl: false,
          streetViewControl: false,
          zoomControlOptions: settings.zoomcontrol
        });

        google.maps.event.addListener(settings.map, 'click', function() {

          methods.closeInfoWindow.apply($this);

        });

        var allowedBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(-85, -180),
          new google.maps.LatLng(85, 180)
        );
        var lastValidCenter = settings.map.getCenter();

        google.maps.event.addListener(settings.map, 'center_changed', function() {

          if (allowedBounds.contains(settings.map.getCenter())) {
            lastValidCenter = settings.map.getCenter();
            return;
          }
          settings.map.panTo(lastValidCenter);
        });


        // Save settings
        $this.data('Gmap', settings);

        // Init trigger
        $STAN.trigger('gmap.load');

      });

    },


    addMarkerBasic: function(id, lat, lng, icon) {

      var settings = $(this).data('Gmap');

      var _icon = icon || settings.defaultIcon;

      settings.markers[id] = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        icon: new google.maps.MarkerImage(_icon, new google.maps.Size(42, 50), new google.maps.Point(0, 0), new google.maps.Point(21, 50)),
        map: settings.map
      });

    },


    addMarker: function(id, lat, lng, icon, icon_on, infobox_html) {

      var settings = $(this).data('Gmap');

      if (!settings) return;

      var $this = $(this);

      var _icon = new google.maps.MarkerImage(icon, new google.maps.Size(42, 50), new google.maps.Point(0, 0), new google.maps.Point(21, 50));
      var _icon_on = new google.maps.MarkerImage(icon_on, new google.maps.Size(42, 50), new google.maps.Point(0, 0), new google.maps.Point(21, 50));

      settings.markers[id] = new google.maps.Marker({
        map: settings.map,
        position: new google.maps.LatLng(lat, lng),
        icon: _icon,
        icon_off: _icon,
        icon_on: _icon_on,
        zIndex: 1,
        open: false,
        id: id,
        infoboxContent: "<div class='infobox' id='infobox'>" + infobox_html + "</div>",
        infoboxPosition: new google.maps.LatLng(lat, lng),
        infoboxOffset: new google.maps.Size(-20, 5)
      });

      google.maps.event.addListener(settings.markers[id], 'click', function() {

        if (this.open) {
          methods.closeInfoWindow.apply($this, ['marker', this.id]);
        } else {
          methods.openInfoWindow.apply($this, ['marker', this.id]);
        }

      });

    },


    addPolygonGroup: function(group, options, options_on, infobox_html) {

      var settings = $(this).data('Gmap');

      if (!settings) return;

      for (var x in group) {

        var polygon = group[x];

        methods.addPolygon.apply($(this), [polygon, options, options_on, infobox_html]);

      }

    },


    addPolygon: function(coords, options, options_on, infobox_html) {

      var settings = $(this).data('Gmap');

      if (!settings) return;

      var $this = $(this);

      var latlng = [];

      var bounds = new google.maps.LatLngBounds();

      for (var y in coords) {

        latlng.push(new google.maps.LatLng(coords[y]['lat'], coords[y]['lng']));

        bounds.extend(latlng[y]);

      }

      // Construct the polygon.
      var polygon = new google.maps.Polygon({
        id: settings.polygons.length,
        open: false,
        paths: latlng,
        options_off: options,
        options_on: options_on,
        infoboxContent: "<div class='infobox cms'>" + infobox_html + "</div>",
        infoboxPosition: bounds.getCenter(),
        infoboxOffset: new google.maps.Size(-150, 0)
      });

      polygon.setOptions(options);

      polygon.setMap(settings.map);

      google.maps.event.addListener(polygon, 'click', function() {

        if (this.open) {
          methods.closeInfoWindow.apply($this, ['polygon', this.id]);
        } else {
          methods.openInfoWindow.apply($this, ['polygon', this.id]);
        }

      });

      settings.polygons.push(polygon);

    },


    openInfoWindow: function(type, id) {

      var settings = $(this).data('Gmap');

      var object = (type == 'marker') ? settings.markers[id] : settings.polygons[id];

      methods.closeInfoWindow.apply($(this));

      object.open = true;
      settings.infobox.setContent(object.infoboxContent);
      settings.infobox.setPosition(object.infoboxPosition);
      settings.infobox.setOptions({
        pixelOffset: object.infoboxOffset
      });
      settings.infobox.open(settings.map);

      settings.map.panTo(object.infoboxPosition);

      if (type == 'marker') {
        object.setIcon(object.icon_on);
        object.setZIndex(999);
      } else if (type == 'polygon') {
        object.setOptions(object.options_on);
      }

      settings.map.setOptions({
        scrollwheel: false
      });

    },


    closeInfoWindow: function() {

      var settings = $(this).data('Gmap');

      settings.infobox.close();

      for (var x in settings.markers) {

        var marker = settings.markers[x];

        marker.open = false;
        marker.setIcon(marker.icon_off);
        marker.setZIndex(1);

      }

      for (var x in settings.polygons) {

        var polygon = settings.polygons[x];

        polygon.open = false;
        polygon.setOptions(polygon.options_off);

      }

      settings.map.setOptions({
        scrollwheel: true
      });

    },


    setSearchURL: function(url) {

      var settings = $(this).data('Gmap');

      settings.searchURL = url;

      return $(this);

    },


    resizeMap: function() {

      var settings = $(this).data('Gmap');

      var center = settings.map.getCenter();

      google.maps.event.trigger(settings.map, "resize");

      settings.map.setCenter(center);

    },


    search: function() {

      var settings = $(this).data('Gmap');

      var $this = $(this);

      methods.removeAllMarkers.apply($this);
      methods.removeAllPolygons.apply($this);

      var params = {
        "PostData": settings.params.serialize(),
      };

      $.post(settings.searchURL, params, function(data) {

        for (var x in data.markers) {

          var marker = data.markers[x];

          methods.addMarker.apply($this, [marker.id,
            marker.lat,
            marker.lng,
            marker.icon,
            marker.icon_on,
            marker.infobox
          ]);

        }

        for (var x in data.polygons) {

          var polygon = data.polygons[x];

          methods.addPolygonGroup.apply($this, [polygon.coords,
            polygon.options,
            polygon.options_on,
            polygon.infobox
          ]);

        }

      }, 'json');



    },


    // Remove all markers
    removeAllMarkers: function() {

      var settings = $(this).data('Gmap');

      for (var x in settings.markers) {

        var marker = settings.markers[x];

        marker.setMap(null);

      }

      settings.markers = [];

    },


    // Remove all polygons
    removeAllPolygons: function() {

      var settings = $(this).data('Gmap');

      for (var x in settings.polygons) {

        var polygon = settings.polygons[x];

        polygon.setMap(null);

      }

      settings.polygons = [];

    }

  };

  $.fn.Gmap = function(method) {

    if (methods[method]) {

      if (typeof this.data('Gmap') !== 'undefined') {
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
