<script>
    import HorizontalTopbar from "@/components/customer-topbar";
    import HorizontalNav from "@/components/customer-nav";
    import RightBar from "@/components/right-bar";
    import Footer from "@/components/footer";
    import factory from "@/services/factory";
    const orderRepository = factory.get('order');
    const productRepository = factory.get('products');
    const logRepository = factory.get('log');
    const transactionRepository = factory.get('transaction');
    export default {
        components: {
            HorizontalTopbar,
            HorizontalNav,
            Footer,
            RightBar
        },
        data() {
            return {
                orderGridData: [],
                objectOrder: {
                    id: '',
                    status:{id: ''},
                    cost: {tax: 0,
                        balance: 0,
                        discount_tax_percent: 0,
                        sub_total:0},
                    shipment_infor: {consignee: '',
                        address:'',
                        tel:''},
                },
                productGridData: [],
                logGridData: [],
                transitionGrid: [],
                object: {},
                contentLog: '',
                title: "Đơn hàng",
                transitionObject: {}
            };
        },
        created () {
            const id = this.$route.params.id;
            if(id){
                orderRepository.get(id,"with=items.tracking;cost;shipmentInfor").then((data)=>{
                    const objectData = data.data || {};
                    this.objectOrder = data.data || {};
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
                                    console.log("array  ", array);
                                }
                            });
                        });
                    }
                });
                this.getLog(id);
                this.getTransition(id);
            }
            document.body.setAttribute("data-layout", "horizontal");
            document.body.setAttribute("data-topbar", "dark");
            document.body.removeAttribute("data-sidebar", "dark");
            document.body.removeAttribute("data-layout-size", "boxed");
        },
        methods: {
            getLog(id){
                logRepository.all("search=logable_type:App%2FEntities%2FOrder;logable_id:"+id).then((result)=>{
                    this.logGridData = [];
                    this.logGridData = result.data || [];
                    this.logGridData.forEach(value => {
                        value.content = JSON.parse(value.content);
                    });
                });
            },
            getTransition(id){
                transactionRepository.all('search=receipts.receiptable_id:'+id+';receipts.receiptable_type:App%2FEntities%2FOrder&searchJoin=and').then((data)=>{
                    this.transitionGrid = data.data.data;
                    // eslint-disable-next-line no-console
                    console.log("transactionRepository  ", data);
                });
            },
            toggleRightSidebar() {
                document.body.classList.toggle("right-bar-enabled");
            },
            hideRightSidebar() {
                document.body.classList.remove("right-bar-enabled");
            },
            sendLog(){
                var objectLog = {
                    content: this.contentLog,
                    logable_type: "App%2FEntities%2FOrder",
                    logable_id: this.objectOrder.id.toString()
                };
                logRepository.create(objectLog).then(()=>{
                    this.contentLog = '';
                    this.getLog(this.objectOrder.id);
                });
            },
        }
    };
</script>

<template>
    <div>
        <!-- Begin page -->
        <div>
            <HorizontalTopbar />
            <HorizontalNav />
            <!-- ============================================================== -->
            <!-- Start right Content here -->
            <!-- ============================================================== -->
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <h3>Chi tiết đơn hàng</h3>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title mb-1">Thông tin đơn hàng</h5>
                                        <div class="card-body">
                                            <table class="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th scope="col">Mã đơn hàng</th>
                                                    <th scope="col">Khách hàng</th>
                                                    <th scope="col">Trạng thái</th>
                                                    <th>Vận chuyển</th>
                                                    <th scope="col" v-if="objectOrder.note">Ghi chú</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td class="font-weight-bold text-center">{{objectOrder.id}}</td>
                                                    <td class="font-weight-bold text-center">{{objectOrder.customer_id}}</td>
                                                    <td class="font-weight-bold text-center">
                                                        <span class="badge badge-pill badge-success ml-2" v-if="objectOrder.status.id=='Purchased'"> Đã mua hàng</span>
                                                        <span class="badge badge-pill badge-success ml-2" v-if="objectOrder.status.id=='Paid'"> Đã thanh toán</span>
                                                        <span class="badge badge-pill badge-success ml-2" v-if="objectOrder.status.id=='Finish'"> Đã xong</span>
                                                        <span class="badge badge-pill badge-info ml-2" v-if="objectOrder.status.id=='Pending'"> Chờ duyệt</span>
                                                    </td>
                                                    <td>
                                                        <span class="badge badge-pill badge-info" v-if="objectOrder.shipment_method_id=='sea'">Đường biển</span>
                                                        <span class="badge badge-pill badge-secondary" v-if="objectOrder.shipment_method_id=='air'">Đường bay</span>
                                                    </td>
                                                    <td class="font-weight-bold text-center" v-if="objectOrder.note">{{objectOrder.note}}</td>


                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Chi phí</h5>
                                        <div class="card-body">
                                            <table class="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th scope="col">Thuế</th>
                                                    <th scope="col">Số dư</th>
                                                    <th scope="col">Chiết khấu</th>
                                                    <th scope="col">Tổng</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td class="font-weight-bold text-center">{{objectOrder.cost.tax}}</td>
                                                    <td class="font-weight-bold text-center">{{objectOrder.cost.balance}}</td>
                                                    <td class="font-weight-bold text-center">{{objectOrder.cost.discount_tax_percent}}</td>
                                                    <td class="font-weight-bold text-center">{{objectOrder.cost.sub_total}}</td>
                                                </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row" v-if="productGridData.length">
                            <div class="col-lg-12">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Danh sách sản phẩm</h5>
                                        <div class="card-body">
                                            <div class="table-responsive table-bordered">
                                                <table class="table mb-0">
                                                    <thead>
                                                    <tr>
