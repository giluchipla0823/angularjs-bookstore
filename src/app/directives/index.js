import angular from 'angular';
import Select2Utils from '../utils/Select2';

const MODULE_NAME = 'app.directives';

const myMaxlength = function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {
      var maxlength = Number(attrs.myMaxlength);

      function fromUser(text) {
          if(!text){
              text = '';
          }

          if (text.length > maxlength) {
            var transformedInput = text.substring(0, maxlength);
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
            return transformedInput;
          } 
          return text;
      }

      ngModelCtrl.$parsers.push(fromUser);
    }
  }; 
};

// Directiva "routerLink" para marcar menu seleccionado
const routerLink = ($route) => {
    return {
        restrict: 'A'
        , link: function (scope, elem, attr, ctrl) {
            var routerLink = attr.routerLink;

            elem.attr('href', '.' + routerLink);

            scope.$watch(
                function () {
                    return $route.current;
                }
                , function (newValue) {
                    if (!newValue) {
                        return false;
                    }

                    if (!newValue.$$route) {
                        return false;
                    }

                    if (newValue.$$route.originalPath === routerLink) {
                        var $_parent = elem.parents('[router-link-active]');

                        elem.parents('ul.navbar-nav')
                            .children('li')
                            .removeClass('active');

                        $_parent.addClass($_parent.attr('router-link-active'));
                    }
                }
            );
        }
    }
};

const templateSelect2 = () => {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            items: '=items',
            control: '=', 
            placeholder: '@',
            search: '=?',
            isRequired: '=?',
            disabled: '=?',
            onChange: '&', 
            formatSelected: '&?', 
            formatResult: '&?', 
        },
        controller: ['$scope', ($scope) => {
            $scope.config =  {
                actions: {
                    default: 'default',
                    scroll: 'scroll'
                },
                pagination: {
                    page: 1,
                    start: 0,
                    end: 0,
                    perPage: 10
                },
                st: {}
            };

            $scope.isFormatSelected = false;
            $scope.isFormatResult = false;

            if(!angular.isDefined($scope.isRequired)){
                $scope.isRequired = false;
            }

            if(angular.isDefined($scope.formatSelected)){
                $scope.isFormatSelected = true;
            }

            if(angular.isDefined($scope.formatResult)){
                $scope.isFormatResult = true;
            }
        }],
        template: (elem) => {
            var theme = elem.attr('theme');
            var isMultiple = elem.attr('is-multiple') === 'true';

            if(!theme){
                theme = 'bootstrap';
            }

            if(isMultiple){
                return Select2Utils.getMultipleTemplate(theme);
            }

            return Select2Utils.getSingleTemplate(theme);
        },
        link: Select2Utils.linkToDirective
    };
};

const numbersOnly = () => {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                function validation(input) {
                    if (!input) return '';

                    var inputNumber = input.toString().replace(/[^0-9]/g, '');

                    if (inputNumber !== input) {
                        ctrl.$setViewValue(inputNumber);
                        ctrl.$render();
                    }

                    return inputNumber;
                }

                ctrl.$parsers.push(validation);
            }
        };
    };



angular.module(MODULE_NAME, [])
    .directive('routerLink', ['$route', routerLink])
    .directive('templateSelect2', [templateSelect2])
    .directive('numbersOnly', [numbersOnly])
    .directive('myMaxlength', [myMaxlength]);

export default MODULE_NAME;