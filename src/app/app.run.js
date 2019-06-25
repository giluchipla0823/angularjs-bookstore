import angular from 'angular';

const MODULE_NAME = 'app.run';

angular.module(MODULE_NAME, ['jcs-autoValidate-custom'])
    .run(['$rootScope', '$http', ($rootScope, $http) => {
        
        // cancel pending http ajax requests before change view
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            $http.pendingRequests.forEach(function(request) {
                if (request.canceller) {
                    request.canceller.resolve();
                }
            });
        });
    }])
    .run([
        'validator',
        'bootstrap4ElementModifier',
        'defaultErrorMessageResolver',
        (validator, bootstrap4ElementModifier, defaultErrorMessageResolver) => {
            var path = window.location.origin + document.getElementById('base-app').getAttribute('href');

            // Bootstrap 4
            validator.registerDomModifier(bootstrap4ElementModifier.key, bootstrap4ElementModifier);
            validator.setDefaultElementModifier(bootstrap4ElementModifier.key);

            // Language
            defaultErrorMessageResolver.setI18nFileRootPath(path + 'assets/js/libs/auto-validate/lang');
            defaultErrorMessageResolver.setCulture('es-co');

            validator.setValidElementStyling(false);
            validator.setInvalidElementStyling(true);
            bootstrap4ElementModifier.enableValidationStateIcons(true);

            defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
                errorMessages['defaultMessageEmail'] = 'Please enter a valid email address.';
            });
        }]);

export default MODULE_NAME;