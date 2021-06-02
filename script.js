L.mapbox.accessToken = 'pk.eyJ1IjoiaWtrb2IiLCJhIjoiY2twMmY3b3prMWpvYjJvbXczdzk0OHF1ZSJ9.6j0RtV05VwqttLIR0RfWJg';
var map = L.mapbox.map('map')
    .setView([39, -100], 10)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

var getDataJson = async function () {
    const url = 'https://raw.githubusercontent.com/lulumalik/choropleth/master/public/us.json';
    const res = await fetch(url);
    const data = await res.json();
    // console.log(data);

    L.geoJson(data, {
        style: getStyle,
        onEachFeature: onEachFeature
    }).addTo(map);

}

getDataJson();

function getStyle(feature) {
    return {
        weight: 2,
        opacity: 0.2,
        color: 'black',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.density)
    };
}

// dens for density
function getColor(dens) {
    return dens > 1000 ? '#782618' :
        dens > 500 ? '#9a311f' :
            dens > 200 ? '#be3d26' :
                dens > 100 ? '#e2492d' :
                    dens > 50 ? '#ff5533' :
                        dens > 20 ? '#ff8a75' :
                            dens > 10 ? '#ffad9f' :
                                '#ffcec5';
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: openDetail,
        mouseout: removeMark
    });
}


function openDetail(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        opacity: 0.3,
        //         fillOpacity: 0.9
    });


    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

//remove mark style
function removeMark(e) {
    let lay = e.target;

    lay.setStyle({
        weight: 2,
        opacity: 0.2,
        color: 'black',
        fillOpacity: 0.7
    });

    info.update();
}


// custom card detail 
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// update control properties
info.update = function (property) {
    this._div.innerHTML = '<h4>US Population Density</h4>' + (property ?
        '<b>' + property.name + '</b><br />' + property.density + ' people / mi<sup>2</sup>'
        : '');
};

info.addTo(map);



//Layer Control
// L.control.layers({
//     'Streets': L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11').addTo(map),
//     'Light': L.mapbox.styleLayer('mapbox://styles/mapbox/light-v10'),
//     'Outdoors': L.mapbox.styleLayer('mapbox://styles/mapbox/outdoors-v11')
// }).addTo(map);




