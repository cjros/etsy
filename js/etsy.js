;(function() {

	function Etsy() {
		var self = this;
		//backbone routing
		var etsyRouter = Backbone.Router.extend({
            routes: {
                ":listing_id": "getListingDetails",
                '?keywords=:keywords': "search" 

            },
            getListingDetails: function(listing_id) {
                self.showDetailedView(listing_id);
                document.querySelector(".detailer").style.opacity= "1";
            },
            search: function(keywords) {
            	$(document).ready(function() {
	            	$("#form").on('submit', function(event) {
	            		event.preventDefault();
	            	})
	            })
            	//self.startSearch(keywords);
            },
            initialize: function(){
                Backbone.history.start();
            }
        })
        var router = new etsyRouter();

		this.showFeatured();
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
		dataSearchListings: function(keywords) {
			return $.getJSON("https://openapi.etsy.com/v2/listings/active.js?keywords=" + keywords + "&includes=Images:1&api_key=v8b5h6fqelovdop2ja8usrgm")
			.then(function(d, s, p) {
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
					main.innerHTML = temp( {feature: feature} );
				})
		},
		showDetailedView: function(listing_id) {
			$.when(
				this.loadTemplate("details"),
				this.getDetailedData(listing_id)
				).then(function(html, detail_info) {
					console.log(arguments);
					var temp2 = _.template(html);
					var deets = document.querySelector(".detailer");
					deets.innerHTML = temp2( {detail_info: detail_info[0]} );
				})
		},
		startSearch: function(keywords) {
			$.when(
				this.loadTemplate("items"),
				this.dataSearchListings(keywords)
				).then(function(html, searches) {
					var temp3 = _.template(html);
					var results = document.querySelector(".results");
					results.innerHTML = temp3( {searches: searches} );
				})
			// var search = [];
			// var terms = search.push(document.querySelector("form").value);
			//on.click
			//put keywords in array then .join(" ")
			//feed through here
			//look for a match in /listing/ through key: "keywords"
			//display through innerHTML
			
		}
	}

	window.Etsy = Etsy;
})();