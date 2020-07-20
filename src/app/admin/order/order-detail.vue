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
    tr .item-product:hover{
        background: aliceblue;
        cursor: pointer;
    }
</style>
<script>
    import Layout from "../layout/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";
    const orderRepository = factory.get('order');
    const productRepository = factory.get('products');
    const logRepository = factory.get('log');
    const transactionRepository = factory.get('transaction');
    const purchaseRepository = factory.get('purchase');
    const shipmentRepository = factory.get('shipment');
    const supplierRepository = factory.get('supplier');
    const taxesRepository = factory.get('taxes');

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
                        balance: 0,
                        discount_tax_percent: 0,
                        sub_total:0},
                    shipment_infor: {consignee: '',
                        address:'',
                        tel:''},
                    type: {id: ''}
                },
                productGridData: [],
                logGridData: [],
                object: {},
                contentLog: '',
                title: "Chi tiết đơn hàng",
                transitionGrid: [],
                IDItemOrderTrack: '',
                IdTracking: '',
                pick_up_charge: 0,
                expected_delivery: null,
                payment_due_date: null,
                objectTrack: {},
                purchaseObject: {},
                productPurchaseGrid: [],
                statusOrder: [],
                statusSelect: '',
                objectShipInfor: {
                    consignee: '',
                    tel: '',
                    address: ''
                },
                objectProduct: {
                    name_product: '',
                    id: ''
                },
                productGrid: [],
                objectOrderItem:{
                    price: 0,
                    quantity: 1,
                    properties: '',
                    link: '',
                    note: '',
                    taxesSelect: '',
                    taxesGrid: [],
                    is_box: false
                },
                supplierGrid: [],
                selectSupplier: '',
                selectedShip: 'sea',
                optionsShip: [
                    { item: 'sea', name: 'Đường biển' },
                    { item: 'air', name: 'Đường bay' },
                ],
                selectShipInfor:'',
                shipInforGrid: []
            };
        },
        computed: {
            filteredResources (){
                if(this.objectProduct.name_product){
                    return this.productGrid.filter((item)=>{
                        return item.name_product.startsWith(this.objectProduct.name_product);
                    })
                }else{
                    return this.productGrid;
                }
            },
            nameState() {
                return this.objectProduct.id !='' ? true : false;
            },
            logState(){
                return this.contentLog.length > 0 ? true : false;
            },
            IDState() {
                return this.IdTracking.length > 0 ? true : false;
            },
            pickUpChargeState() {
                return Number(this.pick_up_charge) >= 0 && this.pick_up_charge !='' ? true : false;
            },
            addressState() {
                return this.objectShipInfor.address.length > 0 ? true : false;
            },
            consigneeState() {
                return this.objectShipInfor.consignee.length > 0 ? true : false;
            },
            telState() {
                return this.objectShipInfor.tel.length > 0 ? true : false;
            },
            priceState() {
                return this.objectOrderItem.price >= 0 ? true : false;
            },
            quantityState() {
                return this.objectOrderItem.quantity > 0 ? true : false;
            }
        },
        created(){
            this.getList();
            this.getSupplier();
            this.getProduct();
            this.getShipInfor();
            this.getTaxes();
        },
        methods: {
            getList(){
                const id = this.$route.params.id;
                if(id){
                    orderRepository.get(id,"with=items.purchase.items;items.tracking;cost;shipmentInfor").then((data)=>{
                        const objectData = data.data || {};
                        this.objectOrder = data.data || {};
                        this.statusSelect= objectData.status.id;
                        if(this.objectOrder.shipment_method_id){
                            this.selectedShip=this.objectOrder.shipment_method_id;
                        }
                        if (this.objectOrder.shipment_infor){
                            this.selectShipInfor=this.objectOrder.shipment_infor.id;
                        }
                        this.statusOrder = [];
                        this.statusOrder.push({value:this.statusSelect,text: objectData.status.name.vi });
                        const steps = objectData.steps || [];
                        steps.forEach(value => {
                            orderRepository.getStatus(value).then((result)=>{
                                const results = result.data || {};
                                this.statusOrder.push({value:results.id,text: results.name.vi });
                                // eslint-disable-next-line no-console
                                console.log('statusOrder:  ',this.statusOrder);
                            });
                        });
                        if(objectData.items.length>0){
                            // eslint-disable-next-line no-console
                            console.log("purchase  ", objectData.items[0].purchase);
                            if(objectData.items[0].purchase){
                                this.purchaseObject = objectData.items[0].purchase;
                                this.purchaseObject['order_item']=objectData.items[0].id;
                                if(objectData.items[0].purchase.items.length>0){
                                    const arr = objectData.items[0].purchase.items || [];
                                    arr.forEach((value,i, array)  => {
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
                                                this.productPurchaseGrid = array;
                                            }
                                        });
                                    });
                                }
                            }
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
                                    }
                                });

                            });

                        }
                    });

                    this.getLog(id);
                    this.getTransition(id);
                }
            },
            getTaxes(){
                taxesRepository.all().then((result)=>{
                    const data = result.data || [];
                    data.forEach(value => {
                        this.objectOrderItem.taxesGrid.push({
                            value: value.percent,
                            text: value.percent
                        })
                    });
                    this.objectOrderItem.taxesSelect = data[0].percent;
                });
            },
            getLog(id){
                logRepository.all("search=logable_type:App%2FEntities%2FOrder;logable_id:"+id).then((result)=>{
                    this.logGridData = [];
                    this.logGridData = result.data || [];
                    this.logGridData.forEach(value => {
                        value.content = JSON.parse(value.content);
                    });
                    // eslint-disable-next-line no-console
                    console.log('resu:  ',result.data);
                });
            },
            getTransition(id){
                transactionRepository.all('search=receipts.receiptable_id:'+id+';receipts.receiptable_type:App\\Entities\\Order&searchJoin=and').then((data)=>{
                    this.transitionGrid = data.data.data;
                    // eslint-disable-next-line no-console
                    console.log("transactionRepository  ", data);
                });
            },
            getShipInfor(){
                shipmentRepository.all().then((ship)=>{
                    const result = ship.data.data || [];
                    this.shipInforGrid = [];
                    result.forEach(value => {
                        this.shipInforGrid.push({
                            value: value.id,
                            text: value.address + " - "+ value.consignee,
                            address: value.address,
                            consignee: value.consignee,
                            tel: value.tel
                        })
                    });

                });
            },
            showToast(val, mes){
                this.$bvToast.toast(mes, {
                    title: `Thông báo`,
                    variant: val,
                    solid: true
                })
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
            updateProduct(id,val,key){
                // eslint-disable-next-line no-console
                console.log(val," update price  ", id,key);
                if(key=='price'){
                    orderRepository.updateOrderItem({price:val},id).then(()=>{
                    });
                }else {
                    orderRepository.updateOrderItem({quantity:val},id).then(()=>{
                    });
                }
                this.showToast("success", "Cập nhật thành công");

            },
            getSupplier(){
                supplierRepository.all().then((su)=>{
                    const result = su.data.data || [];
                    result.forEach(value => {
                        this.supplierGrid.push({
                            value: value.id,
                            text: value.name
                        })
                    });
                    this.selectSupplier = result[0].id;
                });
            },
            showModalForm(id){
                this.IDItemOrderTrack = id;
                this.IdTracking= '';
                this.pick_up_charge=0;
                this.$refs['modal-form'].show();
            },
            hideModal() {
                this.$refs['modal-form'].hide();
            },
            addTracking(){
                var objectTrack= {
                    id: this.IdTracking,
                    pick_up_charge: this.pick_up_charge
                };
                if(this.expected_delivery!=null){
                    objectTrack['expected_delivery']=this.expected_delivery;
                }
                if(this.payment_due_date){
                    objectTrack['payment_due_date']=this.payment_due_date;
                }
                orderRepository.createTracking(objectTrack).then(()=>{
                    orderRepository.createTrackItem({
                        tracking_id: this.IdTracking,
                        item_id: this.IDItemOrderTrack
                    }).then(()=>{
                        this.getList();
                        this.$refs['modal-form'].hide();
                        this.IdTracking= '';
                        this.pick_up_charge=0;
                    })
                })
            },
            deleteTrack(id){
                orderRepository.deleteTrack(id).then(()=>{
                    this.getList();
                });
            },
            showModalTrackingDetail(id){
                orderRepository.getTracking(id).then((data)=>{
                    this.objectTrack = data.data || {};
                    // eslint-disable-next-line no-console
                    console.log(data);
                    this.$refs['modal-tracking-detail'].show();
                });
            },
            updatePurchase(val,key){
                // this.purchaseObject['order_item']
                // eslint-disable-next-line no-console
                console.log(val,key,this.purchaseObject);
                if(key=='price'){
                    purchaseRepository.updateItem({price:val},this.purchaseObject.order_item).then(()=>{
                        this.getList();
                        this.showToast("success", "Cập nhật thành công");
                    });
                }else {
                    purchaseRepository.updateItem({quantity:val},this.purchaseObject.order_item).then(()=>{
                        this.getList();
                        this.showToast("success", "Cập nhật thành công");
                    });
                }

            },
            saveAddress(){
                shipmentRepository.create(this.objectShipInfor).then(()=>{
                    this.objectShipInfor.consignee = '';
                    this.objectShipInfor.address = '';
                    this.objectShipInfor.tel = '';
                    this.getShipInfor();
                });
            },
            removeAddress(id){
                shipmentRepository.delete(id).then(()=>{
                    this.getShipInfor();
                });
            },
            addItem(){
                this.$refs['modal-product-item'].show();
            },
            productChange(object){
                // eslint-disable-next-line no-console
                console.log("object  ", this.objectProduct );
                this.objectProduct.id = object.id;
                this.objectProduct.name_product = object.name_product;
            },
            getProduct(){
                productRepository.all().then((product)=>{
                    this.productGrid = product.data.data || [];
                    this.productGrid.forEach(value => {
                        if(value.name.ja){
                            value['name_product'] = value.name.ja;
                        }else if(value.name.vi){
                            value['name_product'] = value.name.vi;
                        }else if(value.name.en){
                            value['name_product'] = value.name.en;
                        }
                    });
                });
            },
            saveProductItem(){
                var object = {
                    product_id: this.objectProduct.id,
                    price: this.objectOrderItem.price,
                    quantity: this.objectOrderItem.quantity,
                    supplier_id: this.selectSupplier,
                    link: this.objectOrderItem.link,
                    note: this.objectOrderItem.note,
                    tax_percent: this.objectOrderItem.taxesSelect,
                    is_box: this.objectOrderItem.is_box,
                    order_id: this.objectOrder.id
                };
                orderRepository.updateOrderItemProduct(object).then(()=>{
                    this.showToast("success", "Thêm sản phẩm thành công");
                    this.getList();
                    this.$refs['modal-product-item'].hide();
                    this.refreshForm();
                }).catch((error) => {
                    // eslint-disable-next-line no-console
                    if (error.response.status == 422) {
                        this.showToast("danger", "Sản phẩm đã tồn tại");
                    }
                });
            },
            changeAddress(){
                shipmentRepository.get(this.selectShipInfor).then((result)=>{
                    const data = result.data;
                    this.objectOrder.shipment_infor.consignee  = data.consignee;
                    this.objectOrder.shipment_infor.address  = data.address;
                    this.objectOrder.shipment_infor.tel  = data.tel;
                });
            },
            saveChangeOrder(){
                orderRepository.update({
                    shipment_method_id: this.selectedShip,
                    shipment_infor_id: this.selectShipInfor
                },this.objectOrder.id).then(()=>{
                    orderRepository.updateState(this.objectOrder.id,{status:this.statusSelect}).then(()=>{
                        this.showToast("success", "Đã thay đổi");
                        this.getList();
                    });

                })
            },
            newForm(){
                this.refreshForm();
            },
            refreshForm(){
                this.objectProduct.id = '';
                this.objectProduct.name_product = '';
                this.objectOrderItem.note = '';
                this.objectOrderItem.link = '';
                this.objectOrderItem.properties = '';
                this.objectOrderItem.price = 0;
                this.objectOrderItem.quantity = 1;
                this.objectOrderItem.is_box = false;
                this.objectOrderItem.taxesSelect= this.objectOrderItem.taxesGrid[0].percent;
                this.selectSupplier = this.supplierGrid[0].value;
            },
            openModalEditOrder(){
                this.$refs['modal-form-order-edit'].show();
            },
            hideModalEditOrder(){
                this.$refs['modal-form-order-edit'].hide();
            },
            openModalHistoryOrder(){
                this.$refs['modal-history-order'].show();
            },
            openModalTransitionOrder(){
                this.$refs['modal-transition-order'].show();
            }
        }
    };
