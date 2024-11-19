const keyAPI = '7e7a5831fdc2f2cc70d38b8284d76c8b'

$('.search').on('click', function() {
    let cityName = $('.city-name').val();
    const openURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + keyAPI

    fetch(openURL)
    .then((response) => {
        return response.json();
    })
    
})