<!--                                                        <th>STT</th>-->
                                                        <th>Sản phẩm</th>
                                                        <th>Giá</th>
                                                        <th>Số lượng</th>
                                                        <th>Tổng tiền</th>
                                                        <th>Nhà cung cấp</th>
                                                        <th>Tracking</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr v-for="(item) in productGridData" :key="item.id">
<!--                                                        <td>-->
<!--                                                            {{index + 1}}-->
<!--                                                        </td>-->
                                                        <td width="50%">{{item.name_product}}</td>
                                                        <td width="10%">
                                                      {{item.price}}
                                                        </td>
                                                        <td width="10%">
                                                         {{item.quantity.toLocaleString()}}
                                                        </td>
                                                        <td>{{item.amount.toLocaleString()}}</td>
                                                        <td>{{item.supplier_id}}</td>
                                                        <td class="text-center">
                                                            <div v-for="track in item.tracking" :key="track.id">
                                                                <span class="badge badge-success" v-if="track.checked">{{track.id}}</span>
                                                                <span class="badge badge-secondary" v-else>{{track.id}}</span>
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
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="card" style="height: 350px">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Phát sinh giao dịch</h5>

                                        <div class="card-body">
                                            <div class="table-responsive table-bordered">
                                                <table class="table mb-0">
                                                    <thead>
                                                    <tr>
                                                        <th>STT</th>
                                                        <th>Khách hàng</th>
                                                        <th>Tiền</th>
                                                        <th>Mô tả</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr v-for="(item,index) in transitionGrid" :key="item.id">
                                                        <td>
                                                            {{index + 1}}
                                                        </td>
                                                        <td>{{item.user_id}}</td>
                                                        <td>{{item.amount.toLocaleString()}}</td>
                                                        <td>{{item.description}}</td>
                                                    </tr>

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="card" style="height: 350px">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Nhật ký cập nhật</h5>

                                        <div class="card-body">
                                            <div style="overflow-y:scroll; height: 200px">
                                                <div v-for="log in logGridData" :key="log.id" class="item">
                                                    <span class="font-weight-bold">{{log.creator_id}} </span>
                                                    <span class="mr-2 ml-2">{{log.created_at |formatDate}} </span>
                                                    <span class="mr-5" v-if="log.content.product_id">Cập nhật mã sản phẩm: {{log.content.product_id}}</span>
                                                    <span class="mr-5" v-if="log.content.sub_total">Cập nhật tiền hàng {{log.content.sub_total}}</span>
                                                    <span class="mr-5" v-if="log.content.status">Cập nhật trạng thái {{log.content.status}}</span>
                                                    <span class="mr-5" v-if="log.content.wrote">Ghi chú {{log.content.wrote}}</span>
                                                    <a href="javascript:;" style="display: none" class="show-item"><i class="fas fa-trash-alt text-danger mr-1"></i> </a>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="input-group mb-3 mt-3">
                                                    <b-form-input
                                                            v-model="contentLog"
                                                            v-on:keyup.enter="sendLog"
                                                            trim
                                                    ></b-form-input>
                                                    <div class="input-group-append">
                                                        <button class="btn btn-primary" type="button" @click="sendLog" :disabled="!contentLog">Gửi</button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="card" style="height: 200px">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Thông tin giao hàng</h5>
                                        <div class="card-body">
                                            <p><span>Người nhận:</span> <span style="font-size: 15px;" class="ml-2">{{objectOrder.shipment_infor.consignee}}</span></p>
                                            <p><span>Địa chỉ:</span><span style="font-size: 15px;" class="ml-2">{{objectOrder.shipment_infor.address}}</span></p>
                                            <p><span>SĐT:</span><span style="font-size: 15px;" class="ml-2">{{objectOrder.shipment_infor.tel}}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="card" style="height: 200px">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Đơn vận chuyển</h5>
                                        <div class="card-body">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- container-fluid -->
                </div>
                <!-- End Page-content -->

                <Footer />
            </div>
            <!-- end main content-->
        </div>
        <!-- END layout-wrapper -->
        <RightBar />
    </div>
</template>
