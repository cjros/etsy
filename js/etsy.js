//fixes needed
//-be able to click out of detailed view
//-create promises to help cache info and not make site
//...load like you have a freaking 56k AOL premium connection

//hard mode
//store ids in an array
//create on.button changes to move to next of the array

;
(function() {
    function Etsy() {
        var self = this;
        this.featureArr = [];
        this.searchArr = [];

        var etsyRouter = Backbone.Router.extend({
            routes: {
                ":listing_id": "getListingDetails",
                "search/:tags": "startSearch"
            },
            getListingDetails: function(listing_id) {
                self.showDetailedView(listing_id);
                document.querySelector(".detailer").style.opacity = "1";
            
            	self.changeDetailPage(listing_id);
            },
            startSearch: function(tags) {
                self.showResults(tags);
                document.querySelector(".detailer").style.opacity= "0";
            },
            initialize: function() {
                Backbone.history.start();
            }
        })
        var router = new etsyRouter();

        this.showFeatured();
        
        //used for the search box
        $("#form").on("submit", function(event) {
            event.preventDefault();
            var look = this.querySelector("input").value;
            var nospace = look.split(" ").join("+");
            window.location.hash = '#/search/' + nospace;
        })
    };

    Etsy.prototype = {

        getFeaturedData: function() {
            return $.getJSON("https://openapi.etsy.com/v2/featured_treasuries/listings.js?includes=Images:1&callback=?&api_key=v8b5h6fqelovdop2ja8usrgm")
                .then(function(d, s, p) {
                	
                	self.featureArr = d.results.map(function(a) { return a['listing_id'] });
                	console.log(self.featureArr);
                    return d.results;
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

                	self.searchArr = d.results.map(function(a) { return a['listing_id'] });
                	console.log(self.searchArr);
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
                main.innerHTML = temp( {feature: feature} );
            })
        },
        showDetailedView: function(listing_id) {
            $.when(
                this.loadTemplate("details"),
                this.getDetailedData(listing_id)
            ).then(function(html, detail_info) {
                var temp2 = _.template(html);
                var deets = document.querySelector(".detailer");
                deets.innerHTML = temp2( {detail_info: detail_info[0]} );
            })
        },
        showResults: function(tags) {
            $.when(
                this.loadTemplate("results"),
                this.dataSearchListings(tags)
            ).then(function(html, searches) {
            	console.log(arguments);
            	if (searches.length <= 0) {
            		return alert("No results, please try again");
            	}
                var temp3 = _.template(html);
                var results = document.querySelector(".results");
                results.innerHTML = temp3( {searches: searches} );
            })
        },
        changeDetailPage: function(listing_id) {
        	// debugger;
        	var self = this;
        	//testing backbutton on detailed view
	        $(".detailer").delegate("#goBack", "click", function(event) {
		    	event.preventDefault();
		    	//how to grab info from a sibling
		    	console.log("hi");


		    	for (var i = 0; i < self.featureArr.length; i++) {
		    		if (listing_id === self.featureArr[i]) {
		    			listing_id = self.featureArr[i - 1];
		    			console.log(listing_id);
		    			return window.location.hash = "#" + listing_id
		    		}
		    	}
		    	//this needs to be in the a loop for arrays of listing_ids
				// !!!!!window.location.hash = "#" + listing_id;
				//connect listing_id from backbone to link to here and the array
				//grab current id to know where to start
				//use array from results or featured items to cycle through
				// if listing_id matches one in array, counter++ then
				//go move to the array index before it.
	    	});
        }
    }

    window.Etsy = Etsy;
})();