</script>

<template>
    <Layout>
        <PageHeader />
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <div class="col">
                            <div class="float-left">
                                <!--                                <h3>Danh sách sản phẩm</h3>-->
                                <p class="mb-2 font-weight-bold">
                                    Đơn hàng:
                                    <span class="text-primary">#{{objectOrder.id}}</span>
                                </p>
                                <p class="mb-2 font-weight-bold">
                                    Trạng thái:
                                    <span class="badge badge-pill badge-success ml-2" v-if="objectOrder.status.id=='Purchased'"> Đã mua hàng</span>
                                    <span class="badge badge-pill badge-success ml-2" v-if="objectOrder.status.id=='Paid'"> Đã thanh toán</span>
                                    <span class="badge badge-pill badge-success ml-2" v-if="objectOrder.status.id=='Finish'"> Đã xong</span>
                                    <span class="badge badge-pill badge-info ml-2" v-if="objectOrder.status.id=='Pending'"> Chờ duyệt</span>
                                    <span class="badge badge-pill badge-info ml-2" v-if="objectOrder.status.id=='Cancelled'"> Đã hủy</span>
                                </p>
                                <p class="mb-2 font-weight-bold">
                                    Khách hàng:
                                    <span class="text-primary">{{objectOrder.customer_id}}</span>
                                </p>
                                <!--                                <p class="mb-2 font-weight-bold">-->
                                <!--                                    Vận chuyển:-->
                                <!--                                    <span class="badge badge-pill badge-info" v-if="objectOrder.shipment_method_id=='sea'">Đường biển</span>-->
                                <!--                                    <span class="badge badge-pill badge-secondary" v-if="objectOrder.shipment_method_id=='air'">Đường bay</span>-->
                                <!--                                </p>-->

                            </div>
                            <div class="float-right" v-if="objectOrder.type.id=='PaymentPartner' || objectOrder.type.id=='ShippingPartner'">
                                <span class="bg-success text-white" style="cursor: pointer" @click="addItem"><i class="mdi mdi-plus"></i></span>
                            </div>
                        </div>
                        <div class="card-body pt-2 pl-0 pr-0">
                            <div class="table-responsive table-bordered">
                                <table class="table mb-0">
                                    <thead>
                                    <tr>
                                        <th>Jancode</th>
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
                                        <td>{{item.product_id}}</td>
                                        <td width="30%">{{item.name_product}}</td>
                                        <td width="12%">
                                            <b-form-input
                                                    v-model="item.price" type="number"
                                                    v-on:keyup.enter="updateProduct(item.id,item.price,'price')">
                                            </b-form-input>
                                        </td>
                                        <td width="10%">
                                            <b-form-input
                                                    v-model="item.quantity" type="number"
                                                    v-on:keyup.enter="updateProduct(item.id,item.quantity,'quantity')">
                                            </b-form-input>
                                        </td>
                                        <td>{{item.amount}}</td>
                                        <td>{{item.supplier_id}}</td>
                                        <td class="text-center">
                                            <div v-for="track in item.tracking" :key="track.id" class="track" style="cursor: pointer">
                                                <span class="badge badge-success" v-if="track.checked" @click="showModalTrackingDetail(track.id)">{{track.id}}</span>
                                                <span class="badge badge-secondary" v-else @click="showModalTrackingDetail(track.id)">{{track.id}}</span>
                                                <!--                                                <a class="remove-track" @click="deleteTrack(track.id)"><i class="fa fa-times" style="font-size: 10px; color: red;margin-left: 3px; cursor: pointer"></i></a>-->
                                            </div>
                                            <!--                                            <span class="badge badge-success text-center" style="cursor: pointer" @click="showModalForm(item.id)"><i class="fa fa-plus"></i></span>-->
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="col" colspan="6" class="text-right">Thuế</th>
                                        <th class="font-weight-bold text-center">{{objectOrder.cost.tax}}</th>

                                    </tr>
                                    <tr>
                                        <th scope="col" colspan="6" class="text-right">Số dư</th>
                                        <th class="font-weight-bold text-center">{{objectOrder.cost.balance}}</th>

                                    </tr>
                                    <tr>

                                        <th colspan="6" class="text-right">Chiết khấu</th>
                                        <th class="font-weight-bold text-center">{{objectOrder.cost.discount_tax_percent}}</th>
                                    </tr>
                                    <tr>

                                        <th colspan="6" class="text-right">Tổng</th>
                                        <th class="font-weight-bold text-center">{{objectOrder.cost.sub_total}}</th>
                                    </tr>
                                    <tr>
                                        <th colspan="7">
                                            <b-button variant="success" @click="openModalEditOrder">Sửa đơn</b-button>
                                            <b-button variant="success" class="ml-2 mr-2" @click="openModalHistoryOrder">Nhật ký đơn</b-button>
                                            <b-button v-if="transitionGrid.length" variant="success" class="mr-2" @click="openModalTransitionOrder">Phát sinh gao dịch</b-button>
                                            <b-button variant="success">Đơn vận chuyển</b-button>
                                        </th>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

