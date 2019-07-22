import { loadingOverlay } from '../../../public/assets/js/jsCommonFunctions';
import { evalResponse } from '../../../public/assets/js/jsResponseFunctions';
import { groupFnDatatablesWithAngular } from '../../../public/assets/js/jsDatatablesFunctions';
import { extractColumn } from '../../../public/assets/js/jsArrayFunctions';

class BooksController{
    constructor($scope, SweetAlert, $uibModal, BooksService, DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, $compile, bsLoadingOverlayService, AuthorsService){
        this.loadingOverlayService = bsLoadingOverlayService;
        this.sweetAlert = SweetAlert;
        this.compile = $compile;
        this.scope = $scope;
        this.dtDefaultOptions = DTDefaultOptions;
        this.dtOptionsBuilder = DTOptionsBuilder;
        this.dtColumnBuilder = DTColumnBuilder;
        this.uibModal = $uibModal;
        this.booksService = BooksService;
        this.authorsService = AuthorsService;
        this.title = 'Books';
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

        this.author = {};

        this.form = {
            data: {}
        };

        this.authors = {
            loading: false,
            data: []
        };

        this.getAuthors();
    }

    evtChangeAuthor(data){
        delete this.form.data.author;

        if(data){
            this.form.data.author = {
                name: data.name
            };
        }
    }

    getAuthors(){
        this.authors.loading = true;

        this.authorsService.getAuthors()
            .then( response => {
                if(evalResponse(response)){
                    const data = response.data;
                    const authors = data.map(function (item) {
                        const name = item.name;

                        return {
                            id: item.id,
                            text: name,
                            name: name
                        };
                    });

                    this.authors.loading = false;
                    this.authors.data = authors;
                }
            });
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
                                    url: 'http://127.0.0.1:8000/api/books',
                                    type: 'GET',
                                    beforeSend: function(){
                                        loadingOverlay.show(vm.loadingOverlayService, 'loading-dt-books');
                                    },
                                    data: function(d) {
                                        d.listFormat = 'datatables';
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

                                        evalResponse(json);

                                        loadingOverlay.hide(vm.loadingOverlayService, 'loading-dt-books');
                                    }
                                })
                                .withOption('serverSide', true)
                                .withOption('processing', false)
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
                .withOption('name', 'id')
                .withOption('class', 'dt-body-center'),
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
          backdrop: 'static',
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

BooksController.$inject = ['$scope', 'SweetAlert' , '$uibModal', 'BooksService', 'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', 'bsLoadingOverlayService', 'AuthorsService'];

export default BooksController;