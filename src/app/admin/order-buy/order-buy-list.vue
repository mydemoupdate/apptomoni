<script>
    import Layout from "../layouts/main";
    import PageHeader from "@/components/page-header";
    import Pagination from "@/components/Pagination";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";
    const purchaseRepository = factory.get('purchase');
    export default {
        page: {
            title: "Order List",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader, pagination: Pagination },
        data() {
            return {
                object: {},
                purchaseGridData: [],
                filter: null,
                title: "Danh sách đơn mua hàng",
                selectSearch: '',
                optiopSearch: [
                    { value: '', text: '' },
                    { value: 'supplier_id', text: 'Nhà cc' },
                    { value: 'id', text: 'Jancode' },
                    { value: 'buyer_id', text: 'Khách hàng' },
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
        watch:{
        },
        methods: {
            async getList(type,key,page){
                if(type){
                    await purchaseRepository.all('search='+type+':'+key+"&page="+page).then((data)=>{
                        this.purchaseGridData = data.data.data;
                        const result = data.data;
                        this.paginations.toTalPage = Math.ceil(result.total/this.paginations.perPage);
                        this.paginations.total = result.total;
                    });
                }else {
                    await purchaseRepository.all('page='+page).then((data)=>{
                        this.purchaseGridData = data.data.data;
                        const result = data.data;
                        this.paginations.toTalPage = Math.ceil(result.total/this.paginations.perPage);
                        this.paginations.total = result.total;
                    });
                }

            },
            openModalTrash(obj){
                this.object = obj;
                // eslint-disable-next-line no-console
                console.log("supplier  ", this.object);
                this.$refs['modal-sm-trash'].show();
            },
            hideModal() {
                this.$refs['modal-sm-trash'].hide()
            },
            configDelete(id){
                purchaseRepository.delete(id).then(()=>{
                    this.hideModal();
                    this.showToast('success','Xóa thành công');
                    this.getList();
                }).catch((error)=>{
                    // eslint-disable-next-line no-console
                    if (error.response.status == 422) {
                        this.showToast('danger','Không thể xóa');
                        this.hideModal();
                    }
                });
            },
            searchKey(){
                this.getList(this.selectSearch, this.filter, this.paginations.currentPage);
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
                            <!-- end col-->
                        </div>

                        <div class="table-responsive">
                            <table class="table mb-0">
                                <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã đơn hàng</th>
                                    <th>Nhà CC</th>
                                    <th>Khách hàng</th>
                                    <th>Loại</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in purchaseGridData" :key="item.id">
                                    <td>
                                        {{index + 1}}
                                    </td>
                                    <td>{{item.id}}</td>
                                    <td>{{item.supplier_id}}</td>
                                    <td>{{item.buyer_id}}</td>
                                    <td>{{item.type_id}}</td>
                                    <td>
                                        <ul class="list-inline">
                                            <li style="font-size: 15px">
                                                <router-link tag="a" :to="'/order-buy/' + item.id"><i class="fas fa-pencil-alt text-success mr-1"></i>  </router-link>
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
                <h3>Bạn có muốn xóa đơn:  {{object.id}}</h3>
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

