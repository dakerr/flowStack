(function () {
  'use strict';

    angular
      .module('questions',['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
      .filter('unescape', function() {
        return function(str) {
          return _.unescape(str);
        };
      })
      .controller('QuestionCtrl', function(questionService, $timeout, $scope, $window) {
        var self = this;

        self.HEIGHT_OFFSET = 64;

        // In this example, we set up our model using a class.
        // Using a plain object works too. All that matters
        // is that we implement getItemAtIndex and getLength.
        var DynamicItems = function() {
          /**
           * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
           */
          this.loadedPages = {};

          /** @type {number} Total number of items. */
          this.numItems = 0;

          /** @const {number} Number of items to fetch per request. */
          this.PAGE_SIZE = 50;

          this.fetchNumItems_();

        };

        // Required.
        DynamicItems.prototype.getItemAtIndex = function(index) {
          var pageNumber = Math.floor(index / this.PAGE_SIZE);
          var page = this.loadedPages[pageNumber];

          if (page) {
            return page[index % this.PAGE_SIZE];
          } else if (page !== null) {
            this.fetchPage_(pageNumber);
          }
        };

        // Required.
        DynamicItems.prototype.getLength = function() {
          return this.numItems;
        };

        DynamicItems.prototype.fetchPage_ = function(pageNumber) {
          // Set the page to null so we know it is already being fetched.
          console.log('fetching...');
          this.loadedPages[pageNumber] = null;

          // questionService.fetchQuestions(pageNumber, this.PAGE_SIZE).then(angular.bind(this, function(res) {
          //   this.loadedPages[pageNumber] = _.concat([], res.data.items);
          // }));
          questionService.fetchMockQuestions().then(angular.bind(this, function(res){
            this.loadedPages[pageNumber] = _.map(res.data.items, function(el) { 
              return _.extend({}, el, {visible: false});
            });
          }));

        };

        DynamicItems.prototype.fetchNumItems_ = function() {
          // For demo purposes, we simulate loading the item count with a timed
          // promise. In real code, this function would likely contain an
          // $http request.
          $timeout(angular.noop, 300).then(angular.bind(this, function() {
            this.numItems = 5000;
          }));
        };
      
        this.toggleLeft = function() {
          $mdSidenav('left').toggle();
        }

        this.listStyle = {
          height: ($window.innerHeight - this.HEIGHT_OFFSET) + 'px'
        };

        this.toggle = function(item) {
          item.visible = !item.visible;
          console.log('clicked', item);
        }

        $window.addEventListener('resize', onResize);
        function onResize() {
          self.listStyle.height = ($window.innerHeight - self.HEIGHT_OFFSET) + 'px';
          if (!$scope.$root.$$phase) $scope.$digest();
        }

        this.dynamicItems = new DynamicItems();
      });
})();
