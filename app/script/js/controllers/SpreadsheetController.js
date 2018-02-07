"use strict";

app.controller("spreadsheetController", ["$scope", "$parse", "spreadsheetFactory",
    function($scope, $parse, $spreadsheetFactory) {
        $scope.spreadsheetFactory = $spreadsheetFactory;

        $scope.resolveReferenceToCells = function (cellContent) {
            cellContent = cellContent.replace("=", "");

            var finalCellContent = cellContent;

            var matches = cellContent.match(/[A-Z]\d+/g);
            console.log(matches);
            if (matches != null) {
                for (var i = 0; i < matches.length; i++) {
                    var referenceCellContent = $scope.spreadsheetFactory.cells[matches[i]];
                    if (typeof referenceCellContent === 'undefined' || referenceCellContent === '') {
                        referenceCellContent = 0;
                    } else {
                        referenceCellContent = $scope.resolveReferenceToCells(referenceCellContent);
                    }

                    finalCellContent = finalCellContent.replace(matches[i], referenceCellContent);
                }
            }

            return finalCellContent;
        };

        $scope.computeCell = function(cell){
            var cellContent = $scope.spreadsheetFactory.cells[cell];

            if (typeof cellContent === 'undefined'){
                return cellContent;
            }

            if (cellContent.charAt(0) == "=") {
                var resolveFormula = $scope.resolveReferenceToCells(cellContent);
                var result = $parse(resolveFormula)($scope);
                return result;
            }
            return cellContent;
        }
        
    }]);