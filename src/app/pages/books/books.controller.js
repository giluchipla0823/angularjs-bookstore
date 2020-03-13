import { loadingOverlay } from '../../utils/Common';
import { evalResponse } from '../../utils/Response';
import { extractColumn } from '../../utils/Array';
import BooksFormTemplate from './books-form/books-form.template.html';
import Datatables from '../../utils/Datatables';

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
        this.datatablesHelper = new Datatables('nested', $scope, $compile);
    }

    $onInit() {
        this.title = 'Books';

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
        this.nested = {
            dtInstance: {},
            items: {}
        };

        this.dtDefaultOptions.setOption('order', [[0, 'desc']]);

        this.nested.dtOptions = this.dtOptionsBuilder
                                .newOptions()
                                .withOption('initComplete', this.datatablesHelper.initComplete)
                                .withPaginationType('full_numbers')
                                .withDataProp('data')
                                .withOption('ajax', {
                                    url:  API_URL_V1 + 'books',
                                    type: 'GET',
                                    beforeSend: () => {
                                        loadingOverlay.show(this.loadingOverlayService, 'loading-dt-books');
                                    },
                                    data: (d) => {
                                        d.listFormat = 'datatables';
                                        d.includes = 'author,genres';

                                        for(const i in this.form.data){
                                            const value = this.form.data[i];

                                            if(value){
                                                d[i] = value;
                                            }
                                        }
                                    },
                                    'dataFilter': this.datatablesHelper.getFilterData,
                                    "dataSrc": this.datatablesHelper.getSourceData,
                                    complete: (response) => {
                                        var json = response.responseJSON;

                                        evalResponse(json);

                                        loadingOverlay.hide(this.loadingOverlayService, 'loading-dt-books');
                                    }
                                })
                                .withOption('serverSide', true)
                                .withOption('processing', false)
                                .withDOM(this.datatablesHelper.renderDOM)
                                .withPaginationType('full_numbers')
                                .withOption('createdRow', this.datatablesHelper.createdRow)
                                .withOption('responsive', {
                                    details: {
                                        renderer: this.datatablesHelper.renderResponsive
                                    }    
                                })
                                .withBootstrap();
        this.nested.dtColumns = [
            this.dtColumnBuilder
                .newColumn('id')
                .withTitle('ID')
                .withOption('name', 'id')
                .withOption('class', 'dt-body-center'),
            this.dtColumnBuilder
                .newColumn('title')
                .withTitle('Título')
                .withOption('name', 'title'),
            this.dtColumnBuilder
                .newColumn('summary')
                .withTitle('Resumen')
                .withOption('name', 'summary')
                .notSortable(),
            this.dtColumnBuilder
                .newColumn('description')
                .withTitle('Descripción')
                .withOption('name', 'description')
                .notVisible()
                .notSortable(),
            this.dtColumnBuilder
                .newColumn('author')
                .withTitle('Autor')
                .withOption('name', 'author.name')
                .renderWith((data, type, full, meta) => {
                     return data.name;
            }),
            this.dtColumnBuilder
                .newColumn('genres')
                .withTitle('Géneros')
                .withOption('name', 'genres')
                .notSortable()
                .renderWith((data, type, full, meta) => {
                     const items = extractColumn(data, 'name');

                     let html = ``;

                     items.forEach(item => {
                        html += `<span class="label label-default">${item}</span> `;    
                     });

                     return html;                        
            }),
            this.dtColumnBuilder
                .newColumn(null)
                .withTitle('Actions')
                .withOption('width', '20%')
                .notSortable()
                .renderWith((data, type, full, meta) => {
                    let vm = this;
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

        this.nested.reloadData = this.datatablesHelper.reloadData;
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
          template: BooksFormTemplate,
          controller: 'BooksFormController',
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