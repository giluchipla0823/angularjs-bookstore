import { loadingOverlay } from '../../../public/assets/js/jsCommonFunctions';
import { evalResponse } from '../../../public/assets/js/jsResponseFunctions';
import { groupFnDatatablesWithAngular } from '../../../public/assets/js/jsDatatablesFunctions';

class AuthorsController{
    constructor($scope, SweetAlert, $uibModal, AuthorsService, DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, $compile, bsLoadingOverlayService){
        this.loadingOverlayService = bsLoadingOverlayService;
        this.sweetAlert = SweetAlert;
        this.compile = $compile;
        this.scope = $scope;
        this.dtDefaultOptions = DTDefaultOptions;
        this.dtOptionsBuilder = DTOptionsBuilder;
        this.dtColumnBuilder = DTColumnBuilder;
        this.uibModal = $uibModal;
        this.authorsService = AuthorsService;
        this.title = 'Authors';
        this.fnDatatables = groupFnDatatablesWithAngular('nested', this.scope, this.compile);

        this.loadDatatables();

        this.events = {
            'editAuthor': (author) => {
                this.openModal(author);
            },
            'deleteAuthor': (author) => {
                this.sweetAlert
                    .confirm('¿Desea eliminar el autor seleccionado?')
                    .then(isConfirm => { 
                        if (isConfirm) {
                            this.deleteAuthor(author.id);
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
                                    url: 'http://127.0.0.1:8000/api/authors',
                                    type: 'GET',
                                    beforeSend: function(){
                                        loadingOverlay.show(vm.loadingOverlayService, 'loading-dt-authors');
                                    },
                                    data: function(d) {
                                        d.listFormat = 'datatables';

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

                                        loadingOverlay.hide(vm.loadingOverlayService, 'loading-dt-authors');
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
                .newColumn('name')
                .withTitle('Nombres')
                .withOption('name', 'name'),
            vm.dtColumnBuilder
                .newColumn(null)
                .withTitle('Actions')
                .withOption('width', '20%')
                .notSortable()
                .renderWith(function(data, type, full, meta) {
                    vm.nested.items[data.id] = data;

                    return `<div class="dt-actions">
                                <button class="btn btn-default" ng-click="vm.events.editAuthor(vm.nested.items[${ data.id }]);">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="btn btn-danger" ng-click="vm.events.deleteAuthor(vm.nested.items[${ data.id }]);">
                                    <i class="fa fa-trash-o"></i>
                                </button>
                            </div>`;
                })
        ];

        vm.nested.reloadData = vm.fnDatatables.reloadData;
    }

    deleteAuthor(id) {
        this.authorsService.deleteAuthor(id)
            .then(response => {
                if(evalResponse(response)){
                    this.nested.reloadData(true, {});
                }
            });
    }

    openModal(data){
        const modalInstance = this.uibModal.open({
          templateUrl: 'modalFormAuthor.html',
          controller: 'AuthorsModalController',
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

AuthorsController.$inject = ['$scope', 'SweetAlert' , '$uibModal', 'AuthorsService', 'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', 'bsLoadingOverlayService'];

export default AuthorsController;