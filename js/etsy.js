//easy mode bugs and to-do
//--create promises to help cache info and not make site...
//..load like you have a freaking 56k AOL connection


//hard mode bugs and to-do
//--get rid of errors when previous/forward buttons
//clicking out of array; throws #NaN
//--add onkeypress(down)?


//////////////////////////
//--UNIFY YOUR DAMN CODE! SHIT IS ON OVERLOAD; 
//TOO REPETITIVE; FIGURE OUT PATTERNS
////////////////////////

;
(function() {
    function Etsy() {
        this.filteredFeature = [];
        this.filteredSearch = [];

        this.featureArr = [];
        this.searchArr = [];
        this.saveTagsforButton = []; //split("+") if tag has spaces
        var self = this;

        var etsyRouter = Backbone.Router.extend({
            routes: {
                "": "home",
                ":listing_id": "getListingDetails",
                "search/:tags": "startSearch"
            },
            home: function() {    
                document.querySelector(".detailer").style.visibility = "hidden";
                document.querySelector(".actives").style.opacity = "1";
                document.querySelector(".actives").style.pointerEvents = "auto";
                self.showFeatured();
            },
            getListingDetails: function(listing_id) {
                document.querySelector(".detailer").style.visibility = "visible";
                document.querySelector(".actives").style.opacity = ".2";
                document.querySelector(".actives").style.pointerEvents = "none";
                self.showDetailedView(listing_id);
            
            	self.changeDetailPage(listing_id);
            },
            startSearch: function(tags) {
                document.querySelector(".detailer").style.visibility= "hidden";
                document.querySelector(".actives").style.opacity = "1";
                document.querySelector(".actives").style.pointerEvents = "auto";
                self.showResults(tags);
            },
            initialize: function() {
                Backbone.history.start();
            }
        })
        var router = new etsyRouter();

        //for search box
        $("#form").on("submit", function(event) {
            event.preventDefault();
            var look = this.querySelector("input").value;
            var nospace = look.split(" ").join("+");
            window.location.hash = 'search/' + nospace;
        })
        
        //nightmare test FILTER
        //for items with more than three picture
        //use .trigger to enable and disable?
        $("#filter").on("change", "input[type='checkbox'][class='threePics']", function() {
            //if checkbox is checked:::
            if(this.checked) {
                if(self.searchArr.length > 0) {
                   var testing = self.filteredSearch.map(function (val, index, array) {
                    // console.log(arguments);
                    // debugger;
                        if (val.Images.length >= 3) {
                            return val;
                        } else {
                            return null;
                        }
                    })
                   // testing.forEach(function(val, index, array) {
                   //  if (val !== null) {
                   //      var check = [].push(val);
                   //  }
                   // })
                   console.log(testing);
                   // console.log(check);
                } 
            } else {
                console.log("bye");
            }
        })
    };

    Etsy.prototype = {

        getFeaturedData: function() {
        	var self = this;
            return $.getJSON("https://openapi.etsy.com/v2/featured_treasuries/listings.js?includes=Images&callback=?&api_key=v8b5h6fqelovdop2ja8usrgm")
                .then(function(d, s, p) {
                    //should probably put the .on() here so i can
                    //replace d.results with the new filtered array
                    self.filteredFeature = d.results.map(function(a) { return a });
                    // console.log(self.filteredFeature);
                	self.featureArr = d.results.map(function(a) { return a['listing_id'] });
                    return d.results;
                });
        },
        getDetailedData: function(listing_id) {
            return $.getJSON("https://openapi.etsy.com/v2/listings/" + listing_id + ".js?includes=Images&callback=?&api_key=v8b5h6fqelovdop2ja8usrgm")
                .then(function(d, s, p) {
                    return d.results;
                });
        },
        dataSearchListings: function(tags) {
        	var self = this;
            self.saveTagsforButton = tags.split("+");
            return $.getJSON("https://openapi.etsy.com/v2/listings/active.js?keywords=" + tags + "&includes=Images&callback=?&api_key=v8b5h6fqelovdop2ja8usrgm")
                .then(function(d, s, p) {
                    self.filteredSearch = d.results.map(function(a) { return a });
                    console.log(self.filteredSearch);
                	self.searchArr = d.results.map(function(a) { return a['listing_id'] });
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
                // debugger;
                // console.log(feature);
                var temp = _.template(html);
                var main = document.querySelector(".actives");
                main.innerHTML = temp( {feature: feature} );
            })
        },
        showDetailedView: function(listing_id) {
            var self = this;
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
                if (self.searchArr.length > 0) {
                    window.location.hash = "search/" + self.saveTagsforButton.join("+");
                } else {
                    window.location.hash = "";
                }
            })
        },
        showResults: function(tags) {
            $.when(
                this.loadTemplate("results"),
                this.dataSearchListings(tags)
            ).then(function(html, searches) {
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
