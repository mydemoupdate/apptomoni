<style>
    .trash-list:hover{
        cursor: pointer;
        color: red !important;
    }
    item:hover .show-item{
        display: block;
    }
    .remove-track{
        display: none;
    }
    .track:hover .remove-track{
        display: contents;
    }
</style>
<script>
    import Layout from "../layout/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";
    const purchaseRepository = factory.get('purchase');
    const productRepository = factory.get('products');
    const orderRepository = factory.get('order');
    const supplierRepository = factory.get('supplier');
    export default {
        page: {
            title: "Order Detail",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader },
        data() {
            return {
                objectOrder: {
                    id: '',
                    status:{id: ''},
                    cost: {tax: 0,
                        balance: 0},
                    shipment_infor: {consignee: ''}
                },
                productGridData: [],
                title: "Đơn hàng",
                objectTrack: {},
                purchaseObject: {},
                supplierObject: {},
            };
        },
        computed: {},
        created(){
            this.getList();
        },
        methods: {
            getList(){
                const id = this.$route.params.id;
                if(id){
                    purchaseRepository.get(id,"with=items.product.tracking").then((data)=>{
                        const objectData = data.data || {};
                        // eslint-disable-next-line no-console
                        console.log("objectData------------ ", objectData);
                        this.purchaseObject = data.data || {};
                        if(objectData.items.length>0){
                            var arrProduct = objectData.items|| [];
                            arrProduct.forEach((value,i, array) => {
                                productRepository.get(value.product_id).then((data)=>{
                                    var name = '';
                                    const dataProduct = data.data;
                                    if(dataProduct.name.ja){
                                        name = dataProduct.name.ja;
                                    }else if(dataProduct.name.vi){
                                        name = dataProduct.name.vi;
                                    }else if(dataProduct.name.en){
                                        name = dataProduct.name.en;
                                    }
                                    value['name_product']=name;
                                    if(i == array.length -1){
                                        this.productGridData = array;
                                        // eslint-disable-next-line no-console
                                        console.log("this.productGridData  ", this.productGridData);
                                    }
                                });

                            });

                        }
                        // eslint-disable-next-line no-console
                        console.log("objectData.supplier_id  ", objectData.supplier_id);
                        supplierRepository.get(objectData.supplier_id).then((su)=>{
                            this.supplierObject = su.data || {};
                            // eslint-disable-next-line no-console
                            console.log("supplierObject  ", this.supplierObject);
                        });
                    });
                }
            },
            showModalTrackingDetail(id){
                orderRepository.getTracking(id).then((data)=>{
                    this.objectTrack = data.data || {};
                    // eslint-disable-next-line no-console
                    console.log(data);
                    this.$refs['modal-tracking-detail'].show();
                });
            },
            updateProduct(id,val,key){
                // eslint-disable-next-line no-console
                console.log(id);
                if(key=='price'){
                    purchaseRepository.updateItem({price:val},id).then(()=>{
                    });
                }else {
                    purchaseRepository.updateItem({quantity:val},id).then(()=>{
                    });
                }
            },
        }
    };
</script>

<template>
    <Layout>
        <PageHeader :title="title"  />
        <div class="row">
                    <div class="col-lg-4">
                        <div class="card" style="height: 230px;">
                            <div class="card-body">
                                <h5 class="card-title mb-1">Thông tin đơn mua hàng</h5>
                                <div class="card-body">
                                    <p class="font-weight-bold"><span>Người mua:</span><span style="font-size: 15px;" class="ml-2"> {{purchaseObject.buyer_id}}</span>   </p>
                                    <p>
                                        <span class="font-weight-bold" >Trạng thái: </span>
                                        <span class="badge badge-pill badge-success ml-2" v-if="purchaseObject.type_id=='inquiry'"> Đã mua hàng</span>
                                        <span class="badge badge-pill badge-success ml-2" v-if="purchaseObject.type_id=='Paid'"> Đã thanh toán</span>
                                    </p>
                                    <p><span class="font-weight-bold"></span>	</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="card" style="height: 230px">
                            <div class="card-body">
                                <h5 class="card-title">Thông tin nhà cung cấp</h5>

                                <div class="card-body font-weight-bold">
                                    <p ><span >Tên:</span><span style="font-size: 15px;" class="ml-2"> {{supplierObject.name}}</span></p>
                                    <p><span>Email:</span><span style="font-size: 15px;" class="ml-2"> {{supplierObject.email}}</span></p>
                                    <p><span>Địa chỉ:</span><span style="font-size: 15px;" class="ml-2"> {{supplierObject.address}}</span></p>
                                    <p><span>Link:</span> <b-link :href="supplierObject.link">{{supplierObject.link}}</b-link></p>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title mb-4">Danh sách sản phẩm</h5>
                        <div class="card-body">
                            <div class="table-responsive table-bordered">
                                <table class="table mb-0">
                                    <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Jancode</th>
                                        <th>Sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Tracking</th>

                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(item,index) in productGridData" :key="item.id">
                                        <td width="10%">
                                            {{index + 1}}
                                        </td>
                                        <td>{{item.product_id}}</td>
                                        <td width="30%">{{item.name_product}}</td>
                                        <td width="10%">
                                            <b-form-input
                                                    v-model="item.price" type="number"
                                                    v-on:keyup.enter="updateProduct(item.product_id,item.price,'price')">
                                            </b-form-input>
                                        </td>
                                        <td width="10%">
                                            <b-form-input
                                                    v-model="item.quantity" type="number"
                                                    v-on:keyup.enter="updateProduct(item.product_id,item.quantity,'quantity')">
                                            </b-form-input>

                                        </td>
                                        <td>
                                            <div v-if="item.product.tracking.length">
                                                 <span v-for="track in item.product.tracking" :key="track.id">
                                                <span class="badge badge-success" v-if="track.checked" @click="showModalTrackingDetail(track.id)">{{track.id}}</span>
                                                <span class="badge badge-secondary" v-else @click="showModalTrackingDetail(track.id)">{{track.id}}</span>
                                            </span>
                                            </div>
                                            <div v-else>
                                                <span></span>
                                            </div>

                                        </td>
                                    </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <b-modal
                ref="modal-tracking-detail"
                size="sm"
                title="Chi tiết Tracking"
                title-class="font-18"
                hide-footer
                scrollable
        >
            <div class="container-fluid">
                <p><span class="font-weight-bold">Mã tracking:</span> {{objectTrack.id}}</p>
                <p><span class="font-weight-bold">Phí vận chuyển:</span> {{objectTrack.pick_up_charge}}</p>
                <p><span class="font-weight-bold">Trạng thái: </span>
                    <span class="badge badge-success" v-if="objectTrack.checked">Đã về kho</span>
                    <span class="badge badge-secondary" v-if="!objectTrack.checked">Chưa về kho</span>
                </p>
                <p><span class="font-weight-bold" v-if="objectTrack.expected_delivery">Ngày nhận hàng:</span> {{objectTrack.expected_delivery | formatDate}}</p>
                <p><span class="font-weight-bold" v-if="objectTrack.payment_due_date">Hạn thanh toán:</span> {{objectTrack.payment_due_date | formatDate}}</p>
            </div>
        </b-modal>
    </Layout>

</template>


