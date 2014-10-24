/** @scratch /panels/5
 * include::panels/heatmap.asciidoc[]
 */

/** @scratch /panels/heatmap/0
 * == heatmap diagram
 * Status: *Experimental*
 *
 * This panel creates a heatmap chart between the source and target fields.
 */

define([
  'angular',
  'app',
  'lodash',
  'jquery',
  'vendor/d3/d3.v3.js' 
  //'http://d3js.org/d3.v3.js'
],
 function (angular, app, _, $, d3) {
  'use strict';
  var module = angular.module('kibana.panels.heatmap', []);
  app.useModule(module);

  		  			  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });
  
  console.log('heatmap module loaded');
			console.log("after module refreshing");

			  module.directive('heatmap', function() {
    return {
      restrict: 'A',
      link: function(scope, elem) {
        console.log('link function called');

        elem.html('<center><img src="img/load_big.gif"></center>');

        scope.$on('refresh',function(){
			console.log("refreshing");
          scope.get_data();

        });
		

        // Receive render events
        scope.$on('render',function(){
          render_panel();
        });

        // Or if the window is resized
        angular.element(window).bind('resize', function(){
					console.log("refreshing");
          //scope.get_data();
		  //console.log("regetting data before render");
          //scope.render_panel();
        });

		
		function render_panel() {
		          elem.css({height:scope.panel.height||scope.row.height});
			elem.text('');
			  scope.panelMeta.loading = false;
			console.log("-----------------> render_panel data before render");
			
			var margin = { top: 50, right: 0, bottom: 100, left: 30 },

			
          
          buckets = 9,
          colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days=[],
		  
		  //days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
          times = ["1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12am", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm", "12pm"];
		
		   //var testData='[{"day":1,"hour":1,"value":16},{"day":1,"hour":2,"value":20},{"day":1,"hour":3,"value":0},{"day":1,"hour":4,"value":0},{"day":1,"hour":5,"value":0},{"day":1,"hour":6,"value":2},{"day":1,"hour":7,"value":0},{"day":1,"hour":8,"value":9},{"day":1,"hour":9,"value":25},{"day":1,"hour":10,"value":49},{"day":1,"hour":11,"value":57},{"day":1,"hour":12,"value":61},{"day":1,"hour":13,"value":37},{"day":1,"hour":14,"value":66},{"day":1,"hour":15,"value":70},{"day":1,"hour":16,"value":55},{"day":1,"hour":17,"value":51},{"day":1,"hour":18,"value":55},{"day":1,"hour":19,"value":17},{"day":1,"hour":20,"value":20},{"day":1,"hour":21,"value":9},{"day":1,"hour":22,"value":4},{"day":1,"hour":23,"value":0},{"day":1,"hour":24,"value":12},{"day":2,"hour":1,"value":6},{"day":2,"hour":2,"value":2},{"day":2,"hour":3,"value":0},{"day":2,"hour":4,"value":0},{"day":2,"hour":5,"value":0},{"day":2,"hour":6,"value":2},{"day":2,"hour":7,"value":4},{"day":2,"hour":8,"value":11},{"day":2,"hour":9,"value":28},{"day":2,"hour":10,"value":49},{"day":2,"hour":11,"value":51},{"day":2,"hour":12,"value":47},{"day":2,"hour":13,"value":38},{"day":2,"hour":14,"value":65},{"day":2,"hour":15,"value":60},{"day":2,"hour":16,"value":50},{"day":2,"hour":17,"value":65},{"day":2,"hour":18,"value":50},{"day":2,"hour":19,"value":22},{"day":2,"hour":20,"value":11},{"day":2,"hour":21,"value":12},{"day":2,"hour":22,"value":9},{"day":2,"hour":23,"value":0},{"day":2,"hour":24,"value":13},{"day":3,"hour":1,"value":5},{"day":3,"hour":2,"value":8},{"day":3,"hour":3,"value":8},{"day":3,"hour":4,"value":0},{"day":3,"hour":5,"value":0},{"day":3,"hour":6,"value":2},{"day":3,"hour":7,"value":5},{"day":3,"hour":8,"value":12},{"day":3,"hour":9,"value":34},{"day":3,"hour":10,"value":43},{"day":3,"hour":11,"value":54},{"day":3,"hour":12,"value":44},{"day":3,"hour":13,"value":40},{"day":3,"hour":14,"value":48},{"day":3,"hour":15,"value":54},{"day":3,"hour":16,"value":59},{"day":3,"hour":17,"value":60},{"day":3,"hour":18,"value":51},{"day":3,"hour":19,"value":21},{"day":3,"hour":20,"value":16},{"day":3,"hour":21,"value":9},{"day":3,"hour":22,"value":5},{"day":3,"hour":23,"value":4},{"day":3,"hour":24,"value":7},{"day":4,"hour":1,"value":0},{"day":4,"hour":2,"value":0},{"day":4,"hour":3,"value":0},{"day":4,"hour":4,"value":0},{"day":4,"hour":5,"value":0},{"day":4,"hour":6,"value":2},{"day":4,"hour":7,"value":4},{"day":4,"hour":8,"value":13},{"day":4,"hour":9,"value":26},{"day":4,"hour":10,"value":58},{"day":4,"hour":11,"value":61},{"day":4,"hour":12,"value":59},{"day":4,"hour":13,"value":53},{"day":4,"hour":14,"value":54},{"day":4,"hour":15,"value":64},{"day":4,"hour":16,"value":55},{"day":4,"hour":17,"value":52},{"day":4,"hour":18,"value":53},{"day":4,"hour":19,"value":18},{"day":4,"hour":20,"value":3},{"day":4,"hour":21,"value":9},{"day":4,"hour":22,"value":12},{"day":4,"hour":23,"value":2},{"day":4,"hour":24,"value":8},{"day":5,"hour":1,"value":2},{"day":5,"hour":2,"value":0},{"day":5,"hour":3,"value":8},{"day":5,"hour":4,"value":2},{"day":5,"hour":5,"value":0},{"day":5,"hour":6,"value":2},{"day":5,"hour":7,"value":4},{"day":5,"hour":8,"value":14},{"day":5,"hour":9,"value":31},{"day":5,"hour":10,"value":48},{"day":5,"hour":11,"value":46},{"day":5,"hour":12,"value":50},{"day":5,"hour":13,"value":66},{"day":5,"hour":14,"value":54},{"day":5,"hour":15,"value":56},{"day":5,"hour":16,"value":67},{"day":5,"hour":17,"value":54},{"day":5,"hour":18,"value":23},{"day":5,"hour":19,"value":14},{"day":5,"hour":20,"value":6},{"day":5,"hour":21,"value":8},{"day":5,"hour":22,"value":7},{"day":5,"hour":23,"value":0},{"day":5,"hour":24,"value":8},{"day":6,"hour":1,"value":2},{"day":6,"hour":2,"value":0},{"day":6,"hour":3,"value":2},{"day":6,"hour":4,"value":0},{"day":6,"hour":5,"value":0},{"day":6,"hour":6,"value":0},{"day":6,"hour":7,"value":4},{"day":6,"hour":8,"value":8},{"day":6,"hour":9,"value":8},{"day":6,"hour":10,"value":6},{"day":6,"hour":11,"value":14},{"day":6,"hour":12,"value":12},{"day":6,"hour":13,"value":9},{"day":6,"hour":14,"value":14},{"day":6,"hour":15,"value":0},{"day":6,"hour":16,"value":4},{"day":6,"hour":17,"value":7},{"day":6,"hour":18,"value":6},{"day":6,"hour":19,"value":0},{"day":6,"hour":20,"value":0},{"day":6,"hour":21,"value":0},{"day":6,"hour":22,"value":0},{"day":6,"hour":23,"value":0},{"day":6,"hour":24,"value":0},{"day":7,"hour":1,"value":7},{"day":7,"hour":2,"value":6},{"day":7,"hour":3,"value":0},{"day":7,"hour":4,"value":0},{"day":7,"hour":5,"value":0},{"day":7,"hour":6,"value":0},{"day":7,"hour":7,"value":0},{"day":7,"hour":8,"value":0},{"day":7,"hour":9,"value":0},{"day":7,"hour":10,"value":0},{"day":7,"hour":11,"value":2},{"day":7,"hour":12,"value":2},{"day":7,"hour":13,"value":5},{"day":7,"hour":14,"value":6},{"day":7,"hour":15,"value":0},{"day":7,"hour":16,"value":4},{"day":7,"hour":17,"value":0},{"day":7,"hour":18,"value":2},{"day":7,"hour":19,"value":10},{"day":7,"hour":20,"value":7},{"day":7,"hour":21,"value":0},{"day":7,"hour":22,"value":19},{"day":7,"hour":23,"value":9},{"day":7,"hour":24,"value":4}]';
		   //var testData=$scope.data.hits;

		   
		   //var json=JSON.parse(testData);
		   var json = scope.data.hits;
			var i,j;
			
			for(i=1;i<=scope.data.maxday;i++) days.push(i);
			
		   //for( i=8;i<=days.length;i++) 
			//for(j=1;j<=times.length;j++) 
				//json.push({ day: i, hour: j, value: Math.floor(Math.random()*40)});  

			
         	var  width = 960 - margin.left - margin.right,
          height = days.length*40,//* - margin.top - margin.bottom,
	
          gridSize = Math.floor(width / 24)	,
		  legendElementWidth = gridSize*2;
		
			function paint(data) {
          var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);
			  
			  
			var svg = d3.select(elem[0]).append("svg:svg")
			/*     .attr("width", width)
			.attr("height", height); */
			  
			/* var svg = d3.select("#chart").append("svg") */
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var dayLabels = svg.selectAll(".dayLabel")
              .data(days)
              .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                .attr("class", function (d, i) { return  "dayLabel mono axis axis-workweek"; });
				//.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

          var timeLabels = svg.selectAll(".timeLabel")
              .data(times)
              .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

          var heatMap = svg.selectAll(".hour")
              .data(data)
              .enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", colors[0]);

          heatMap.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          heatMap.append("title").text(function(d) { return  d.value; });
              
          var legend = svg.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; })
              .enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize);
		 }
	  
	  		paint(json);
		
		 //$scope.panelMeta.loading = false;
		
		 console.log("-----------------> rendering stop");
		}
		
		
		

		
		
          

        
      
      }
    };
  });
			
  module.controller('heatmap', function($scope, $rootScope, querySrv, dashboard, filterSrv) {

    console.log('heatmap controller loaded');

    $scope.panelMeta = {
      editorTabs : [
        {title:'Queries', src:'app/partials/querySelect.html'}
      ],
      modals : [
        {
          description: "Inspect",
          icon: "icon-info-sign",
          partial: "app/partials/inspector.html",
          show: $scope.panel.spyable
        }
      ],
      status  : "Experimental",
      description : "Displays a heatmap plot based on a source and a target field."
    };

    $scope.dashboard = dashboard;

    // Set and populate defaults
    var _d = {
      /** @scratch /panels/heatmap/3
       * spyable:: Setting spyable to false disables the inspect icon.
       */
      spyable : true,
      /** @scratch /panels/map/3
       * size:: Max number of nodes to draw
       */
      size    : 50,
      /** @scratch /panels/heatmap/5
       * ==== Queries
       * queries object:: This object describes the queries to use on this panel.
       * queries.mode::: Of the queries available, which to use. Options: +all, pinned, unpinned, selected+
       * queries.ids::: In +selected+ mode, which query ids are selected.
       */
      queries     : {
        mode        : 'all',
        ids         : []
      }
    };
    _.defaults($scope.panel,_d);

    $scope.init = function() {
      console.log('heatmap scope init');
      $scope.get_data();
    };

	$scope.get_data = function() {
		console.log('getdata scope init');
	console.log($scope.panel.day_field);
		$scope.panelMeta.loading = true;
	 
		var request,
        boolQuery,
        queries;
      var ejs = $scope.ejs;

      $scope.panel.queries.ids = querySrv.idsByMode($scope.panel.queries);

      queries = querySrv.getQueryObjs($scope.panel.queries.ids);
      boolQuery = $scope.ejs.BoolQuery();
      _.each(queries,function(q) {
        boolQuery = boolQuery.should(querySrv.toEjsObj(q));
      });

	  //boolQuery = boolQuery.should($scope.ejs.QueryStringQuery("day:[1 TO 31] AND hour:[1 TO 24]"));
      request = $scope.ejs.Request().indices(dashboard.indices);

	  
	request = request         
          .query(
            $scope.ejs.FilteredQuery(
              boolQuery,
              filterSrv.getBoolFilter(filterSrv.ids())
            )
          )
        .size(1000);
	

      $scope.populate_modal(request);

      $scope.data = {};

	 
		console.log($scope.panel);
		
		
		   request.doSearch().then(function(results) {

	    console.log("results", results);
	  
	    $scope.data.hits = [];
		$scope.data.maxday=0
		$scope.data.minday=32;
        _.each(results.hits.hits, function(v) {
			if(v._source[$scope.panel.day_field]>0
				&& v._source[$scope.panel.hour_field]>0 
				&& v._source[$scope.panel.hour_field]<25 
				&& v._source[$scope.panel.value_field]>-1
				) {
					$scope.data.hits.push(v._source);
					if(v._source[$scope.panel.day_field]>$scope.data.maxday) $scope.data.maxday=v._source[$scope.panel.day_field];
					if(v._source[$scope.panel.day_field]<$scope.data.minday) $scope.data.minday=v._source[$scope.panel.day_field];
			}
        });

        console.log("data", $scope.data.hits);
		          $scope.panelMeta.loading = false;
          $scope.$emit('render');
	      
		});
		
         //setTimeout(function() { $scope.$emit('render'), $scope.panelMeta.loading = false;},1000);
		  
		  return;
	}
	
	
    $scope.get_data2 = function() {
      console.log('heatmap scope get_data');

      $scope.panelMeta.loading = true;

      var request,
        boolQuery,
        queries;
      var ejs = $scope.ejs;

      $scope.panel.queries.ids = querySrv.idsByMode($scope.panel.queries);

      queries = querySrv.getQueryObjs($scope.panel.queries.ids);
      boolQuery = $scope.ejs.BoolQuery();
      _.each(queries,function(q) {
        boolQuery = boolQuery.should(querySrv.toEjsObj(q));
      });

	  

      request = $scope.ejs.Request().indices(dashboard.indices);
      request = request
        .facet($scope.ejs.TermsFacet('src_terms')
          .field($scope.panel.src_field)
          .size($scope.panel.size)
          .facetFilter($scope.ejs.QueryFilter(
            $scope.ejs.FilteredQuery(
              boolQuery,
              filterSrv.getBoolFilter(filterSrv.ids())
            )
          ))
        )
        .facet($scope.ejs.TermsFacet('dst_terms')
          .field($scope.panel.dst_field)
          .size($scope.panel.size)
          .facetFilter($scope.ejs.QueryFilter(
            $scope.ejs.FilteredQuery(
              boolQuery,
              filterSrv.getBoolFilter(filterSrv.ids())
            )
          ))
        )
        .size(0);

      $scope.populate_modal(request);

      $scope.data = {};

      request.doSearch().then(function(results) {

	    console.log("results", results);
	  
        $scope.data.src_terms = [];
        _.each(results.facets.src_terms.terms, function(v) {
          $scope.data.src_terms.push(v.term);
        });
        $scope.data.dst_terms = [];
        _.each(results.facets.dst_terms.terms, function(v) {
          $scope.data.dst_terms.push(v.term);
        });

        console.log("Src terms", $scope.data.src_terms);
        console.log("Dst terms", $scope.data.dst_terms);

        // build a new request to compute the connections between the nodes
        request = $scope.ejs.Request().indices(dashboard.indices);
        _.each($scope.data.src_terms, function(src) {
          _.each($scope.data.dst_terms, function(dst) {

            request = request
              .facet(ejs.FilterFacet(src + '->' + dst)
              .filter(ejs.AndFilter([
                ejs.TermFilter($scope.panel.src_field, src),
                ejs.TermFilter($scope.panel.dst_field, dst)
              ]))
              ).size(0);

          });
        });

        request.doSearch().then(function (results) {
		
			    console.log("results2", results);
				
          $scope.data.connections = {};
          _.each(results.facets, function(v, name) {
            $scope.data.connections[name] = v.count;
          });

          console.log('Connections: ', $scope.data.connections);

          $scope.panelMeta.loading = false;
          $scope.$emit('render');
        });

      });
	
      return;
    };

    $scope.populate_modal = function(request) {
      $scope.inspector = angular.toJson(JSON.parse(request.toString()),true);
    };


			    $scope.set_refresh = function (state) {
      $scope.refresh = state;
    };

    $scope.close_edit = function() {
      if($scope.refresh) {
        $scope.get_data();
      }
      $scope.refresh =  false;
      $scope.$emit('render');
    };

	$scope.render = function() {
      $scope.$emit('render');
    };
	
  });



});