<script>
    import Layout from "../../layouts/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";
    import Pagination from "@/components/Pagination";
    const orderRepository = factory.get('order');
    export default {
        page: {
            title: "Order List",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader , pagination: Pagination,},
        data() {
            return {
                orderGridData: [],
                object: {},
                filter: null,
                title: "Danh sách đơn hàng",
                selectSearch: '',
                optiopSearch: [
                    { value: '', text: '' },
                    { value: 'id', text: 'Jancode' },
                    { value: 'customer_id', text: 'Khách hàng' },
                    { value: 'shipment_method_id', text: 'Vận chuyển' },
                ],
                pathCreateOrder: 'retail',
                paginations: {
                    total: 0,
                    perPage: 15,
                    toTalPage: 0,
                    currentPage: 1,
                }
            };
        },
        created(){
            this.changeParam();

        },
        watch:{
            $route() {
                this.changeParam();
            }
        },
        methods: {
            changeParam(){
                const path = this.$route.path.toString();
                if(path.includes('retail')){
                    this.getList('Retail',this.selectSearch, this.filter, this.paginations.currentPage);
                    this.pathCreateOrder='retail';
                }else if(path.includes('wholesale')){
                    this.getList('Wholesale',this.selectSearch, this.filter, this.paginations.currentPage);
                    this.pathCreateOrder='create-wholesale';
                }else if(path.includes('auction')){
                    this.getList('Auction',this.selectSearch, this.filter, this.paginations.currentPage);
                    this.pathCreateOrder='create-auction';
                }else if(path.includes('paymentpartner')){
                    this.getList('PaymentPartner',this.selectSearch, this.filter, this.paginations.currentPage);
                    this.pathCreateOrder='create-payment';
                }else if(path.includes('shippingpartner')){
                    this.getList('ShippingPartner',this.selectSearch, this.filter, this.paginations.currentPage);
                    this.pathCreateOrder='create-shipping';
                }
            },
            async getList(path,type,key,page){
                if(this.selectSearch){
                    await orderRepository.all("search=director.type.id:"+path+";"+type+":"+key+"&searchJoin=and&page="+page).then((data)=>{
                        this.orderGridData = [];
                        this.orderGridData = data.data.data;
                        const result = data.data;
                        this.paginations.toTalPage = Math.ceil(result.total/this.paginations.perPage);
                        this.paginations.total = result.total;
                        // eslint-disable-next-line no-console
                        console.log("paginations  ", this.paginations);
                    });
                }else {
                    await orderRepository.all("search="+path+"&searchFields=director.type.id&page="+page).then((data)=>{
                        this.orderGridData = [];
                        this.orderGridData = data.data.data;
                        const result = data.data;
                        this.paginations.toTalPage = Math.ceil(result.total/this.paginations.perPage);
                        this.paginations.total = result.total;
                        // eslint-disable-next-line no-console
                        console.log("paginations  ", this.paginations);
                    });
                }

            },
            showToast(val, mes){
                this.$bvToast.toast(mes, {
                    title: `Thông báo`,
                    variant: val,
                    solid: true
                });
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
                orderRepository.delete(id).then(()=>{
                    this.hideModal();
                    this.showToast('success','Xóa thành công');
                    this.changeParam()
                }).catch((error)=>{
                    // eslint-disable-next-line no-console
                    if (error.response.status == 422) {
                        this.showToast('danger','Không thể xóa');
                        this.hideModal();
                    }
                });
            },
            searchKey(){
                this.changeParam();
            },
            onPageChange(page) {
                this.paginations.currentPage = page;
                this.changeParam();
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
                            <div class="col-sm-8">
                                <div class="text-sm-right">
                                    <router-link v-if="pathCreateOrder!='retail'" tag="button" :to="pathCreateOrder" class="btn btn-success btn-rounded mb-2 mr-2"><i class="mdi mdi-plus mr-1"></i>Tạo đơn</router-link>
                                </div>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table mb-0">
                                <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã đơn hàng</th>
                                    <th>Khách hàng</th>
                                    <th>Vận chuyển</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in orderGridData" :key="item.id">
                                    <td>
                                        {{index + 1}}
                                    </td>
                                    <td>{{item.id}}</td>
                                    <td>{{item.customer_id}}</td>

                                                                        <td>
                                                                            <span class="badge badge-pill badge-info" v-if="item.shipment_method_id=='sea'">Đường biển</span>
                                                                            <span class="badge badge-pill badge-secondary" v-if="item.shipment_method_id=='air'">Đường bay</span>
                                                                        </td>
                                    <td>
                                        <ul class="list-inline">
                                            <li style="font-size: 15px">
                                                <router-link tag="a" :to="'/order/' + item.id"><i class="fas fa-pencil-alt text-success mr-1"></i>  </router-link>
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

