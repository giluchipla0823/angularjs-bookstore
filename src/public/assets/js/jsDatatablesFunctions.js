export const groupFnDatatablesWithAngular = (ngModel, $scope, $compile) =>{
    
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

        console.log('instance api', instance);

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
            toggleClassLastActive($_table);

            var count = columns.reduce( function (a,b) {
                return b === false ? a + 1 : a;
            }, 0 );

            datatable.columns.adjust();
        }); 
    }

    const reloadData = (resetPaging, o_params) => {
        const $_instance = $scope.vm[ngModel].dtInstance;
        const a_ulRowDT = $('tr.child ul.row-dt');
        // const o_beforeEvents = o_params.o_beforeEvents;
        // const o_afterEvents = o_params.o_afterEvents;

        // Ejecución de eventos antes de realizar el reload
        // for(let i in o_beforeEvents){
        //     if(typeof o_beforeEvents[i] === 'function'){
        //         o_beforeEvents[i]();
        //     }
        // }

        $_instance.reloadData(function(response){
            showItemsResponsiveAfterReload(a_ulRowDT);

            // Ejecución de eventos después de realizar el reload
            // for(let i in o_afterEvents){
            //     if(typeof o_afterEvents[i] === 'function'){
            //         o_afterEvents[i]();
            //     }
            // }

        }, resetPaging);
    }

    const showItemsResponsiveAfterReload = (a_ulRowDT) => {
        const count_ul = a_ulRowDT.length;

        for(let i = 0; i < count_ul; i++){
          const data = $(a_ulRowDT[i]).data();
          const id = data.id;
          
          angular.element('.tr-'+ id +'')
                 .children()
                 .eq(0)
                 .trigger('click');
        }
    };

    const renderDOM = `<'hide'lt><'row'<'col-sm-12'tr>><'hide'ip>`;

    return {
        initComplete: initComplete,
        defaultConfigInitComplete: defaultConfigInitComplete,
        createdRow: createdRow,
        renderResponsive: renderResponsive,
        loadEventsDatatables: loadEventsDatatables,
        reloadData: reloadData,
        renderDOM: renderDOM
    };
};

export default {
    groupFnDatatablesWithAngular
};