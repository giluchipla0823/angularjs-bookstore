
export const evalResponse = (response) => {
    if(!response){
        return false;
    }

    if (typeof response === "string") {
        response = $.parseJSON(response);
    }

    var response_code = response.code;

    if (response_code === 2 || response_code === 3) {
        return false;
    } 

    return true;
};

export const groupFnDatatablesWithAngular = ($scope, $compile) =>{
    
    const defaultConfigInitComplete = (instance, settings, json) => {
        var $_api = instance.api();
        const tableId = settings.sTableId;
        const $_table = $('#' + tableId);
        const $_panel = $_table.parents('.panel');

        const $_containerLength = $_panel.find('.dt-select-length');
        const $_containerInfoResults = $_panel.find('.dt-info-results');
        const $_containerPagination = $_panel.find('.dt-pagination');

        $_containerLength.children().remove();
        $_containerInfoResults.children().remove();
        $_containerPagination.children().remove();

        const $_datatableLength = $_panel.find('.dataTables_length');
        const $_datatableInfo = $_panel.find('.dataTables_info');
        const $_datatablePaginate = $_panel.find('.dataTables_paginate');

        $_datatableLength.appendTo($_containerLength);
        $_containerInfoResults.append($_datatableInfo);
        $_containerPagination.append($_datatablePaginate);

        loadEventsDatatables($_table, $_api);
    }

    const toggleClassLastActive = ($_table) => {
        $_table.find('thead tr th').removeClass('lastVisible');

        $_table.filter('.collapsed').find('thead tr th:visible:last').addClass('lastVisible');


        $_table.find('tbody tr.row-dt td').removeClass('lastVisible');

        $_table.filter('.collapsed').find('tbody tr.row-dt').each(function(){
            $(this).find('td:visible:last').addClass('lastVisible');
        });
    }

    const initComplete = (settings, json) => {
        const instance = settings.oInstance;
        defaultConfigInitComplete(instance, settings, json);
    }

    const createdRow = (row, data) => {
        // Recompiling so we can bind Angular directive to the DT
        var $_element = angular.element(row);
        $_element.addClass('row-dt tr-' + data.id);
        $_element.data(data);

        $compile($_element.contents())($scope);
    };

    // Función para renderizar las columnas cuando se hace responsive de la página
    const renderResponsive = (api, rowIdx, columns) => {
        var api_data = api.data();

        var data = $.map(columns, function (col, i) {
            var html_responsive = '<li data-dtr-index="' + col.columnIndex + '" data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">'+
                '<span class="dtr-title">'+
                col.title +
                '</span> '+
                '<span class="dtr-data">'+
                col.data +
                '</span>'+
                '</li>';
            return col.hidden ? html_responsive : '';

        }).join('');

        var $_ulData = $('<ul class="row-dt" data-dtr-index="' + rowIdx + '"/>');
        var $_element = angular.element($_ulData.append(data));
        
        $_element.data(api_data[rowIdx]);

        return data ? $compile($_element)($scope) : false;
    };

    const loadEventsDatatables = ($_table, $_datatable) => {

        toggleClassLastActive($_table);

        $_table.find('tbody').on( 'click', 'tr', function () {
            var $_this = $(this);

            if ($_this.hasClass('selected')) {
                $_this.removeClass('selected');
            }
            else {
                $_datatable.$('tr.selected').removeClass('selected');
                $_this.addClass('selected');
            }
        });


        $_datatable.on('responsive-resize', function(e, datatable, columns) {

            console.log('responsive-resize');

            toggleClassLastActive($_table);

            var count = columns.reduce( function (a,b) {
                return b === false ? a+1 : a;
            }, 0 );

            datatable.columns.adjust();


        }); 
    }

    return {
        initComplete: initComplete,
        defaultConfigInitComplete: defaultConfigInitComplete,
        createdRow: createdRow,
        renderResponsive: renderResponsive,
        loadEventsDatatables: loadEventsDatatables
    };
};

export default {
    evalResponse, 
    groupFnDatatablesWithAngular
};