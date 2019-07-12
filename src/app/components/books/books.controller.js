import {evalResponse, groupFnDatatablesWithAngular}  from '../../../public/assets/js/jsCommonFunctions';

class BooksController{
    constructor($scope, $uibModal, BooksService, DTOptionsBuilder, DTColumnBuilder, $compile){
        this.dtOptionsBuilder = DTOptionsBuilder;
        this.dtColumnBuilder = DTColumnBuilder;
        this.uibModal = $uibModal;
        this.booksService = BooksService;
        this.title = 'Books Page';
        
        this.getBooks();

        this.items = ['item1', 'item2', 'item3'];
        this.selectedItem = null;

        this.fnDatatables = groupFnDatatablesWithAngular($scope, $compile);

        this.loadDatatables();
    }

    loadDatatables(){
        let vm = this;
        vm.persons = {};

        vm.nested = {
            dtInstance: {}
        };
        vm.nested.dtOptions = vm.dtOptionsBuilder
                            .newOptions()
                            .withOption('initComplete', vm.fnDatatables.initComplete)
                            .withOption('ajax', {
                                // Either you specify the AjaxDataProp here
                                // dataSrc: 'data',
                                url: './assets/data/persons.json',
                                type: 'GET',
                                data: {
                                    title: 'title',
                                    description: 'description'
                                }
                            })
                            .withDOM("<'hide'lt>tr<'hide'ip>")
                            .withPaginationType('full_numbers')
                            .withOption('createdRow', vm.fnDatatables.createdRow)
                            .withOption('responsive', {
                                detailts: {
                                    renderer: vm.fnDatatables.renderResponsive
                                }    
                            })
                            /* .withOption('responsive', {
                                detailts: {
                                    renderer: function(api, rowIdx, columns) {

                                        console.log('render responsive');

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
                                    }
                                }
                            }) */
                            .withBootstrap();

        vm.nested.dtColumns = [
            vm.dtColumnBuilder.newColumn('id').withTitle('ID').withClass('text-danger'),
            vm.dtColumnBuilder.newColumn('firstName').withTitle('First name'),
            vm.dtColumnBuilder.newColumn('lastName').withTitle('Last name'),
            vm.dtColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
                .renderWith(function(data, type, full, meta) {
                        vm.persons[data.id] = data;

                        return `<button class="btn btn-danger" ng-click="vm.deleteRow(vm.persons[${ data.id }]);">
                                    <i class="fa fa-trash-o"></i>
                                </button>`;
                })
        ];
    }

    deleteRow(person) {
        console.log('deleteRow', person);
    }

    getBooks(){
        this.booksService.getBooks()
            .then( response =>{
                if(evalResponse(response)){
                    console.log('books', response.data);
                }
            });
    }

    openModal(){
        const modalInstance = this.uibModal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalController',
          controllerAs: '$ctrl',
          size: '',
          resolve: {
            Items:() => {
                return this.items;
            }
          }
        });

        modalInstance.result.then(selectedItem => {
            this.selectedItem = selectedItem;
        }, () => {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
}

BooksController.$inject = ['$scope', '$uibModal', 'BooksService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile'];

export default BooksController;