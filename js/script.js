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
      {"elementType": "geometry","stylers": [{"color": "#ebe3cd"}]},
      {"elementType": "labels.text.fill","stylers": [{"color": "#523735"}]},
      {"elementType": "labels.text.stroke","stylers": [{"color": "#f5f1e6"}]},
      {"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#c9b2a6"}]},
      {"featureType": "administrative.land_parcel","elementType": "geometry.stroke","stylers": [{"color": "#dcd2be"}]},
      {"featureType": "administrative.land_parcel","elementType": "labels.text.fill","stylers": [{"color": "#ae9e90"}]},
      {"featureType": "landscape.natural","elementType": "geometry","stylers": [{"color": "#dfd2ae"}]},
      {"featureType": "poi","elementType": "geometry","stylers": [{"color": "#dfd2ae"}]},
      {"featureType": "poi","elementType": "labels.text.fill","stylers": [{"color": "#93817c"}]},
      {"featureType": "poi.park","elementType": "geometry.fill","stylers": [{"color": "#a5b076"}]},
      {"featureType": "poi.park","elementType": "labels.text.fill","stylers": [{"color": "#447530"}]},
      {"featureType": "road","elementType": "geometry","stylers": [{"color": "#f5f1e6"}]},
      {"featureType": "road.arterial","elementType": "geometry","stylers": [{"color": "#fdfcf8"}]},
      {"featureType": "road.highway","elementType": "geometry","stylers": [{"color": "#f8c967"}]},
      {"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{"color": "#e9bc62"}]},
      {"featureType": "road.highway.controlled_access","elementType": "geometry","stylers": [{"color": "#e98d58"}]},
      {"featureType": "road.highway.controlled_access","elementType": "geometry.stroke","stylers": [{"color": "#db8555"}]},
      {"featureType": "road.local","elementType": "labels.text.fill","stylers": [{"color": "#806b63"}]},
      {"featureType": "transit.line","elementType": "geometry","stylers": [{"color": "#dfd2ae"}]},
      {"featureType": "transit.line","elementType": "labels.text.fill","stylers": [{"color": "#8f7d77"}]},
      {"featureType": "transit.line","elementType": "labels.text.stroke","stylers": [{"color": "#ebe3cd"}]},
      {"featureType": "transit.station","elementType": "geometry","stylers": [{"color": "#dfd2ae"}]},
      {"featureType": "water","elementType": "geometry.fill","stylers": [{"color": "#b9d3c2"}]},
      {"featureType": "water","elementType": "labels.text.fill","stylers": [{"color": "#92998d"}]}],
    streetViewControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

  map = new google.maps.Map(document.getElementById("maparea"), mapOptions);

  var input = document.getElementById('NameSearch');
  var searchBox = new google.maps.places.SearchBox(input);

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
}

google.maps.event.addDomListener(window, "load", initialize);

codeAddress = function () {
  var address = document.getElementById('NameSearch').value;
  if(address === '' )
    address = '28.5359744, 77.34566410000002';

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

function directioncalc() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
  var dest = address;
  getLocation();
  calculateAndDisplayRoute(directionsService, directionsDisplay, dest);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, dest) {
    directionsService.route({
      origin: address,
      destination: dest,
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
      }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