<!--        <div class="row" v-if="purchaseObject.id">-->
<!--            <div class="col-lg-6">-->
<!--                <div class="card">-->
<!--                    <div class="card-body">-->
<!--                        <h5 class="card-title">Thông tin đơn mua hàng </h5>-->
<!--                        <div class="card-body">-->
<!--                            <p><span class="font-weight-bold">Nhà cung cấp:</span> {{purchaseObject.supplier_id}}</p>-->
<!--                            <p><span class="font-weight-bold">Người mua hàng:</span> {{purchaseObject.buyer_id}}</p>-->
<!--                            <p><span class="font-weight-bold">Loại:</span> {{purchaseObject.type_id}}</p>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="col-lg-6">-->
<!--                <div class="card">-->
<!--                    <div class="card-body">-->
<!--                        <h5 class="card-title">Sản phẩm</h5>-->
<!--                        <div class="card-body">-->
<!--                            <div class="table-responsive table-bordered">-->
<!--                                <table class="table mb-0">-->
<!--                                    <thead>-->
<!--                                    <tr>-->
<!--                                        <th>STT</th>-->
<!--                                        <th>Sản phẩm</th>-->
<!--                                        <th>Giá</th>-->
<!--                                        <th>Số lượng</th>-->
<!--                                    </tr>-->
<!--                                    </thead>-->
<!--                                    <tbody>-->
<!--                                    <tr v-for="(item,index) in productPurchaseGrid" :key="item.id">-->
<!--                                        <td>-->
<!--                                            {{index + 1}}-->
<!--                                        </td>-->
<!--                                        <td width="50%">{{item.name_product}}</td>-->
<!--                                        <td><b-form-input-->
<!--                                                v-model="item.price" type="number"-->
<!--                                                v-on:keyup.enter="updatePurchase(item.price,'price')">-->
<!--                                        </b-form-input></td>-->
<!--                                        <td><b-form-input-->
<!--                                                v-model="item.quantity" type="number"-->
<!--                                                v-on:keyup.enter="updatePurchase(item.quantity,'quantity')">-->
<!--                                        </b-form-input></td>-->
<!--                                    </tr>-->

