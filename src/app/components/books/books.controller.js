import {
    evalResponse, 
    groupFnDatatablesWithAngular,
    extractColumn,
    loadingOverlay
}  from '../../../public/assets/js/jsCommonFunctions';

class BooksController{
    constructor($scope, SweetAlert, $uibModal, BooksService, DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, $compile, bsLoadingOverlayService){

        // this.loadingOverlayService = bsLoadingOverlayService;

        //console.log(bsLoadingOverlayService.getGlobalConfig());
    //     bsLoadingOverlayService.createHandler({
    //     referenceId: 'handler-overlay'
    // });

        bsLoadingOverlayService.setGlobalConfig({
            templateUrl: ./templates/loading-overlay.html
        })

        setTimeout(function(){

            bsLoadingOverlayService.start({
                referenceId: 'first'
            });
        }, 1000);

        // bsLoadingOverlayService.start({
        //     //referenceId: 'dt-loading-books'
        // });

        this.sweetAlert = SweetAlert;
        this.compile = $compile;
        this.scope = $scope;
        this.dtDefaultOptions = DTDefaultOptions;
        this.dtOptionsBuilder = DTOptionsBuilder;
        this.dtColumnBuilder = DTColumnBuilder;
        this.uibModal = $uibModal;
        this.booksService = BooksService;
        this.title = 'Books Page';
        this.fnDatatables = groupFnDatatablesWithAngular('nested', this.scope, this.compile);
        this.loadDatatables();

        this.events = {
            'editBook': (book) => {
                this.openModal(book);
            },
            'deleteBook': (book) => {
                this.sweetAlert
                    .confirm('¿Desea eliminar el libro seleccionado?')
                    .then(isConfirm => { 
                        if (isConfirm) {
                            this.deleteBook(book.id);
                        }
                    });
            }
        };

        this.form = {
            data: {}
        };
    }

    loadDatatables(){
        let vm = this;

        vm.nested = {
            dtInstance: {},
            items: {}
        };

        vm.dtDefaultOptions.setOption('order', [[0, 'desc']]);

        vm.nested.dtOptions = vm.dtOptionsBuilder
                                .newOptions()
                                .withOption('initComplete', vm.fnDatatables.initComplete)
                                .withPaginationType('full_numbers')
                                .withDataProp('data')
                                .withOption('ajax', {
                                    // Either you specify the AjaxDataProp here
                                    // dataSrc: 'data',
                                    // url: './assets/data/persons.json',
                                    url: 'http://127.0.0.1:8000/api/books?listFormat=datatables',
                                    type: 'GET',
                                    beforeSend: function(){
                                        //loadingOverlay.show(vm.loadingOverlayService, 'loading-dt-books');
                                    },
                                    data: function(d) {
                                        d.includes = 'author,genres';

                                        for(const i in vm.form.data){
                                            const value = vm.form.data[i];

                                            if(value){
                                                d[i] = value;
                                            }
                                        }
                                    },
                                    'dataFilter': function(response){
                                        var json = JSON.parse(response);                                        
                                        var data = json.data;

                                        return JSON.stringify({
                                            "draw": data.draw,
                                            "recordsTotal": data.recordsTotal,    
                                            "recordsFiltered": data.recordsFiltered,
                                            'data': data.items
                                        });
                                    },
                                    "dataSrc": function(data){
                                        if(data.data === undefined){
                                            return [];
                                        }

                                        return data.data;
                                    },
                                    complete: function(response){
                                        var json = response.responseJSON;

                                        //evalResponse(json);
                                        
                                        //loadingOverlay.hide(vm.bsLoadingOverlay, 'loading-dt-books');
                                    }
                                })
                                .withOption('serverSide', true)
                                .withOption('processing', true)
                                .withDOM("<'hide'lt>tr<'hide'ip>")
                                .withPaginationType('full_numbers')
                                .withOption('createdRow', vm.fnDatatables.createdRow)
                                .withOption('responsive', {
                                    details: {
                                        renderer: vm.fnDatatables.renderResponsive
                                    }    
                                })
                                .withBootstrap();
        vm.nested.dtColumns = [
            vm.dtColumnBuilder
                .newColumn('id')
                .withTitle('ID')
                .withOption('name', 'id'),
            vm.dtColumnBuilder
                .newColumn('title')
                .withTitle('Title')
                .withOption('name', 'title'),
            vm.dtColumnBuilder
                .newColumn('description')
                .withTitle('Description')
                .withOption('name', 'description')
                .notSortable(),
            vm.dtColumnBuilder
                .newColumn('author')
                .withTitle('Author')
                .withOption('name', 'author.name')
                .renderWith(function(data, type, full, meta) {
                     return data.name;
            }),
            vm.dtColumnBuilder
                .newColumn('genres')
                .withTitle('Géneros')
                .withOption('name', 'genres')
                .notSortable()
                .renderWith(function(data, type, full, meta) {
                     const items = extractColumn(data, 'name');

                     let html = ``;

                     items.forEach(item => {
                        html += `<span class="label label-default">${item}</span> `;    
                     });

                     return html;                        
            }),
            vm.dtColumnBuilder
                .newColumn(null)
                .withTitle('Actions')
                .withOption('width', '20%')
                .notSortable()
                .renderWith(function(data, type, full, meta) {
                    vm.nested.items[data.id] = data;

                    return `<div class="dt-actions">
                                <button class="btn btn-default" ng-click="vm.events.editBook(vm.nested.items[${ data.id }]);">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="btn btn-danger" ng-click="vm.events.deleteBook(vm.nested.items[${ data.id }]);">
                                    <i class="fa fa-trash-o"></i>
                                </button>
                            </div>`;
                })
        ];

        vm.nested.reloadData = vm.fnDatatables.reloadData;
    }

    deleteBook(id) {
        this.booksService.deleteBook(id)
            .then(response => {
                if(evalResponse(response)){
                    this.nested.reloadData(true, {});
                }
            });
    }

    openModal(data){
        const modalInstance = this.uibModal.open({
          templateUrl: 'modalFormBook.html',
          controller: 'BooksModalController',
          controllerAs: '$ctrl',
          size: '',
          resolve: {
            Response: () => {
                return data;
            }
          }
        });

        modalInstance.result.then(response => {
            this.nested.reloadData(response, {});
        }, () => {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
}

BooksController.$inject = ['$scope', 'SweetAlert' , '$uibModal', 'BooksService', 'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', 'bsLoadingOverlayService'];

export default BooksController;