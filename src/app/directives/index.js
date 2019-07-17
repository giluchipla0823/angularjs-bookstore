import angular from 'angular';

import { removeTextWithDiacritics } from '../../public/assets/js/jsCommonFunctions';

const MODULE_NAME = 'app.directives';

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

            if(angular.isDefined($scope.formatSelected)){
                $scope.isFormatSelected = true;
            }

            if(angular.isDefined($scope.formatResult)){
                $scope.isFormatResult = true;
            }
        }],
        template: (elem) => {
            var theme = elem.attr('theme');

            if(!theme){
                theme = 'bootstrap';
            }

            return '<div class="select2-bootstrap-append">' +
                       '<ui-select id="{{ elementId }}" ng-model="control.selected" theme="'+ theme +'" class="form-control" style="width: 100%;" title="{{ placeholder }}" ng-change="onChange()" search-enabled="search" ng-disabled="disabled" >' + 
                            '<ui-select-match allow-clear="true" placeholder="{{ placeholder }}">' + 
                                '<div ng-if="!isFormatSelected" ng-bind-html="$select.selected.text"></div>' + 
                                '<div ng-if="isFormatSelected" ng-html-compile="formatSelected()"></div>' +
                            '</ui-select-match>' +
                            '<ui-select-choices repeat="item in $select.items | filter: $select.search" refresh="fetch(config.actions.default, items, $select.search)" refresh-delay="150">' +
                              '<div ng-if="!isFormatResult" ng-bind-html="item.text | highlight: $select.search"></div>' +
                              '<div ng-if="isFormatResult" ng-html-compile="formatResult()"></div>' +
                            '</ui-select-choices>' +
                            '<ui-select-no-choice>' +
                                '<ul class="select2-results">' +
                                    '<li ng-if="search" class="select2-no-results">No se encontraron resultados con <b>"{{ $select.search }}"</b></li>' +
                                '</ul>' +
                            '</ui-select-no-choice>' +
                        '</ui-select>' +
                    '</div>';
        },
        link: (scope, elem, attrs) => {
            
            // Fetch results
            scope.fetch = (action, items, searchValue) => {
                if (action === scope.config.actions.default) {
                    scope.config.st.$controller.refreshItems([]);
                    scope.config.st.choice.scrollTop = 0;
                    scope.config.pagination.page = 1;
                    scope.config.pagination.start = 0;
                } else {
                    scope.config.pagination.page++;
                    scope.config.pagination.start = scope.config.pagination.end;
                }

                if (searchValue) {
                    items = items.filter(function($_elem) {
                        var text = removeTextWithDiacritics(($_elem.text).toLowerCase());
                        var search = removeTextWithDiacritics((searchValue).toLowerCase());

                        if (text.indexOf(search) !== -1) {
                            return $_elem;
                        }
                    });
                }

                scope.config.pagination.end = scope.config.pagination.page * scope.config.pagination.perPage;

                var newItems = items.slice(scope.config.pagination.start, scope.config.pagination.end);

                var currentItems = scope.config.st.$controller.items;
                currentItems = currentItems.concat(newItems);

                scope.config.st.$controller.refreshItems(currentItems);
            };

            setTimeout(() => {
                scope.config.st = scope.getConfigElement(elem);

                if($.isEmptyObject(scope.config.st)){
                    return ;
                }

                scope.setEventsSelect2();
            }, 0);

            // Config variables select2
            scope.getConfigElement = (element) => {
                var $select2 = element.find('.ui-select-container');

                if(!$select2.scope()){
                    return {};
                }

                var $choices = $select2.find('.ui-select-choices');

                return {
                    '$container': $select2,
                    '$controller': $select2.controller('uiSelect'),
                    '$choices': $choices,
                    'choice': $choices[0]
                };
            };

            // Setting events select2
            scope.setEventsSelect2 = () => {

                // Observando eventos "open" y "close" de select2
                scope.config.st.$container.scope().$watch('$select.open', function(isOpen){
                    if(!isOpen){
                        scope.config.st.$choices.animate({scrollTop: 0}, 0);
                    }else{
                        scope.fetch(scope.config.actions.default, scope.items);
                    }
                });

                // Event scroll infinity
                scope.config.st.choice.addEventListener('scroll', function() {
                    var sumScroll = scope.config.st.choice.scrollTop + scope.config.st.choice.clientHeight;
                    var devicePixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 5;

                    if ((sumScroll + devicePixelRatio) >= scope.config.st.choice.scrollHeight) {
                        scope.fetch(
                            scope.config.actions.scroll, 
                            scope.items, 
                            scope.config.st.$controller.search
                        );
                    }
                });
            };
        }
    };
};



angular.module(MODULE_NAME, [])
    .directive('routerLink', ['$route', routerLink])
    .directive('templateSelect2', [templateSelect2]);

export default MODULE_NAME;