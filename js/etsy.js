;(function() {

	function Etsy() {
		var self = this;

		this.showFeatured();

	};

	Etsy.prototype = {

		getFeaturedData: function(listing_id) {
			var self = this;
			//should use promise once data outputs correctly
			//create a forEach loop that takes 12 listings and puts them all
			//on the front page
			var featured = $.getJSON("https://openapi.etsy.com/v2/featured_treasuries/listings.js?api_key=v8b5h6fqelovdop2ja8usrgm&callback=flistings");
			featured.then(function(flistings) {
				// debugger;
				results.map(function(key) {
					return key;
				})
			})
		},
		loadTemplate: function(file) {
			return $.getJSON("./templates/" + file + ".html").then(function(data) {
				return data;
			})
		},
		showFeatured: function() {
			$.when(
				this.getFeaturedData(),
				this.loadTemplate("items")
				).then(function(listing, html) {
					var main = document.querySelector(".actives");
					main.innerHTML = _.template(html, { listing : listing });
				})
		}
	};
	window.Etsy = Etsy;
})();