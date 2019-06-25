import angular from 'angular';


const MODULE_NAME = 'app.directives';

angular.module(MODULE_NAME, [])
    .directive('routerLink', ['$route', ($route) => {
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
    }]);

export default MODULE_NAME;