<!--                                    </tbody>-->
<!--                                </table>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->

        <b-modal
                ref="modal-form"
                size="lg"
                title="Tracking"
                title-class="font-18"
                hide-footer
                scrollable
        >
            <div>
                <div class="row">
                    <div class="col-md-6">
                        <b-form-group label="Mã tracking:">
                            <b-form-input
                                    type="text"
                                    required
                                    v-model="IdTracking"
                                    :state="IDState"
                                    placeholder="Mã tracking"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                                Không để trống
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </div>
                    <div class="col-md-6">
                        <b-form-group
                                label="Phí vận chuyển:">
                            <b-form-input
                                    type="number"
                                    required
                                    v-model="pick_up_charge"
                                    :state="pickUpChargeState"
                                    placeholder="Phí vận chuyển"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                                Không để trống
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <b-form-group
                                label="Ngày nhận hàng:"
                        >
                            <b-form-datepicker
                                    :date-format-options="{day: 'numeric', month: 'numeric', year: 'numeric' }"
                                    v-model="expected_delivery"
                                    locale="en"></b-form-datepicker>
                        </b-form-group>
                    </div>
                    <div class="col-md-6">
                        <b-form-group
                                label="Hạn thanh toán:"
                        >
                            <b-form-datepicker
                                    :date-format-options="{day: 'numeric', month: 'numeric', year: 'numeric' }"
                                    v-model="payment_due_date"
                                    locale="en"></b-form-datepicker>
                        </b-form-group>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-end mt-3">
                <b-button class="btn-success mr-1" style="color: black !important;" @click="addTracking">Thêm</b-button>
                <b-button class="btn-danger" style="color: black !important;" @click="hideModal">Hủy</b-button>
            </div>
        </b-modal>
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
        <b-modal
                ref="modal-product-item"
                size="lg"
                title="Thêm sản phẩm"
                title-class="font-18"
                hide-footer
                scrollable
        >
            <div class="container-fluid">

                <div class="row">
                    <div class="col-md-12">
                        <b-form-group label-cols="5" label-cols-lg="2" label="Sản phẩm" label-for="input-default">
                            <b-form-input v-model="objectProduct.name_product"
                                          :state="nameState"></b-form-input>
                            <div class="panel-body" style="max-height: 100px;overflow-y: scroll;">
                                <table v-if="productGrid.length" class="table">
                                    <thead>
                                    <tr>
                                        <th>Danh sách sản phẩm</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="item in filteredResources" :key="item.id">
                                        <td class="item-product" @click="productChange(item)"><a >{{item.name_product}}</a></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </b-form-group>
                    </div>

                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div class="col-6">
                                <b-form-group label-cols="5" label-cols-lg="4" label="Giá" label-for="input-default">
                                    <b-form-input v-model="objectOrderItem.price" type="number"
                                                  :state="priceState"></b-form-input>
                                </b-form-group>
                            </div>
                            <div class="col-4">
                                <b-form-group label-cols="5" label-cols-lg="5" label="Số lượng" label-for="input-default">
                                    <b-form-input v-model="objectOrderItem.quantity" type="number"
                                                  :state="quantityState"></b-form-input>
                                </b-form-group>
                            </div>
                            <div class="col-2 mt-2">
                                <b-form-checkbox
                                        v-model="objectOrderItem.is_box"
                                >
                                    Hộp
                                </b-form-checkbox>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div class="col-6">
                                <b-form-group label-cols="5" label-cols-lg="4" label="Nhà cung cấp" label-for="input-default">
                                    <b-form-select v-model="selectSupplier" :options="supplierGrid"></b-form-select>
                                </b-form-group>
                            </div>
                            <div class="col-4">
                                <b-form-group label-cols="5" label-cols-lg="3" label="Thuế" label-for="input-default">
                                    <b-form-select v-model="objectOrderItem.taxesSelect" :options="objectOrderItem.taxesGrid"></b-form-select>
                                </b-form-group>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div class="col-6">
                                <b-form-group label-cols="5" label-cols-lg="4" label="Đường dẫn" label-for="input-default">
                                    <b-form-input v-model="objectOrderItem.link"></b-form-input>
                                </b-form-group>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="row">
                    <div class="col-12">
                        <b-form-group label-cols="5" label-cols-lg="2" label="Mô tả" label-for="input-default">
                            <b-form-textarea
                                    placeholder="Enter something..."
                                    rows="3"
                                    max-rows="6"
                                    v-model="objectOrderItem.note"
                            ></b-form-textarea>
                        </b-form-group>
                    </div>
                </div>

                <div class="row">
                    <div class="col-8 d-flex justify-content-center">
                        <b-button :disabled='!nameState || !priceState || !quantityState' @click="saveProductItem" pill variant="success" class="mr-2">Lưu</b-button>
                        <b-button pill variant="primary" @click="newForm">Thêm mới</b-button>

                    </div>
                </div>
            </div>
        </b-modal>
        <b-modal
                ref="modal-form-order-edit"
                size="lg"
                title="Thay đổi đơn hàng"
                title-class="font-18"
                hide-footer
                scrollable
        >
            <div class="container-fluid">

                <div class="row">
                    <div class="col-7" style="border-right: 1px solid red">
                        <div class="row">
                            <div class="col-12">
                                <b-form-group label-cols="5" label-cols-lg="3" label="Vận chuyển:">
                                    <b-form-radio-group
                                            v-model="selectedShip"
                                            :options="optionsShip"
                                            class="mt-2"
                                            value-field="item"
                                            text-field="name"
                                    ></b-form-radio-group>
                                </b-form-group>
                            </div>

                        </div>
                        <div class="row">
                            <div class="col-12">
                                <b-form-group label-cols="5" label-cols-lg="3" label="Địa chỉ:">
                                    <b-form-select v-model="selectShipInfor" :options="shipInforGrid" @change="changeAddress"></b-form-select>
                                </b-form-group>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <b-form-group label-cols="5" label-cols-lg="3" label="Trạng thái:">
                                    <b-form-select v-model="statusSelect" :options="statusOrder"></b-form-select>
                                </b-form-group>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <p><span class="font-weight-bold">Người nhận:</span> <span style="font-size: 15px;" class="ml-2">{{objectOrder.shipment_infor.consignee}}</span></p>
                        <p><span class="font-weight-bold">Địa chỉ:</span><span style="font-size: 15px;" class="ml-2">{{objectOrder.shipment_infor.address}}</span></p>
                        <p><span class="font-weight-bold">SĐT:</span><span style="font-size: 15px;" class="ml-2">{{objectOrder.shipment_infor.tel}}</span></p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-8 d-flex justify-content-center">
                        <b-button pill variant="success" class="mr-2" @click="saveChangeOrder">Lưu</b-button>
                        <b-button pill variant="primary" @click="hideModalEditOrder">Đóng</b-button>
                    </div>
                </div>
            </div>
        </b-modal>
        <b-modal
                ref="modal-history-order"
                size="lg"
                title="Nhật ký đơn hàng"
                title-class="font-18"
                hide-footer
                scrollable
        >
            <div class="container-fluid">

                <div style="overflow-y:scroll; height: 90%">
                    <div v-for="log in logGridData" :key="log.id" class="item">
                        <span class="font-weight-bold">{{log.creator_id}} </span>
                        <span class="mr-2 ml-2">{{log.created_at |formatDate}} </span>
                        <span class="mr-5" v-if="log.content.product_id">Cập nhật mã sản phẩm: {{log.content.product_id}}</span>
                        <span class="mr-5" v-if="log.content.sub_total">Cập nhật tiền hàng {{log.content.sub_total}}</span>
                        <span class="mr-5" v-if="log.content.status">Cập nhật trạng thái {{log.content.status}}</span>
                        <span class="mr-5" v-if="log.content.wrote">Ghi chú {{log.content.wrote}}</span>
                        <!--                                    <span class="mr-5" v-else>{{log.content}}</span>-->

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
                            <button class="btn btn-primary" type="button" @click="sendLog" :disabled="!logState">Gửi</button>
                        </div>
                    </div>

                </div>
            </div>
        </b-modal>
        <b-modal
                ref="modal-transition-order"
                size="lg"
                title="Phát sinh giao dịch"
                title-class="font-18"
                hide-footer
                scrollable
        >
            <div class="container-fluid">
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
        </b-modal>
    </Layout>

</template>




