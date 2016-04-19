(function(){
  'use strict';

  angular.module('questions')
         .service('questionService', ['$http', QuestionService]);

  function QuestionService($http){
    // Promise-based API
    return {
      fetchMockQuestions : function() {
        // Simulate async nature of real remote calls
        return $http({
          method: 'GET',
          url: '../test/soQuestionMock.json'
        }).then(function(response) {
          return response;
        })
      },
      fetchQuestions: function(page, pageSize) {
        return $http({
          method: 'GET',
          url: 'https://api.stackexchange.com/2.2/questions?page='+ page+1 +'&pagesize='+ pageSize +'&order=desc&sort=activity&site=stackoverflow'
        }).then(function(response) {
          console.log('se data', response);
          return response;
        }, function(response) {
          console.log('error response', response);
          return response;
        })
      }
    };
  }

})();
