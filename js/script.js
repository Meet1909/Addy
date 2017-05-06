var geocoder;
var map;

function initialize() {
  var mapOptions = {
		center: new google.maps.LatLng(28.5359744, 77.34566410000002),
		zoom: 15,
    disableDefaultUI: true,
    fullscreenControl: false,
    zoomControl: true,
    rotateControl: true,
    scaleControl: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.DEFAULT,
    position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    styles: [
    {
      "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#3a3935"
            },
            {
                "saturation": 5
            },
            {
                "lightness": -57
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ff0000"
            },
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels",
        "stylers": [
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            },
            {
                "hue": "#ff0000"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#b7caaa"
            },
            {
                "saturation": -14
            },
            {
                "lightness": -38
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#cbdac1"
            },
            {
                "saturation": -6
            },
            {
                "lightness": -9
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#c17118"
            },
            {
                "saturation": 61
            },
            {
                "lightness": -45
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ffcb00"
            },
            {
                "saturation": 50
            },
            {
                "lightness": -46
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#8ba975"
            },
            {
                "saturation": -46
            },
            {
                "lightness": -28
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#8d9b83"
            },
            {
                "saturation": -89
            },
            {
                "lightness": -12
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#d4dad0"
            },
            {
                "saturation": -88
            },
            {
                "lightness": 54
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#bdc5b6"
            },
            {
                "saturation": -89
            },
            {
                "lightness": -3
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#bdc5b6"
            },
            {
                "saturation": -89
            },
            {
                "lightness": -26
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ff2f00"
            },
            {
                "saturation": 74
            },
            {
                "lightness": -51
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#00e5ff"
            },
            {
                "saturation": 34
            },
            {
                "lightness": "-69"
            },
            {
                "visibility": "on"
            }
        ]
    }
],
    streetViewControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

  map = new google.maps.Map(document.getElementById("maparea"), mapOptions);

  var input = document.getElementById('NameSearch');
  var searchBox = new google.maps.places.SearchBox(input);

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  directionsDisplay.setMap(map);

  document.getElementById('directions').addEventListener('click', function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
}

google.maps.event.addDomListener(window, "load", initialize);

codeAddress = function () {
  var address = document.getElementById('NameSearch').value;
  if(address === '' )
    address = 'New Delhi, Delhi, India';

  geocoder = new google.maps.Geocoder();

  geocoder.geocode( { 'address': address}, function(results, status) {

    if (status == google.maps.GeocoderStatus.OK) {
      var georesult = results[0].geometry.location;
      map.setCenter(georesult);

      var marker = new google.maps.Marker({
        map: map,
        position: georesult,
        draggable: true,
        animation:google.maps.Animation.DROP,
      });

      updateMarkerPosition(georesult);
      updateaddycode(georesult);
      geocodePosition(georesult);

      google.maps.event.addListener(marker, 'dragstart', function() {
        updateMarkerAddress('Finding');
      });
      google.maps.event.addListener(marker, 'drag', function() {
        updateMarkerPosition(marker.getPosition());
        updateaddycode(marker.getPosition());
      });
      google.maps.event.addListener(marker, 'dragend', function() {
        geocodePosition(marker.getPosition());
      });
      google.maps.event.addListener(map, 'click', function(e) {
        updateMarkerPosition(e.latLng);
        updateaddycode(e.latLng);
        geocodePosition(marker.getPosition());
        marker.setPosition(e.latLng);
        map.panTo(marker.getPosition());
      });
    }

    else {
      alert('Error: ' + status);
    }

  });
}

codebackconvert = function(d) {
  return parseInt(d, 36);
}

codeconvert = function(d) {
  return (+d).toString(36).toUpperCase();
}

function updateMarkerAddress(str) {
  document.getElementById('address').innerHTML = str;
}

function updateMarkerPosition(latLng) {
  document.getElementById('info').innerHTML = [
    latLng.lat(),
    latLng.lng()
  ].join(', ');
}

function updateaddycode(latLng) {
  var latitude = latLng.lat();
  var longitude = latLng.lng();
  var lati = Math.round(latitude*10000)-74000;
  var long = Math.round(longitude*10000)-675000;
  if(lati<=0 || long<=0 || lati>=300000 || long>=300000) {
    document.getElementById('addycode').innerHTML = 'Region Not Supported';
  }
  else {
    var latcode = codeconvert(lati);
    var longcode = codeconvert(long);
    document.getElementById('addycode').innerHTML = [latcode,longcode].join('');
  }
}

function geocodePosition(pos) {
  geocoder.geocode({
    latLng: pos
  },
  function(responses) {
    if (responses && responses.length > 0) {
      updateMarkerAddress(responses[0].formatted_address);
    }
    else {
      updateMarkerAddress('Cannot determine address at this location.');
    }
  });
}

codeback = function() {
  var backcode = document.getElementById('BackCode').value;
  var backcode1 = backcode.substring(0,4);
  var backcode2 = backcode.substring(4,8);
  document.getElementById('NameSearch').value = [(codebackconvert(backcode1)+74000)/10000,(codebackconvert(backcode2)+675000)/10000].join(', ');
  codeAddress();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  document.getElementById('NameSearch').value = [lat,long].join(', ');
  codeAddress();
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var dest = document.getElementById('info').innerHTML;
  getLocation();
  directionsService.route({
    origin: document.getElementById('info').innerHTML,
    destination: dest,
    waypoints: 0,
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      var route = response.routes[0];
      var summaryPanel = document.getElementById('directions-panel');
      summaryPanel.innerHTML = '';
      // For each route, display summary information.
      for (var i = 0; i < route.legs.length; i++) {
        var routeSegment = i + 1;
        summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
            '</b><br>';
        summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
        summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
        summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
      }
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
