<style>
    tr .item-product:hover{
        background: aliceblue;
        cursor: pointer;
    }
</style>
<script>
    import HorizontalTopbar from "@/components/customer-topbar";
    import HorizontalNav from "@/components/customer-nav";
    import RightBar from "@/components/right-bar";
    import Footer from "@/components/footer";
    import factory from "@/services/factory";
    const shipmentRepository = factory.get('shipment');
    const productRepository = factory.get('products');
    const supplierRepository = factory.get('supplier');
    // const cartRepository = factory.get('cart');
    const orderRepository = factory.get('order');
    const taxesRepository = factory.get('taxes');
    export default {
        components: {
            HorizontalTopbar,
            HorizontalNav,
            Footer,
            RightBar
        },
        data() {
            return {
                title: "Tạo đơn hàng",
                selectedShip: 'sea',
                optionsShip: [
                    { item: 'sea', name: 'Đường biển' },
                    { item: 'air', name: 'Đường bay' },
                ],
                selectShipInfor: '',
                shipInforGrid: [],
                productGrid: [],
                objectProduct: {
                    name_product: '',
                    id: ''
                },
                supplierGrid: [],
                selectSupplier: '',
                objectOrder:{
                    price: 0,
                    quantity: 1,
                    link: '',
                    note: '',
                    is_box: false,
                    taxesGrid: [],
                    taxesSelect: ''
                },
                objectShipInfor: {
                    consignee: '',
                    tel: '',
                    address: ''
                },
                typeOrder: 'retail',
                checkFormAddress: false,
                checkFormShip: false,
                checkSea: false,
                checkAir: false
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
            addressState() {
                return this.objectShipInfor.address.length > 0 ? true : false;
            },
            consigneeState() {
                return this.objectShipInfor.consignee.length > 0 ? true : false;
            },
            telState() {
                return this.objectShipInfor.tel.length > 0 ? true : false;
            },
            nameState() {
                return this.objectProduct.name_product.length > 0 ? true : false;
            },
            priceState() {
                return this.objectOrder.price >= 0 ? true : false;
            },
            quantityState() {
                return this.objectOrder.quantity > 0 ? true : false;
            }
        },
        created () {
            this.changeParam();
            this.getShipInfor();
            this.getProduct();
            this.getSupplier();
            this.getTaxes();
            document.body.setAttribute("data-layout", "horizontal");
            document.body.setAttribute("data-topbar", "dark");
            document.body.removeAttribute("data-sidebar", "dark");
            document.body.removeAttribute("data-layout-size", "boxed");
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
                    this.title = "Đơn sỉ";
                    this.typeOrder = 'retail';
                }else if(path.includes('wholesale')){
                    this.title = "Đơn sỉ";
                    this.typeOrder = 'wholesale';
                }else if(path.includes('auction')){
                    this.title = "Đơn đấu giá";
                    this.typeOrder = 'auction';
                }else if(path.includes('payment')){
                    this.title = "Đơn thanh toán hộ";
                    this.typeOrder = 'payment';
                }else if(path.includes('shipping')){
                    this.title = "Đơn thanh chuyển hộ";
                    this.typeOrder = 'shipping';
                }
                // eslint-disable-next-line no-console
                console.log(path,"   typeOrder  ",  this.typeOrder);
            },
            getTaxes(){
                taxesRepository.all().then((result)=>{
                    const data = result.data || [];
                    data.forEach(value => {
                        this.objectOrder.taxesGrid.push({
                            value: value.percent,
                            text: value.percent
                        })
                    });
                    this.objectOrder.taxesSelect = data[0].percent;
                });
            },
            getShipInfor(){
                shipmentRepository.all().then((ship)=>{
                    const result = ship.data.data || [];
                    this.shipInforGrid = result;
                    this.shipInforGrid.forEach(value => {
                        value['value']=value.id;
                        value['text']= value.consignee+' - '+value.address;
                    });
                    this.selectShipInfor = this.shipInforGrid[0].id;
                });
            },
            getProduct(){
                productRepository.all().then((product)=>{
                    this.productGrid = product.data.data || [];
                    // eslint-disable-next-line no-console
                    console.log("productGrid  ", this.productGrid);

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
            getSupplier(){
                supplierRepository.all().then((su)=>{
                    const result = su.data.data || [];
                    result.forEach(value => {
                        this.supplierGrid.push({
                            value: value.id,
                            text: value.name
                        });
                    });
                    this.selectSupplier = result[0].id;
                });
            },
            productChange(object){
                // eslint-disable-next-line no-console
                console.log("object  ", this.objectProduct );
                this.objectProduct.id = object.id;
                this.objectProduct.name_product = object.name_product;
            },
            openModalShip(){
                this.objectShipInfor.consignee = '';
                this.objectShipInfor.address = '';
                this.objectShipInfor.tel = '';
                this.$refs['modal-ship-infor'].show();
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
                // eslint-disable-next-line no-console
                console.log("id  ", id );
                shipmentRepository.delete(id).then(()=>{
                   this.getShipInfor();
                });
            },
            saveCart(){
                var object = {
                    product_id: this.objectProduct.id,
                    price: this.objectOrder.price,
                    quantity: this.objectOrder.quantity,
                    supplier_id: this.selectSupplier,
                    link: this.objectOrder.link,
                    note: this.objectOrder.note,
                    is_box:this.objectOrder.is_box,
                    shipment_method_id: this.selectedShip,
                    shipment_infor_id: this.selectShipInfor,
                    tax_percent: this.objectOrder.taxesSelect,
                    type: this.typeOrder
                };
                orderRepository.create(object).then((result)=>{
                    this.showSucess();
                    var ID = result.data.id;
                    this.$router.push({path: `/order-detail/${ID}`})
                });
            },
            createOrder(){
                    var type = 'shippingPartner';
                    if(this.typeOrder=='payment'){
                        type = 'paymentPartner';
                    }else if(this.typeOrder =='retail'){
                        type ='retail';
                    }
                    var ship = 'sea';
                    if(this.checkAir){
                        ship='air';
                    }
                orderRepository.create({
                    shipment_method_id: ship,
                    shipment_infor_id: this.selectShipInfor,
                    type: type
                }).then((result)=>{

                    this.showSucess();
                    var ID = result.data.id;
                    this.$router.push({path: `/order-detail/${ID}`})
                    // eslint-disable-next-line no-console
                    console.log("ID  ", ID );

                });
            },
            showSucess(){
                this.refreshForm();
                this.$bvToast.toast("Tạo đơn mới thành công", {
                    title: `Thông báo`,
                    variant: 'success',
                    solid: true
                });
            },
            newForm(){
              this.refreshForm();
            },
            refreshForm(){
                this.objectProduct.id = '';
                this.objectProduct.name_product = '';
                this.objectOrder.note = '';
                this.objectOrder.link = '';
                this.objectOrder.price = 0;
                this.objectOrder.quantity = 1;
                this.objectOrder.is_box = false;
                this.selectSupplier = this.supplierGrid[0].value;
                this.selectedShip=  'sea';
                this.objectOrder.taxesSelect= this.objectOrder.taxesGrid[0].value;
            },
            addAddress(){
                this.checkFormAddress = true;
            },
            cancelAddress(){
                this.checkFormAddress = false;
            },
            sendAddress(id){
                this.selectShipInfor = id;
                this.checkFormShip = true;
            },
            toggleRightSidebar() {
                document.body.classList.toggle("right-bar-enabled");
            },
            hideRightSidebar() {
                document.body.classList.remove("right-bar-enabled");
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
                    <div class="container">

                        <div v-if="typeOrder=='retail' || typeOrder=='payment' || typeOrder=='shipping'">
                            <div v-if="checkFormShip">
                                <div class="row">
                                    <h5>Chọn đường vận chuyển</h5>
                                </div>
                                <div class="row" >

                                    <div class="custom-control custom-radio custom-control-inline col-4">
                                        <input type="radio" class="custom-control-input" v-model="checkAir"  id="customRadioInline1" name="customRadioInline1" @click="createOrder">
                                        <label class="custom-control-label" for="customRadioInline1" >
                                            <b-img thumbnail src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Boeing_767-381%28ER%29%2C_All_Nippon_Airways_%28ANA%29_JP6562914.jpg/1200px-Boeing_767-381%28ER%29%2C_All_Nippon_Airways_%28ANA%29_JP6562914.jpg" alt="Image 1"></b-img>

                                        </label>

                                    </div>
                                    <div class="custom-control custom-radio custom-control-inline col-4">
                                        <input type="radio"  class="custom-control-input" v-model="checkSea" id="customRadioInline2" name="customRadioInline1" @click="createOrder">
                                        <label class="custom-control-label" for="customRadioInline2">
                                            <b-img thumbnail src="https://vantaiduongbien.com.vn/upload/detail/2018/08/images/van-chuyen-duong-bien-2(2).jpg" alt="Image 1"></b-img>

                                        </label>

                                    </div>
                                </div>

                            </div>


                            <div v-if="!checkFormShip">
                                <div class="row">
                                    <div class="col-md-4" v-for="item in shipInforGrid" :key="item.id">
                                        <b-card>
                                            <b-card-title>
                                                <h5 class="card-title">{{item.user_id}}</h5>
                                            </b-card-title>
                                            <b-card-text>Địa chỉ: {{item.address}}</b-card-text>
                                            <b-card-text>Điện thoại: {{item.tel}}</b-card-text>
                                            <b-button href="javascript: void(0);" variant="success" class="mr-1" @click="sendAddress(item.id)">Giao đến địa chỉ này</b-button>
                                            <b-button href="javascript: void(0);" variant="danger" @click="removeAddress(item.id)">Xóa</b-button>
                                        </b-card>
                                    </div>
                                </div>

                                <div class="row">
                                    <b-button href="javascript: void(0);" variant="primary" @click="addAddress">Thêm địa chỉ</b-button>
                                </div>
                            </div>

                            <div class="row mt-2" v-if="checkFormAddress && !checkFormShip">
                                <div class="col-md-6 m-auto">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <b-form-group label-cols="4" label-cols-lg="2" label="Tên" label-for="input-default">
                                                        <b-form-input :state="consigneeState"
                                                                      v-model="objectShipInfor.consignee"></b-form-input>
                                                    </b-form-group>
                                                </div>
                                                <div class="col-md-12">
                                                    <b-form-group label-cols="4" label-cols-lg="2" label="SĐT" label-for="input-default">
                                                        <b-form-input
                                                                :state="telState"
                                                                v-model="objectShipInfor.tel"
                                                        ></b-form-input>
                                                    </b-form-group>
                                                </div>
                                                <div class="col-md-12">
                                                    <b-form-group label-cols="4" label-cols-lg="2" label="Địa chỉ" label-for="input-default">
                                                        <b-form-input
                                                                :state="addressState"
                                                                v-model="objectShipInfor.address"
                                                        ></b-form-input>
                                                    </b-form-group>
                                                </div>
                                                <div class="col d-flex justify-content-center">
                                                    <b-button class="btn-secondary mr-2" @click="cancelAddress">Hủy</b-button>
                                                    <b-button class="btn-success" :disabled="!consigneeState || !telState || !addressState" @click="saveAddress">Lưu</b-button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div class="col-md-12 m-auto" v-if="typeOrder!='payment' && typeOrder!='shipping' && typeOrder!='retail'">

                            <div class="card">
                            <div class="card-body">
                                    <div class="row">
                                        <div class="col-9">
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
                                                            <td class="item-product" @click="productChange(item)"><a>{{item.name_product}}</a></td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </b-form-group>
                                        </div>
                                    </div>
                                    <div class="row" v-if="typeOrder!='payment' && typeOrder!='shipping'">
                                        <div class="col-9">
                                            <div class="row">
                                                <div class="col-6">
                                                    <b-form-group label-cols="5" label-cols-lg="4" label="Giá" label-for="input-default">
                                                        <b-form-input v-model="objectOrder.price" type="number"  :state="priceState"></b-form-input>
                                                        <b-form-invalid-feedback>
                                                            Giá lớn hơn 0
                                                        </b-form-invalid-feedback>
                                                    </b-form-group>

                                                </div>
                                                <div class="col-4">
                                                    <b-form-group label-cols="5" label-cols-lg="5" label="Số lượng" label-for="input-default">
                                                        <b-form-input v-model="objectOrder.quantity" type="number" :state="quantityState"></b-form-input>
                                                        <b-form-invalid-feedback>
                                                            Số lượng lớn hơn 0
                                                        </b-form-invalid-feedback>
                                                    </b-form-group>
                                                </div>
                                                <div class="col-2 mt-2">
                                                    <b-form-checkbox
                                                            v-model="objectOrder.is_box"
                                                    >
                                                        Hộp
                                                    </b-form-checkbox>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="row" >
                                        <div class="col-9">
                                            <div class="row">
                                                <div class="col-6" v-if="typeOrder!='payment' && typeOrder!='shipping'">
                                                    <b-form-group label-cols="5" label-cols-lg="4" label="Nhà cung cấp" label-for="input-default">
                                                        <b-form-select v-model="selectSupplier" :options="supplierGrid"></b-form-select>
                                                    </b-form-group>
                                                </div>
                                                <div class="col-6" v-if="typeOrder!='retail'">
                                                    <b-form-group label-cols="5" label-cols-lg="3" label="Địa chỉ ship" label-for="input-default">
                                                        <b-input-group>
                                                            <template v-slot:append>
                                                                <b-input-group-text @click="openModalShip"><strong
                                                                        class="text-primary">Thêm</strong></b-input-group-text>
                                                            </template>
                                                            <b-form-select v-model="selectShipInfor" :options="shipInforGrid"></b-form-select>
                                                        </b-input-group>
                                                    </b-form-group>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                <div class="row mt-2">
                                    <div class="col-9">
                                        <div class="row">
                                            <div class="col-6" v-if="typeOrder!='retail'">
                                                <b-form-group label-cols="5" label-cols-lg="4" label="Vận chuyển" label-for="input-default">
                                                    <b-form-radio-group
                                                            v-model="selectedShip"
                                                            :options="optionsShip"
                                                            class="mt-2"
                                                            value-field="item"
                                                            text-field="name"
                                                            disabled-field="notEnabled"
                                                    ></b-form-radio-group>
                                                </b-form-group>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                    <div class="row" v-if="typeOrder!='payment' && typeOrder!='shipping'">
                                        <div class="col-9">
                                            <div class="row">
                                                <div class="col-6">
                                                    <b-form-group label-cols="5" label-cols-lg="4" label="Đường dẫn" label-for="input-default">
                                                        <b-form-input v-model="objectOrder.link"></b-form-input>
                                                    </b-form-group>
                                                </div>

                                                <div class="col-6">
                                                    <b-form-group label-cols="5" label-cols-lg="4" label="Thuế" label-for="input-default">
                                                        <b-form-select v-model="objectOrder.taxesSelect" :options="objectOrder.taxesGrid"></b-form-select>
                                                    </b-form-group>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                <div class="row" v-if="typeOrder!='payment' && typeOrder!='shipping'">
                                    <div class="col-9">
                                        <b-form-group label-cols="5" label-cols-lg="2" label="Mô tả" label-for="input-default">
                                            <b-form-textarea
                                                    placeholder="Enter something..."
                                                    rows="3"
                                                    max-rows="6"
                                                    v-model="objectOrder.note"
                                            ></b-form-textarea>
                                        </b-form-group>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-8">
                                        <b-button :disabled='!nameState || !priceState || !quantityState' @click="saveCart" pill variant="success" class="mr-2">Lưu</b-button>
                                        <b-button pill variant="primary" @click="newForm" v-if="typeOrder!='shipment' && typeOrder !='payment'">Thêm mới</b-button>
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
        <b-modal
                ref="modal-ship-infor"
                size="lg"
                title="Thêm địa chỉ"
                title-class="font-18"
                hide-footer
                scrollable
        >
            <div class="container">
                <div class="table-responsive table-bordered">
                    <table class="table mb-0">
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên</th>
                            <th>SĐT</th>
                            <th>Địa chỉ</th>
                            <th>#</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                0
                            </td>
                            <td>

                                    <b-form-input :state="consigneeState"
                                                  v-model="objectShipInfor.consignee"></b-form-input>

                            </td>
                            <td>
                                <b-form-input
                                        :state="telState"
                                        v-model="objectShipInfor.tel"
                                ></b-form-input>
                            </td>
                            <td>
                                <b-form-input
                                        :state="addressState"
                                        v-model="objectShipInfor.address"
                                ></b-form-input>
                            </td>
                            <td>
                                <b-button class="btn-success" :disabled="!consigneeState || !telState || !addressState" @click="saveAddress">Lưu</b-button>
                            </td>
                        </tr>
                        <tr v-for="(item,index) in shipInforGrid" :key="item.id">
                            <td>
                                {{index + 1}}
                            </td>
                            <td>{{item.consignee}}</td>
                            <td>{{item.tel}}</td>
                            <td>{{item.address}}</td>
                            <td></td>
                        </tr>

                        </tbody>
                    </table>
                </div>

            </div>
        </b-modal>

    </div>

</template>
