class Datatables{
    static initComplete(settings, json) {
        const instance = settings.oInstance;

        this.defaultConfigInitComplete(instance, settings, json);
    }

    static defaultConfigInitComplete(instance, settings, json) {
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

    static loadEventsDatatables($_table, $_datatable) {
        this.toggleClassLastActive($_table);

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
            this.toggleClassLastActive($_table);

            var count = columns.reduce( function (a,b) {
                return b === false ? a + 1 : a;
            }, 0 );

            datatable.columns.adjust();
        }); 
    }

    static toggleClassLastActive($_table) {
        $_table.find('thead tr th').removeClass('lastVisible');

        $_table.filter('.collapsed').find('thead tr th:visible:last').addClass('lastVisible');


        $_table.find('tbody tr.row-dt td').removeClass('lastVisible');

        $_table.filter('.collapsed').find('tbody tr.row-dt').each(function(){
            $(this).find('td:visible:last').addClass('lastVisible');
        });
    }

    static getFilterData(response){
        const json = JSON.parse(response);                                        
        const data = json.data;

        return JSON.stringify({
            "draw": data.draw,
            "recordsTotal": data.recordsTotal,    
            "recordsFiltered": data.recordsFiltered,
            'data': data.items
        });
    }

    static getSourceData(data){
        if(!data.data){
            return [];
        }

        return data.data;
    }

    static renderDOM = `<'hide'lt><'row'<'col-sm-12'tr>><'hide'ip>`;
}

export default Datatables;