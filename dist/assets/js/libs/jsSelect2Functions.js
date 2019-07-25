const select2Functions = {
    templateSingleSelect2: (theme) => {
        return '<div class="select2-bootstrap-append">' +
                   '<ui-select id="{{ elementId }}" ng-required="isRequired" ng-model="control.selected" theme="'+ theme +'" class="form-control" style="width: 100%;" title="{{ placeholder }}" ng-change="onChange()" search-enabled="search" ng-disabled="disabled" >' + 
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
    templateMultipleSelect2: (theme) => {
        return '<div class="select2-bootstrap-append">' +
                   '<ui-select multiple="multiple" ng-required="isRequired" id="{{ elementId }}" ng-model="control.selected" theme="'+ theme +'" class="form-control" style="width: 100%;" title="{{ placeholder }}" ng-change="onChange()" search-enabled="search" ng-disabled="disabled" >' + 
                        '<ui-select-match allow-clear="true" placeholder="{{ placeholder }}">' + 
                            '<span ng-if="!isFormatSelected" ng-bind-html="$item.text"></span>' + 
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
    }
}

export default {
    select2Functions
}

