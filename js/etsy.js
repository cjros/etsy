;
(function() {

    function Etsy() {
        var self = this;
        //backbone routing
        var etsyRouter = Backbone.Router.extend({
            routes: {

                ":listing_id": "getListingDetails",
                "search/:tags": "startSearch"
            },
            getListingDetails: function(listing_id) {
                self.showDetailedView(listing_id);
                document.querySelector(".detailer").style.opacity = "1";
            },
            startSearch: function(tags) {
                // document.querySelector(".actives").style.opacity = "0";
                self.showResults(tags);
                document.querySelector(".detailer").style.opacity= "0";
            },
            initialize: function() {
                Backbone.history.start();
            }
        })
        var router = new etsyRouter();

        this.showFeatured();
        //.on() for submit?
        $("#form").on("submit", function(e) {
            event.preventDefault();
            var look = this.querySelector("input").value;
            window.location.hash = '#/search/' + look;
        })

    };

    Etsy.prototype = {
        //learn to fucking write promises...
        //page loading like dial-up connection
        getFeaturedData: function() {
            return $.getJSON("https://openapi.etsy.com/v2/featured_treasuries/listings.js?includes=Images:1&callback=?&api_key=v8b5h6fqelovdop2ja8usrgm")
                .then(function(d, s, p) {
                    return d.results;
                    // var info = listings['results'].map(function(l) { return l });
                    // return info;
                });
        },
        getDetailedData: function(listing_id) {
            return $.getJSON("https://openapi.etsy.com/v2/listings/" + listing_id + ".js?includes=Images:1&callback=?&api_key=v8b5h6fqelovdop2ja8usrgm")
                .then(function(d, s, p) {
                    return d.results;
                });
        },
        dataSearchListings: function(tags) {
            return $.getJSON("https://openapi.etsy.com/v2/listings/active.js?keywords=" + tags + "&includes=Images:1&callback=?&api_key=v8b5h6fqelovdop2ja8usrgm")
                .then(function(d, s, p) {
                    console.log(arguments);
                    return d.results;
                });
        },
        loadTemplate: function(file) {
            return $.get("./templates/" + file + ".html").then(function(d, s, p) {
                return d;
            })
        },
        showFeatured: function() {
            $.when(
                this.loadTemplate("items"),
                this.getFeaturedData()
            ).then(function(html, feature) {
                var temp = _.template(html);
                var main = document.querySelector(".actives");
                // debugger;
                main.innerHTML = temp({
                    feature: feature
                });
            })
        },
        showDetailedView: function(listing_id) {
            $.when(
                this.loadTemplate("details"),
                this.getDetailedData(listing_id)
            ).then(function(html, detail_info) {
                var temp2 = _.template(html);
                var deets = document.querySelector(".detailer");
                deets.innerHTML = temp2({
                    detail_info: detail_info[0]
                });
            })
        },
        showResults: function(tags) {
            $.when(
                this.loadTemplate("results"),
                this.dataSearchListings(tags)
            ).then(function(html, searches) {
                var temp3 = _.template(html);
                var results = document.querySelector(".results");
                results.innerHTML = temp3( {searches: searches, tags: tags} ); //in template, probably need to create loop to go through array of keywords
            	console.log( {searches: searches});
            })
        }
    }

    window.Etsy = Etsy;
})();
