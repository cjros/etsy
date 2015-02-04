//easy mode bugs and to-do
//--be able to click out of detailed view
//--create promises to help cache info and not make site...
//..load like you have a freaking 56k AOL connection


//hard mode bugs and to-do
//--get rid of errors when button clicking out of array; throws #NaN
//--UNIFY YOUR DAMN CODE! shit is on overload; too repetitive; figure out patterns


;
(function() {
    function Etsy() {
        this.featureArr = [];
        this.searchArr = [];
        var self = this;

        var etsyRouter = Backbone.Router.extend({
            routes: {
                "": "home",
                ":listing_id": "getListingDetails",
                "search/:tags": "startSearch"
            },
            home: function() {
                self.showFeatured();
                document.querySelector(".detailer").style.opacity = "0";

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

        //this.showFeatured();
        
        //used for the search box
        $("#form").on("submit", function(event) {
            event.preventDefault();
            var look = this.querySelector("input").value;
            var nospace = look.split(" ").join("+");
            console.log(nospace);
            window.location.hash = 'search/' + nospace;
        })
    };

    Etsy.prototype = {

        getFeaturedData: function() {
        	var self = this;
            return $.getJSON("https://openapi.etsy.com/v2/featured_treasuries/listings.js?includes=Images:1&callback=?&api_key=v8b5h6fqelovdop2ja8usrgm")
                .then(function(d, s, p) {
                	self.featureArr = d.results.map(function(a) { return a['listing_id'] });
                	// console.log(self.featureArr);
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
        	var self = this;
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
            $(".detailer").delegate("#quit", "click", function(event) {
            	event.preventDefault();
            	window.location.hash = "";
            })
        },
        showResults: function(tags) {
            $.when(
                this.loadTemplate("results"),
                this.dataSearchListings(tags)
            ).then(function(html, searches) {
            	// console.log(arguments);
            	if (searches.length <= 0) {
            		return alert("No results, please try again");
            	}
                var temp3 = _.template(html);
                var results = document.querySelector(".results");
                results.innerHTML = temp3( {searches: searches} );
            })
        },
        changeDetailPage: function(listing_id) {
        	var self = this;
        	//goBack BUTTON
	        $(".detailer").delegate("#goBack", "click", function(event) {
		    	event.preventDefault();
		    	if (self.searchArr.length > 0){
		    		self.searchArr.forEach(function(val, index, array) {
			    		if(val.toString() === listing_id) {
			    			window.location.hash = "#" + parseInt(array[index - 1]);
			    		}
		    		})
		    	} else {
			    	self.featureArr.forEach(function(val, index, array) {
			    		if(val.toString() === listing_id) {
			    			window.location.hash = "#" + parseInt(array[index - 1]);
			    		}
			    	})
			    }
	    	});
	        //goNext BUTTON
	    	$(".detailer").delegate("#goNext", "click", function(event) {
		    	event.preventDefault();
		    	if (self.searchArr.length > 0){
		    		self.searchArr.forEach(function(val, index, array) {
			    		if(val.toString() === listing_id) {
			    			window.location.hash = "#" + parseInt(array[index + 1]);
			    		}
		    		})
		    	} else {
			    	self.featureArr.forEach(function(val, index, array) {
			    		if(val.toString() === listing_id) {
			    			window.location.hash = "#" + parseInt(array[index + 1]);
			    		}
			    	})
			    }
	    	});
        }
    }

    window.Etsy = Etsy;
})();
