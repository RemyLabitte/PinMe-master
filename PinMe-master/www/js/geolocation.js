// fall back
app.constant('defaultLocalisation', {
    'longitude': 6.1799699326036,
    'latitude': 48.689290283084
})

app.factory('geoLocation', function ($localStorage) {
    return {
        setGeolocation: function (latitude, longitude) {
            var position = {
                latitude: latitude,
                longitude: longitude
            }
            $localStorage.setObject('geoLocation', position)
        },
        getGeolocation: function () {
            return glocation = {
                lat: $localStorage.getObject('geoLocation').latitude,
                lng: $localStorage.getObject('geoLocation').longitude
            }
        }
    }
})