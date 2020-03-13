import { loadingOverlay } from '../../utils/Common';
import { evalResponse } from '../../utils/Response';
import AuthorsFormTemplate from './authors-form/authors-form.template.html';
import Datatables from '../../utils/Datatables';

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
        this.datatablesHelper = new Datatables('nested', $scope, $compile);
    }

    $onInit() {
        this.title = 'Authors';
    
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

        this.loadDatatables();
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
                                    url:  API_URL_V1 + 'authors',
                                    type: 'GET',
                                    beforeSend: () => {
                                        loadingOverlay.show(this.loadingOverlayService, 'loading-dt-authors');
                                    },
                                    data: (d) => {
                                        d.listFormat = 'datatables';

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

                                        loadingOverlay.hide(this.loadingOverlayService, 'loading-dt-authors');
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
                .newColumn('name')
                .withTitle('Nombres')
                .withOption('name', 'name'),
            this.dtColumnBuilder
                .newColumn(null)
                .withTitle('Actions')
                .withOption('width', '20%')
                .notSortable()
                .renderWith((data, type, full, meta) => {
                    let vm = this;
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

        this.nested.reloadData = this.datatablesHelper.reloadData;
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
          template: AuthorsFormTemplate,
          controller: 'AuthorsFormController',
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