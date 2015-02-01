;(function() {

	function Etsy() {
		var self = this;

		this.showFeatured();
	};

	Etsy.prototype = {

		getFeaturedData: function() {
			return $.getJSON("https://openapi.etsy.com/v2/featured_treasuries/listings.js?includes=Images:1&callback=?&api_key=v8b5h6fqelovdop2ja8usrgm")
			.then(function(d, s, p) {
				return d.results;
				// var info = listings['results'].map(function(l) { return l });
				// return info;
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
		}
	}

	window.Etsy = Etsy;
})();