class Datatables{

    constructor(ngModel, $scope, $compile) {
        this.ngModel = ngModel;
        this.scope = $scope;
        this.compile = $compile;
    }

    initComplete = (settings, json) => {
        const instance = settings.oInstance;        

        this.defaultConfigInitComplete(instance, settings, json);
    }

    defaultConfigInitComplete = (instance, settings, json) => {
        const $_api = instance.api();
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

        this.loadEventsDatatables($_table, $_api);
    }

    loadEventsDatatables = ($_table, $_datatable) => {
        const self = this; 

        self.toggleClassLastActive($_table);

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
            self.toggleClassLastActive($_table);

            var count = columns.reduce( function (a,b) {
                return b === false ? a + 1 : a;
            }, 0 );

            datatable.columns.adjust();
        }); 
    }

    toggleClassLastActive = ($_table) => {
        $_table.find('thead tr th').removeClass('lastVisible');

        $_table.filter('.collapsed').find('thead tr th:visible:last').addClass('lastVisible');


        $_table.find('tbody tr.row-dt td').removeClass('lastVisible');

        $_table.filter('.collapsed').find('tbody tr.row-dt').each(function(){
            $(this).find('td:visible:last').addClass('lastVisible');
        });
    }

    getFilterData = (response) =>{
        const json = JSON.parse(response);                                        
        const data = json.data;

        return JSON.stringify({
            "draw": data.draw,
            "recordsTotal": data.recordsTotal,    
            "recordsFiltered": data.recordsFiltered,
            'data': data.items
        });
    }

    getSourceData = (data) => {
        if(!data.data){
            return [];
        }

        return data.data;
    }

    renderDOM = `<'hide'lt><'row'<'col-sm-12'tr>><'hide'ip>`;

    createdRow = (row, data) => {
        // Recompiling so we can bind Angular directive to the DT
        let $_element = angular.element(row);
        $_element.addClass('row-dt tr-' + data.id);
        $_element.data(data);

        this.compile($_element.contents())(this.scope);
    };

    // Función para renderizar las columnas cuando se hace responsive de la página
    renderResponsive = (api, rowIdx, columns) => {
        const api_data = api.data();

        const data = $.map(columns, function (col, i) {
            const html_responsive = '<li data-dtr-index="' + col.columnIndex + '" data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">'+
                '<span class="dtr-title">'+
                col.title +
                '</span> '+
                '<span class="dtr-data">'+
                col.data +
                '</span>'+
                '</li>';
            return col.hidden ? html_responsive : '';

        }).join('');

        let $_ulData = $('<ul class="row-dt" data-dtr-index="' + rowIdx + '"/>');
        let $_element = angular.element($_ulData.append(data));
        
        $_element.data(api_data[rowIdx]);

        return data ? this.compile($_element)(this.scope) : false;
    };

    reloadData = (resetPaging, o_params) => {
        const $_instance = this.scope.vm[this.ngModel].dtInstance;
        const $_ul = $('tr.child ul.row-dt');
        
        $_instance.reloadData((response) => {
            this.showItemsResponsiveAfterReload($_ul);
        }, resetPaging);
    }

    showItemsResponsiveAfterReload = ($_ul) => {
        const count = $_ul.length;

        for(let i = 0; i < count; i++){
          const data = $($_ul[i]).data();
          const id = data.id;
          
          angular.element('.tr-'+ id +'')
                 .children()
                 .eq(0)
                 .trigger('click');
        }
    };
}

export default Datatables;