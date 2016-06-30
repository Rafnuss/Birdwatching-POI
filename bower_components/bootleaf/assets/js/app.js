
// Declaration of Variable
var $=jQuery;
var map, featureList, hotspotSearch=[], pathSearch=[], viewpointSearch=[], parkingSearch=[];

MapboxToken = 'pk.eyJ1IjoicmFmbnVzcyIsImEiOiIzMVE1dnc0In0.3FNMKIlQ_afYktqki-6m0g';

// Link
var root = 'http://zoziologie.raphaelnussbaumer.com/birdwatching-poi/';
var icon={};
icon.parking = 'car';
icon.viewpoint= "binocular";



// Wait for the page to load
jQuery(document).ready(function(){

    $(window).resize(function() {
        sizeLayerControl();
    });

    $(document).on("click", ".feature-row", function(e) {
        $(document).off("mouseout", ".feature-row", clearHighlight);
        sidebarClick(parseInt($(this).attr("id"), 10));
    });

    if ( !("ontouchstart" in window) ) {
        $(document).on("mouseover", ".feature-row", function(e) {
            highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
        });
    }

    $(document).on("mouseout", ".feature-row", clearHighlight);

    $("#about-btn").click(function() {
        $("#aboutModal").modal("show");
        $(".navbar-collapse.in").collapse("hide");
        return false;
    });

    $("#full-extent-btn").click(function() {
        map.fitBounds(hotspot.getBounds());
        $(".navbar-collapse.in").collapse("hide");
        return false;
    });

    $("#legend-btn").click(function() {
        $("#legendModal").modal("show");
        $(".navbar-collapse.in").collapse("hide");
        return false;
    });

    $("#login-btn").click(function() {
        $("#loginModal").modal("show");
        $(".navbar-collapse.in").collapse("hide");
        return false;
    });

    $("#list-btn").click(function() {
        animateSidebar();
        return false;
    });

    $("#nav-btn").click(function() {
        $(".navbar-collapse").collapse("toggle");
        return false;
    });

    $("#sidebar-toggle-btn").click(function() {
        animateSidebar();
        return false;
    });

    $("#sidebar-hide-btn").click(function() {
        animateSidebar();
        return false;
    });


    /*Declaration of function*/
    function animateSidebar() {
        $("#sidebar").animate({
            width: "toggle"
        }, 350, function() {
            map.invalidateSize();
        });
    }

    function sizeLayerControl() {
        $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
    }i

    function clearHighlight() {
        highlight.clearLayers();
    }

    function sidebarClick(id) {
        var layer = markerClusters.getLayer(id);
        map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
        layer.fire("click");
        /* Hide sidebar and go to the map on small screens */
        if (document.body.clientWidth <= 767) {
            $("#sidebar").hide();
            map.invalidateSize();
        }
    }

    function syncSidebar() {
        /* Empty sidebar features */
        $("#feature-list tbody").empty();

        /* Loop through layers and add only features which are in the map bounds */
        /*hotspots.eachLayer(function (layer) {
            if (map.hasLayer(hotspotLayer)) {
                if (map.getBounds().contains(layer.getLatLng())) {
                    $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src=' + 'icon' + '></td><td class="feature-name">' + 'parking' + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                }
            }
        });

        paths.eachLayer(function (layer) {
            if (map.hasLayer(pathLayer)) {
                if (map.getBounds().contains(layer.getLatLng())) {
                    $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src=' + 'icon' + '></td><td class="feature-name">' + 'parking' + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                }
            }
        });
*/
        viewpoints.eachLayer(function (layer) {
            if (map.hasLayer(viewpointLayer)) {
                if (map.getBounds().contains(layer.getLatLng())) {
                    $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-' + icon.viewpoint + 'fa-lg"></i></td><td class="feature-name">' + 'Viewpoint ('layer.feature.properties.type  + ')</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                }
            }
        });

        parkings.eachLayer(function (layer) {
            if (map.hasLayer(parkingLayer)) {
                if (map.getBounds().contains(layer.getLatLng())) {
                    $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-' + icon.parking + 'fa-lg"></i></td><td class="feature-name">' + 'Parking (' + layer.feature.properties.id ')</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                }
            }
        });

        /* Update list.js featureList */
        featureList = new List("features", {
            valueNames: ["feature-name"]
        });
        featureList.sort("feature-name", {
            order: "asc"
        });
    }
















    /*MAP DEFINITION*/
    /* Basemap Layers */
    var mapquestOSM = L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
        maxZoom: 19,
        subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"],
        attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="https://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
    });
    var mapquestOAM = L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
        maxZoom: 18,
        subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"],
        attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
    });
    var mapquestHYB = L.layerGroup([L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
        maxZoom: 18,
        subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"]
    }), L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
        maxZoom: 19,
    subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"],
    attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="https://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
    })]);

    /* Overlay Layers */
    var highlight = L.geoJson(null);
    var highlightStyle = {
        stroke: false,
        fillColor: "#00FFFF",
        fillOpacity: 0.7,
        radius: 10
    };







    /* IMPORT STUFF*/

    /*Hotspot*/
    var hotspots = L.geoJson(null, {
        style: function (feature) {
            return {
                color: "black",
        fill: false,
        opacity: 1,
        clickable: false
            };
        },
        onEachFeature: function (feature, layer) {
            hotspotSearch.push({
                name: 'hotspot',
            source: "Hotspots",
            id: L.stamp(layer),
            bounds: layer.getBounds()
            });
        }
    });
    $.getJSON("http://zoziologie.raphaelnussbaumer.com/wp-content/plugins/Birdwatching-POI/hotspot.geojson", function (data) {
        hotspots.addData(data);
    });


    // IMPORT PATHS
    var subwayColors = {"1":"#ff3135", "2":"#ff3135", "3":"ff3135", "4":"#009b2e",
        "5":"#009b2e", "6":"#009b2e", "7":"#ce06cb", "A":"#fd9a00", "C":"#fd9a00",
        "E":"#fd9a00", "SI":"#fd9a00","H":"#fd9a00", "Air":"#ffff00", "B":"#ffff00",
        "D":"#ffff00", "F":"#ffff00", "M":"#ffff00", "G":"#9ace00", "FS":"#6e6e6e",
        "GS":"#6e6e6e", "J":"#976900", "Z":"#976900", "L":"#969696", "N":"#ffff00",
        "Q":"#ffff00", "R":"#ffff00" };

    var paths = L.geoJson(null, {
        style: function (feature) {
            return {
                color: '#ffff00',
        weight: 3,
        opacity: 1
            };
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + "</td></tr>" + "<tr><th>Line</th><td>" + "</td></tr>" + "<table>";
                layer.on({
                    click: function (e) {
                        $("#feature-title").html('path');
                        $("#feature-info").html(content);
                        $("#featureModal").modal("show");

                    }
                });
            }
            layer.on({
                mouseover: function (e) {
                    var layer = e.target;
                    layer.setStyle({
                        weight: 3,
                        color: "#00FFFF",
                        opacity: 1
                    });
                    if (!L.Browser.ie && !L.Browser.opera) {
                        layer.bringToFront();
                    }
                },
            mouseout: function (e) {
                paths.resetStyle(e.target);
            }
            });
        }
    });
    $.getJSON("http://zoziologie.raphaelnussbaumer.com/wp-content/plugins/Birdwatching-POI/path.geojson", function (data) {
        paths.addData(data);
    });



    /* Single marker cluster layer to hold all clusters */
    var markerClusters = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 16
    });

    /* VIEWPOINT: Empty layer placeholder to add to layer control for listening when to add/remove viewpoints to markerClusters layer */
    var viewpointLayer = L.geoJson(null);
    var viewpoints = L.geoJson(null, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.AwesomeMarkers.icon({
                    icon: icon.viewpoint,
                }),
                    title: 'viewpoint',//feature.properties.NAME,
                   riseOnHover: true
            });
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + 'Parking' + "</td></tr>" + "<tr><th>Number of place</th><td>" + "</td></tr>" + "<tr><th>Address</th><td>" + '?' + "</td></tr>" + "<tr><th>Descrtiption</th><td>" + "</td></tr>" + "<table>";
                layer.on({
                    click: function (e) {
                        $("#feature-title").html('viewpoints');
                        $("#feature-info").html(content);
                        $("#featureModal").modal("show");
                        highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
                    }
                });
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-' + icon.viewpoint + 'fa-lg"></i></td><td class="feature-name">' +  + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                viewpointSearch.push({
                    name: 'viewpoint',
                    address: '',
                    source: "Viewpoint",
                    id: L.stamp(layer),
                    lat: layer.feature.geometry.coordinates[1],
                    lng: layer.feature.geometry.coordinates[0]
                });
            }
        }
    });
    $.getJSON("http://zoziologie.raphaelnussbaumer.com/wp-content/plugins/Birdwatching-POI/viewpoint.geojson", function (data) {
        parkings.addData(data);
        map.addLayer(viewpointLayer);
    })

    /* PARKING Empty layer placeholder to add to layer control for listening when to add/remove parkings to markerClusters layer */
    var parkingLayer = L.geoJson(null);
    var parkings = L.geoJson(null, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.AwesomeMarkers.icon({
                    icon: icon.parking,
                }),
                    title: 'Parking',//feature.properties.NAME,
                   riseOnHover: true
            });
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + 'Parking' + "</td></tr>" + "<tr><th>Number of place</th><td>" + feature.properties['nb-place'] + "</td></tr>" + "<tr><th>Address</th><td>" + '?' + "</td></tr>" + "<tr><th>Descrtiption</th><td>" + feature.properties.description + "</td></tr>" + "<table>";
                layer.on({
                    click: function (e) {
                        $("#feature-title").html('Parking');
                        $("#feature-info").html(content);
                        $("#featureModal").modal("show");
                        highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
                    }
                });
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-' + icon.parking + 'fa-lg"></i></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                parkingSearch.push({
                    name: 'Parking',
                    address: '?',
                    source: "Parking",
                    id: L.stamp(layer),
                    lat: layer.feature.geometry.coordinates[1],
                    lng: layer.feature.geometry.coordinates[0]
                });
            }
        }
    });
    $.getJSON("http://zoziologie.raphaelnussbaumer.com/wp-content/plugins/Birdwatching-POI/parking.geojson", function (data) {
        parkings.addData(data);
        map.addLayer(parkingLayer);
    })




    map = L.map("map", {
        layers: [mapquestOSM, markerClusters, highlight],
        zoomControl: false,
        attributionControl: false
    }).fitBounds([[48, 6],[46, 10]]);

    /* Layer control listeners that allow for a single markerClusters layer */
    map.on("overlayadd", function(e) {
       
        if (e.layer === viewpointLayer) {
            markerClusters.addLayer(viewpoints);
            syncSidebar();
        }
        if (e.layer === parkingLayer) {
            markerClusters.addLayer(parkings);
            syncSidebar();
        }

    });

    map.on("overlayremove", function(e) {
        if (e.layer === viewpointLayer) {
            markerClusters.removeLayer(viewpoints);
            syncSidebar();
        }

        if (e.layer === parkingLayer) {
            markerClusters.removeLayer(parkings);
            syncSidebar();
        }

    });
    /* Filter sidebar feature list to only show features in current map bounds */
    map.on("moveend", function (e) {
        syncSidebar();
    });

    /* Clear feature highlight when map is clicked */
    map.on("click", function(e) {
        highlight.clearLayers();
    });

    /* Attribution control */
    function updateAttribution(e) {
        $.each(map._layers, function(index, layer) {
            if (layer.getAttribution) {
                $("#attribution").html((layer.getAttribution()));
            }
        });
    }
    map.on("layeradd", updateAttribution);
    map.on("layerremove", updateAttribution);

    var attributionControl = L.control({
        position: "bottomright"
    });
    attributionControl.onAdd = function (map) {
        var div = L.DomUtil.create("div", "leaflet-control-attribution");
        div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
        return div;
    };
    map.addControl(attributionControl);

    var zoomControl = L.control.zoom({
        position: "bottomright"
    }).addTo(map);

    /* GPS enabled geolocation control set to follow the user's location */
    var locateControl = L.control.locate({
        position: "bottomright",
        drawCircle: true,
        follow: true,
        setView: true,
        keepCurrentZoomLevel: true,
        markerStyle: {
            weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8
        },
        circleStyle: {
            weight: 1,
        clickable: false
        },
        icon: "fa fa-location-arrow",
        metric: false,
        strings: {
            title: "My location",
        popup: "You are within {distance} {unit} from this point",
        outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
        },
        locateOptions: {
            maxZoom: 18,
            watch: true,
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 10000
        }
    }).addTo(map);

    /* Larger screens get expanded layer control and visible sidebar */
    if (document.body.clientWidth <= 767) {
        var isCollapsed = true;
    } else {
        var isCollapsed = false;
    }

    var baseLayers = {
        "Street Map": mapquestOSM,
        "Aerial Imagery": mapquestOAM,
        "Imagery with Streets": mapquestHYB
    };

    var groupedOverlays = {
        "Points of Interest": {
            ["<img src=" + 'icon'  + " width='24' height='28'>&nbsp;Parkings"]: parkingLayer
        },
        "Reference": {
        }
    };

    var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
        collapsed: isCollapsed
    }).addTo(map);

    /* Highlight search box text on click */
    //$("#searchbox").click(function () {
    //    $(this).select();
    //});

    /* Prevent hitting enter from refreshing the page */
    //$("#searchbox").keypress(function (e) {
    //    if (e.which == 13) {
    //        e.preventDefault();
    //    }
    //});

    $("#featureModal").on("hidden.bs.modal", function (e) {
        $(document).on("mouseout", ".feature-row", clearHighlight);
    });

    /* Typeahead search functionality */
    $(document).one("ajaxStop", function () {
        $("#loading").hide();
        sizeLayerControl();
        featureList = new List("features", {valueNames: ["feature-name"]});
        featureList.sort("feature-name", {order:"asc"});


        var viewpointsBH = new Bloodhound({
            name: "Viewpoints",
            datumTokenizer: function (d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: viewpointSearch,
            limit: 10
        });

        var parkingsBH = new Bloodhound({
            name: "Parking",
            datumTokenizer: function (d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: parkingSearch,
            limit: 10
        });

        var geonamesBH = new Bloodhound({
            name: "GeoNames",
            datumTokenizer: function (d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
            filter: function (data) {
                return $.map(data.geonames, function (result) {
                    return {
                        name: result.name + ", " + result.adminCode1,
                lat: result.lat,
                lng: result.lng,
                source: "GeoNames"
                    };
                });
            },
            ajax: {
                beforeSend: function (jqXhr, settings) {
                    settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
                    $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
                },
                complete: function (jqXHR, status) {
                    $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
                }
            }
            },
            limit: 10
        });
        parkingsBH.initialize();
        geonamesBH.initialize();

        /* instantiate the typeahead UI */
        $("#searchbox").typeahead({
            //minLength: 3,
            //highlight: true,
            //hint: false
        }, {
            name: "Viewpoints",
            displayKey: "name",
            source: viewpointsBH.ttAdapter(),
            templates: {
                header: "<h4 class='typeahead-header'><i class='fa fa-" + icon.viewpoint + "fa-lg'></i>&nbsp;Viewpoints</h4>",
            suggestion: Handlebars.compile("<div>{{name}}<br>&nbsp;<small>{{address}}</small></div>")
            }
        }, {
            name: "Parkings",
            displayKey: "name",
            source: parkingsBH.ttAdapter(),
            templates: {
                header: "<h4 class='typeahead-header'><i class='fa fa-" + icon.parking + "fa-lg'></i>&nbsp;Parkings</h4>",
            suggestion: Handlebars.compile("<div>{{name}}<br>&nbsp;<small>{{address}}</small></div>")
            }
        }, {
            name: "GeoNames",
            displayKey: "name",
            source: geonamesBH.ttAdapter(),
            templates: {
                header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
            }
        }).on("typeahead:selected", function (obj, datum) {
            if (datum.source === "Parkings") {
                if (!map.hasLayer(parkingLayer)) {
                    map.addLayer(parkingLayer);
                }
                map.setView([datum.lat, datum.lng], 17);
                if (map._layers[datum.id]) {
                    map._layers[datum.id].fire("click");
                }
            }
            if (datum.source === "GeoNames") {
                map.setView([datum.lat, datum.lng], 14);
            }
            if ($(".navbar-collapse").height() > 50) {
                $(".navbar-collapse").collapse("hide");
            }
        }).on("typeahead:opened", function () {
            $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
            $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
        }).on("typeahead:closed", function () {
            $(".navbar-collapse.in").css("max-height", "");
            $(".navbar-collapse.in").css("height", "");
        });
        $(".twitter-typeahead").css("position", "static");
        $(".twitter-typeahead").css("display", "block");
    });

    // Leaflet patch to make layer control scrollable on touch browsers
    var container = $(".leaflet-control-layers")[0];
    if (!L.Browser.touch) {
        L.DomEvent
            .disableClickPropagation(container)
            .disableScrollPropagation(container);
    } else {
        L.DomEvent.disableClickPropagation(container);
    }
});
