var map;
var markers = [];
var infoWindow;
function initMap() {

    // Create a new StyledMapType object, passing it an array of styles,
    // and the name to be displayed on the map type control.
    var styledMapType = new google.maps.StyledMapType(
        [
          {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
          {elementType: 'labels.text.fill', stylers: [{color: '#C18A0C'}]},//#523735
          {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{color: '#c9b2a6'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [{color: '#dcd2be'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{color: '#ae9e90'}]
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#93817c'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{color: '#a5b076'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#447530'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#f5f1e6'}]
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{color: '#fdfcf8'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#f8c967'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#e9bc62'}]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{color: '#e98d58'}]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [{color: '#db8555'}]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{color: '#806b63'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [{color: '#8f7d77'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#ebe3cd'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{color: '#b9d3c2'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#92998d'}]
          }
        ],
        {name: 'Styled Map'});

    // Create a map object, and include the MapTypeId to add
    // to the map type control.
    var losAngeles = {
                lat: 34.063380,
                lng: -118.358080
            }
            map = new google.maps.Map(document.getElementById('map'), {
                center: losAngeles,
                zoom: 8,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map']
      }
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    infoWindow = new google.maps.InfoWindow();
    searchStores();
    //displayStores(stores);
    // showStoresMarkers(stores);
    // setOnClickListener();
  }


// function initMap() {
//     var losAngeles = {
//         lat: 34.063380,
//         lng: -118.358080
//     }
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: losAngeles,
//         zoom: 8
//     });
//    infoWindow = new google.maps.InfoWindow();
//     displayStores()
//     showStoresMarkers()
// }

function searchStores(){
    var foundStores = [];
    var zipCode = document.getElementById("zip-code-input").value;
    if(zipCode){
        stores.forEach(function(store){
            var postal = store.address.postalCode.substring(0,5);
            if(postal == zipCode){
                foundStores.push(store);
            }
        });
    }else{
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations(){
    function clearLocations() {
        infoWindow.close();
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers.length = 0;
    }
}

function setOnClickListener(){
    var storeElements = document.querySelectorAll(".store-container");
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click',function(){
            google.maps.event.trigger(markers[index], 'click');
        });
    });
}

function displayStores(stores) {
    var storesHtml = "";
    stores.forEach(function(store, index){
        var address = store.addressLines;
        var phone = store.phoneNumber;
        storesHtml += `
            <div class="store-container">
                <div class="store-info-container">
                    <div class="store-address">
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>
                    </div>
                    <div class="store-phone-number">${phone}</div>
                </div>
                <div class="store-number-container">
                    <div class="store-number">
                        ${index+1}
                    </div>
                </div>
            </div>
        `
    });
    document.querySelector('.stores-list').innerHTML = storesHtml;
}


function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function(store, index){
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);
        var name = store.name;
        var address = store.addressLines;
        var openStatusText= store.openStatusText;
        var phoneNumber = store.phoneNumber;
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, phoneNumber, index);
    })
    map.fitBounds(bounds);
}


function createMarker(latlng, name, address, openStatusText, phoneNumber, index) {
    
    var iconBase = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/';
        var icons = {
          parking: {
            icon: iconBase + 'parking_lot_maps.png'
          },
          library: {
            icon: iconBase + 'library_maps.png'
          },
          info: {
            icon: iconBase + 'info-i_maps.png'
          }
        };

    var html = `<div class="store-info-window">
                    <div class="store-info-name">${name}</div>
                    <div class="store-info-status">${openStatusText}</div>
                    <div class="store-info-address">
                        <div class="info-window-icon">
                            <i class="fas fa-paper-plane"></i>
                        </div>
                        <a target="_blank" href="https://www.google.com/maps/dir/?api=1&origin=6066 West Olympic Boulevard Los Angeles, CA 90036&destination=${address[0]} ${address[1]}">${address[0]}</a>
                    </div>
                    <div class = store-info-number>
                        <div class="info-window-icon">
                            <i class="fas fa-phone-alt"></i>
                        </div>
                        ${phoneNumber}
                </div>`;
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      icon: icons.info.icon,
      label: `${index+1}`
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
}