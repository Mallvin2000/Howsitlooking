const filterForecastQuery = {
    location: null,
    forecastType: null
}


function getForecastFromBackend(callback) {
    if (filterForecastQuery.forecastType == 1) {//2 hours forecast
        $.get("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast")
            .done((result) => callback(null, result))
            .fail((message) => callback(message, null));
    } else if (filterForecastQuery.forecastType == 2) {//24 hour forecast
        $.get("https://api.data.gov.sg/v1/environment/24-hour-weather-forecast")
            .done((result) => callback(null, result))
            .fail((message) => callback(message, null));
    } else if (filterForecastQuery.forecastType == 3) {
        $.get("https://api.data.gov.sg/v1/environment/4-day-weather-forecast")//4 day forecast
            .done((result) => callback(null, result))
            .fail((message) => callback(message, null));
    }
}


function populatePage(data) {
    console.log(data);
    //console.log(data.items[0].forecasts[0].forecast);
    var HTML = "";

    //2 hour forecast
    if (filterForecastQuery.forecastType == 1) {
        for (let i = 0; i < data.items[0].forecasts.length; i++) {
            //console.log(data.items[0].forecasts[i].area);
            if (data.items[0].forecasts[i].area == filterForecastQuery.location) {
                HTML = data.items[0].forecasts[i].area + " : " + data.items[0].forecasts[i].forecast;
                console.log("Success:"+ HTML );
            }
        }

        if (HTML.length == 0) {
            HTML = "Please Retype Location"
            $('#forecast-data').html(HTML);
        } else {
            $('#forecast-data').html(HTML);
        }
       

    }


    //24 hour forecast
    if (filterForecastQuery.forecastType == 2) {
        //console.log(data.items[0].general.forecast);
        HTML = "Forecast: " + data.items[0].general.forecast;
        $('#forecast-data').html(HTML);

    }



    //4 day forecast
    if (filterForecastQuery.forecastType == 3) {
        console.log(data.items[0].forecasts);
        //console.log(data.items[0].forecasts[0].date);
        for (let i = 0; i < data.items[0].forecasts.length; i++) {
            HTML += data.items[0].forecasts[i].date + ": " + data.items[0].forecasts[i].forecast + ", "
        }
        $('#forecast-data').html(HTML);

    }


}

function refreshPageData() {
    getForecastFromBackend(function (error, data) {
        if (error) {
            return alert(error);
        }

        populatePage(data)//send data from API
    });
}


function filterForecast(event) {
    //console.log(event);
    //this refers to the target/ the form
    $("#filter-forecast-form input").not(":input[type=submit]").each((idx, input) => {
        filterForecastQuery[$(input).attr('key')] = $(input).val();//get key and value of input
        filterForecastQuery["forecastType"] = $("#select-forecast-type option:selected").val();
        console.log(filterForecastQuery);

    });//get all the inputs but not those that are submit
    //return false; //return false so that the form wont submit when the submit button is pressed

    refreshPageData();
    return false;
}


function registerForecastFilterForm() {
    $('#filter-forecast-form').submit(filterForecast);//listen for the submit action of the form
}


$(document).ready(function () {//run the moement the document/page is fully loaded
    registerForecastFilterForm();
});