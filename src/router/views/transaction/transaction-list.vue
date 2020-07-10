<script>
    import Layout from "../../layouts/main";
    import PageHeader from "@/components/page-header";
    import Pagination from "@/components/Pagination";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";
    const transactionRepository = factory.get('transaction');
    // const transactionTypeRepository = factory.get('transactiontype');
    export default {
        page: {
            title: "Transaction List",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader, pagination: Pagination },
        data() {
            return {
                transactionGridData: [],
                object: {name: {ja: null}},
                perPage: 10,
                pageOptions: [10, 25, 50, 100],
                filter: null,
                title: "Danh sách giao dịch",
                selectSearch: '',
                optiopSearch: [
                    { value: '', text: '' },
                    { value: 'user_id', text: 'Khách hàng' },
                    { value: 'amount', text: 'Tiền' },
                    { value: 'prepared_by_id', text: 'Người thực hiện' },
                    { value: 'type_id', text: 'Loại giao dịch' },
                ],
                paginations: {
                    total: 0,
                    perPage: 15,
                    toTalPage: 0,
                    currentPage: 1,
                }
            };
        },
        created(){
            this.getList('','',this.paginations.currentPage);
        },
        methods: {
            async getList(type,key,page){
                if(type){
                    await transactionRepository.all('search='+type+':'+key+"&page="+page).then((data) => {
                        this.transactionGridData = data.data.data;
                        const result = data.data;
                        this.paginations.toTalPage = Math.ceil(result.total/this.paginations.perPage);
                        this.paginations.total = result.total;
                    });
                }else {
                    await transactionRepository.all('page='+page).then((data) => {
                        this.transactionGridData = data.data.data;
                        const result = data.data;
                        this.paginations.toTalPage = Math.ceil(result.total/this.paginations.perPage);
                        this.paginations.total = result.total;
                    });
                }


            },
            showToast(val, mes){
                this.$bvToast.toast(mes, {
                    title: `Thông báo`,
                    variant: val,
                    solid: true
                })
            },
            openModalTrash(obj){
                this.object = obj;
                this.$refs['modal-sm-trash'].show();
            },
            hideModal() {
                this.$refs['modal-sm-trash'].hide()
            },
            configDelete(id){
                transactionRepository.delete(id).then(()=>{
                    this.hideModal();
                    this.showToast('success','Xóa thành công');
                    this.getList();
                });
            },
            searchKey(){
                this.getList(this.selectSearch, this.filter,this.paginations.currentPage);
            },
            onPageChange(page) {
                this.paginations.currentPage = page;
                this.getList(this.selectSearch, this.filter, this.paginations.currentPage);
            }
        }
    };
</script>

<template>
    <Layout>
        <PageHeader :title="title"  />
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">

                        <div class="row mb-2">
                            <div class="col-sm-4">
                                <div class="search-box mr-2 mb-2 d-inline-block">
                                    <div class="position-relative">
                                        <b-form-group>
                                            <b-input-group>
                                                <template v-slot:append>
                                                    <b-form-select v-model="selectSearch" :options="optiopSearch"></b-form-select>
                                                </template>
                                                <b-form-input v-model="filter" v-on:keyup.enter="searchKey"></b-form-input>
                                                <i class="bx bx-search-alt search-icon"></i>
                                            </b-input-group>
                                        </b-form-group>
                                    </div>
                                </div>
                            </div>
<!--                            <div class="col-sm-8">-->
<!--                                <div class="text-sm-right">-->
<!--                                    <router-link tag="button" to="create" class="btn btn-success btn-rounded mb-2 mr-2"><i class="mdi mdi-plus mr-1"></i>Thêm mới</router-link>-->

<!--                                </div>-->
<!--                            </div>-->
                            <!-- end col-->
                        </div>

                        <div class="table-responsive">
                            <table class="table mb-0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Khách hàng</th>
                                    <th>Số tiền</th>

                                    <th>Người thực hiện</th>
                                    <th>Loại giao dịch</th>
                                    <th>Mô tả</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in transactionGridData" :key="item.id">
                                    <td>
                                        {{index + 1}}
                                    </td>
                                    <td>{{item.user_id}}</td>
                                    <td>{{item.amount.toLocaleString()}}</td>
                                    <td>{{item.prepared_by_id}}</td>
                                    <td>{{item.type_id}}</td>
                                    <td>{{item.description}}</td>
                                    <td>
                                        <ul class="list-inline">
                                            <li>
                                                <router-link tag="a" :to="'detail/' + item.id"><i class="fas fa-pencil-alt text-success mr-1"></i>  </router-link>
                                                <a href="javascript:;" v-on:click="openModalTrash(item)"><i class="fas fa-trash-alt text-danger mr-1"></i> </a>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <pagination
                                    :total-pages="paginations.toTalPage"
                                    :total="paginations.total"
                                    :per-page="paginations.perPage"
                                    :current-page="paginations.currentPage"
                                    @pagechanged="onPageChange"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <b-modal
                ref="modal-sm-trash"
                size="sm"
                title="Thông báo"
                title-class="font-18"
                hide-footer
        >
            <div>
                <h3>Bạn có muốn xóa:  </h3>
            </div>
            <div class="d-flex justify-content-center mt-3" >
                <b-button class="btn-success mr-3"  @click="configDelete(object.id)">Đồng ý</b-button>
                <b-button class="btn-danger" @click="hideModal">Hủy</b-button>
            </div>

        </b-modal>
    </Layout>

</template>
<style>
    .trash-list:hover{
        cursor: pointer;
        color: red !important;
    }
</style>

