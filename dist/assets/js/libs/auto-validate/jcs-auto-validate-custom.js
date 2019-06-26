import angular from 'angular';
import './jcs-auto-validate.js';

const MODULE_NAME = 'jcs-autoValidate-custom';

angular.module(MODULE_NAME, ['jcs-autoValidate'])
    .factory('bootstrap4ElementModifier', ['$log', function($log) {
        var customCss = [
            '<style>' +
            '.glyphicon-spin-jcs {' +
            '-webkit-animation: spin 1000ms infinite linear;' +
            'animation: spin 1000ms infinite linear;' +
            '}' +
            '@-webkit-keyframes spin {' +
            '0% {' +
            '-webkit-transform: rotate(0deg);' +
            'transform: rotate(0deg);' +
            '}' +
            '100% {' +
            '-webkit-transform: rotate(359deg);' +
            'transform: rotate(359deg);' +
            '}' +
            '}' +
            '@keyframes spin {' +
            '0% {' +
            '-webkit-transform: rotate(0deg);' +
            'transform: rotate(0deg);' +
            '}' +
            '100% {' +
            '-webkit-transform: rotate(359deg);' +
            'transform: rotate(359deg);' +
            '}' +
            '}' +
            '</style>'
        ].join('');

        angular.element(document.body).append(angular.element(customCss));

        var reset = function(el) {
                angular.forEach(el.find('span'), function(spanEl) {
                    spanEl = angular.element(spanEl);
                    if (spanEl.hasClass('error-msg') || spanEl.hasClass('form-control-feedback') || spanEl.hasClass('control-feedback')) {
                        spanEl.remove();
                    }
                });

                el.removeClass('has-success has-danger has-feedback');
            },
            findWithClassElementAsc = function(el, klass) {
                var returnEl,
                    parent = el;
                for (var i = 0; i <= 10; i += 1) {
                    if (parent !== undefined && parent.hasClass(klass)) {
                        returnEl = parent;
                        break;
                    } else if (parent !== undefined) {
                        parent = parent.parent();
                    }
                }

                return returnEl;
            },

            findWithClassElementDesc = function(el, klass) {
                var child;
                for (var i = 0; i < el.children.length; i += 1) {
                    child = el.children[i];
                    if (child !== undefined && angular.element(child).hasClass(klass)) {
                        break;
                    } else if (child.children !== undefined) {
                        child = findWithClassElementDesc(child, klass);
                        if (child.length > 0) {
                            break;
                        }
                    }
                }

                return angular.element(child);
            },

            findFormGroupElement = function(el) {
                return findWithClassElementAsc(el, 'form-group');
            },

            findInputGroupElement = function(el) {
                return findWithClassElementDesc(el, 'input-group');
            },

            insertAfter = function(referenceNode, newNode) {
                referenceNode[0].parentNode.insertBefore(newNode[0], referenceNode[0].nextSibling);
            },

            /**
             * @ngdoc property
             * @name bootstrap4ElementModifier#addValidationStateIcons
             * @propertyOf bootstrap4ElementModifier
             * @returns {bool} True if an state icon will be added to the element in the valid and invalid control
             * states.  The default is false.
             */
            addValidationStateIcons = false,

            enableValidationStateIcons = function(enable) {
                addValidationStateIcons = enable;
            },

            makeValid = function(el) {
                var frmGroupEl = findFormGroupElement(el),
                    inputGroupEl;

                if (frmGroupEl) {
                    reset(frmGroupEl);
                    inputGroupEl = findInputGroupElement(frmGroupEl[0]);
                    frmGroupEl.addClass('has-success ' + (inputGroupEl.length > 0 || addValidationStateIcons === false ? '' : 'has-feedback'));
                    if (addValidationStateIcons) {
                        el.addClass('form-control-success');
                    }
                } else {
                    $log.error('Angular-auto-validate: invalid bs4 form structure elements must be wrapped by a form-group class');
                }
            },

            makeInvalid = function(el, errorMsg) {
                var frmGroupEl = findFormGroupElement(el),
                    helpTextEl = angular.element('<span class="form-control-feedback">' + errorMsg + '</span>'),
                    inputGroupEl;

                if (frmGroupEl) {
                    reset(frmGroupEl);
                    inputGroupEl = findInputGroupElement(frmGroupEl[0]);

                    frmGroupEl.addClass('has-danger ' + (inputGroupEl.length > 0 || addValidationStateIcons === false ? '' : 'has-feedback'));

                    insertAfter(inputGroupEl.length > 0 ? inputGroupEl : getCorrectElementToPlaceErrorElementAfter(el), helpTextEl);
                    if (addValidationStateIcons) {
                        el.addClass('form-control-danger');
                    }
                } else {
                    $log.error('Angular-auto-validate: invalid bs4 form structure elements must be wrapped by a form-group class');
                }
            },

            getCorrectElementToPlaceErrorElementAfter = function(el) {
                var correctEl = el,
                    elType = el[0].type ? el[0].type.toLowerCase() : '';

                if ((elType === 'checkbox' || elType === 'radio') && el.parent()[0].nodeName.toLowerCase() === 'label') {
                    correctEl = el.parent();
                }

                return correctEl;
            },

            makeDefault = function(el) {
                var frmGroupEl = findFormGroupElement(el);
                if (frmGroupEl) {
                    reset(frmGroupEl);
                } else {
                    $log.error('Angular-auto-validate: invalid bs4 form structure elements must be wrapped by a form-group class');
                }
            },

            waitForAsyncValidators = function(el) {
                var frmGroupEl = findFormGroupElement(el),
                    inputGroupEl;

                if (frmGroupEl) {
                    reset(frmGroupEl);
                    inputGroupEl = findInputGroupElement(frmGroupEl[0]);
                    frmGroupEl.addClass('has-feedback ' + (inputGroupEl.length > 0 || addValidationStateIcons === false ? '' : 'has-feedback'));
                } else {
                    $log.error('Angular-auto-validate: invalid bs4 form structure elements must be wrapped by a form-group class');
                }
            };

        return {
            makeValid: makeValid,
            makeInvalid: makeInvalid,
            makeDefault: makeDefault,
            waitForAsyncValidators: waitForAsyncValidators,
            enableValidationStateIcons: enableValidationStateIcons,
            key: 'bs4'
        };
    }]);


export default MODULE_NAME;