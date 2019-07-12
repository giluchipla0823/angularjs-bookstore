import {evalResponse, groupFnDatatablesWithAngular}  from '../../../public/assets/js/jsCommonFunctions';

class BooksController{
    constructor($scope, $uibModal, BooksService, DTOptionsBuilder, DTColumnBuilder, $compile){
        this.compile = $compile;
        this.scope = $scope;
        this.dtOptionsBuilder = DTOptionsBuilder;
        this.dtColumnBuilder = DTColumnBuilder;
        this.uibModal = $uibModal;
        this.booksService = BooksService;
        this.title = 'Books Page';
        
        this.getBooks();

        this.items = ['item1', 'item2', 'item3'];
        this.selectedItem = null;

        this.fnDatatables = groupFnDatatablesWithAngular(this.scope, this.compile);

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
                                    details: {
                                        renderer: vm.fnDatatables.renderResponsive
                                    }    
                                })
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