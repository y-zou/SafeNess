var map;
var geo_loc = true;
var latitude
var longitude

function openMap(lat, lon) {
    // If it's an iPhone..
    if( (navigator.platform.indexOf("iPhone") != -1)
        || (navigator.platform.indexOf("iPod") != -1)
        || (navigator.platform.indexOf("iPad") != -1))
         window.open("maps://http://maps.apple.com/maps?q="+lat+","+lon);
    else
         window.open("http://maps.google.com/maps?daddr="+lat+","+lon);
}

// Google Map Handler
function initMap(latitude, longitude) {
    navigator.geolocation.getCurrentPosition(function(position) {
        if (geo_loc) {
            latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
        } else {
            latitude = 38.9283;
            longitude = -77.1753;
        }


        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: latitude, lng: longitude},
            zoom: 11
        });

        map.addListener('click',function(e){

          var marker = new google.maps.Marker({
            position: e.latLng,
            map: map
        });

        latitude = e.latLng.lat();
        longitude = e.latLng.lng();


        $.ajax({
            url: "https://e01b0067.ngrok.io/SafeNess/index.php?lat="+latitude+"&lon="+longitude+"&rad=1&key=eb6065587d974500fa01af34b0cce99b",
            dataType: "json"
        }).done(function(loc_data) {
            for (var i=0; i < loc_data['data'].length; i++) {
                var marker = new google.maps.Marker({
                    position: {lat:loc_data['data'][i]['geocode']['lat'], lng:loc_data['data'][i]['geocode']['lng']},
                    map: map,
                    icon: {
                        url: 'img/cap_one.png',
                        scaledSize: new google.maps.Size(30, 30)
                    }
                });

                $.ajax({
                    url: "https://api.spotcrime.com/crimes.json",
                    data: {
                        lat: loc_data['data'][i]['geocode']['lat'],
                        lon: loc_data['data'][i]['geocode']['lng'],
                        key: "privatekeyforspotcrimepublicusers-commercialuse-877.410.1607",
                        radius: 0.01
                    },
                    dataType: 'jsonp',
                    lat: loc_data['data'][i]['geocode']['lat'],
                    lon: loc_data['data'][i]['geocode']['lng'],
                    name: loc_data['data'][i]['name'],
                    index: i,
                    success: function(d) {

                        var safety = "";
                        //clear span
                        if (d['crimes'].length <= 8)
                            safety = "<span class='badge new black-text'>SAFE</span></a>";
                        else if (8 < d['crimes'].length && d['crimes'].length <= 25)
                            safety = "<span class='badge new black-text yellow'>MODERATE</span></a>"
                        else
                            safety = "<span class='badge new black-text red'>STAY ALERT</span></a>"

                        $(".collection").append("<a class='black-text collection-item' onclick='openMap("+this.lat+","+this.lon+")'>"+this.name+safety);
                    }
                });
            }
        });

      })
    });
}

$(document).ready(function() {
    $(".dropdown-button").dropdown();
});
