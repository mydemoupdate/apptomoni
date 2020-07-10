<script>
    import Layout from "../../../layouts/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";
    const orderRepository = factory.get('order');
    export default {
        page: {
            title: "Order List",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader },
        data() {
            return {
                orderGridData: [],
                object: {},
                filter: null,
                title: "Danh sách đơn hàng"
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
                    this.getList('Retail');
                }else if(path.includes('wholesale')){
                    this.getList('Wholesale');
                }else if(path.includes('auction')){
                    this.getList('Auction');
                }else if(path.includes('paymentpartner')){
                    this.getList('PaymentPartner');
                }else if(path.includes('shippingpartner')){
                    this.getList('ShippingPartner');
                }
                this.getList('Retail');
            },
            async getList(path){
                await orderRepository.all("search="+path+"&searchFields=director.type.id").then((data)=>{
                    this.orderGridData = data.data.data;
                    // eslint-disable-next-line no-console
                    console.log("orderGridData  ", this.orderGridData);
                });
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
                    this.getList();
                }).catch((error)=>{
                    // eslint-disable-next-line no-console
                    if (error.response.status == 422) {
                        this.showToast('danger','Không thể xóa');
                        this.hideModal();
                    }
                });
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
                                        <input type="text" class="form-control" placeholder="Search..." />
                                        <i class="bx bx-search-alt search-icon"></i>
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
                                    <th>Jancode</th>
                                    <th>Tên SP</th>
                                    <th>Hình</th>
                                    <th>Trạng thái</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in orderGridData" :key="item.id">
                                    <td>
                                        {{index + 1}}
                                    </td>
                                    <td>{{item.id}}</td>
                                    <td>3333</td>
                                    <td>sfsfsfs</td>
                                    <td>#img</td>
                                    <td>
                                       <span class="badge badge-pill badge-info" v-if="item.shipment_method_id=='sea'">Đường biển</span>
                                       <span class="badge badge-pill badge-secondary" v-if="item.shipment_method_id=='air'">Đường bay</span>
                                    </td>
                                    <td>
                                        <ul class="list-inline">
                                            <li style="font-size: 15px">
                                                <router-link tag="a" :to="'detail/' + item.id"><i class="fas fa-pencil-alt text-success mr-1"></i>  </router-link>
                                                <a href="javascript:;" v-on:click="openModalTrash(item)"><i class="fas fa-trash-alt text-danger mr-1"></i> </a>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
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

