<style>
    .inputGroup {
        background-color: #fff;
        display: block;
        margin: 10px 0;
        position: relative;
    }

    .inputGroup label {
        padding: 12px 30px;
        width: 100%;
        display: block;
        text-align: left;
        color: #3C454C;
        cursor: pointer;
        position: relative;
        z-index: 2;
        transition: color 200ms ease-in;
        overflow: hidden;}

    .inputGroup:before {
         width: 10px;
         height: 10px;
         border-radius: 50%;
         content: '';
         background-color: #5562eb;
         position: absolute;
         left: 50%;
         top: 50%;
         transform: translate(-50%, -50%) scale3d(1, 1, 1);
         transition: all 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
         opacity: 0;
         z-index: -1;
     }

    .inputGroup:after {
         width: 32px;
         height: 32px;
         content: '';
         border: 2px solid #D1D7DC;
         /*background-color: #fff;*/
         background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.414 11L4 12.414l5.414 5.414L20.828 6.414 19.414 5l-10 10z' fill='%23fff' fill-rule='nonzero'/%3E%3C/svg%3E ");
         background-repeat: no-repeat;
         background-position: 2px 3px;
         border-radius: 50%;
         z-index: 2;
         position: absolute;
         right: 30px;
         top: 50%;
         transform: translateY(-50%);
         cursor: pointer;
         transition: all 200ms ease-in;
     }


    .inputGroup input:checked ~ label {
        color: #fff;
    }
    .inputGroup input:before {
         transform: translate(-50%, -50%) scale3d(56, 56, 1);
         opacity: 1;
     }

    .inputGroup input:after {
         background-color: #54E0C7;
         border-color: #54E0C7;
     }


    .inputGroup input {
        width: 32px;
        height: 32px;
        order: 1;
        z-index: 2;
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        visibility: hidden;
    }
    .inputGroup {
        background-color: #fff;
        display: block;
        margin: 10px 0;
        position: relative;
    }
    .inputGroup label {
        padding: 12px 30px;
        width: 100%;
        display: block;
        text-align: left;
        color: #3c454c;
        cursor: pointer;
        position: relative;
        z-index: 2;
        transition: color 200ms ease-in;
        overflow: hidden;
    }
    .inputGroup label:before {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        content: '';
        background-color: #5562eb;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale3d(1, 1, 1);
        transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        z-index: -1;
    }
    .inputGroup label:after {
        width: 32px;
        height: 32px;
        content: '';
        border: 2px solid #d1d7dc;
        background-color: #fff;
        background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.414 11L4 12.414l5.414 5.414L20.828 6.414 19.414 5l-10 10z' fill='%23fff' fill-rule='nonzero'/%3E%3C/svg%3E ");
        background-repeat: no-repeat;
        background-position: 2px 3px;
        border-radius: 50%;
        z-index: 2;
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        transition: all 200ms ease-in;
    }
    .inputGroup input:checked ~ label {
        color: #fff;
    }
    .inputGroup input:checked ~ label:before {
        transform: translate(-50%, -50%) scale3d(56, 56, 1);
        opacity: 1;
    }
    .inputGroup input:checked ~ label:after {
        background-color: #54e0c7;
        border-color: #54e0c7;
    }
    .inputGroup input {
        width: 32px;
        height: 32px;
        order: 1;
        z-index: 2;
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        visibility: hidden;
    }

</style>
<script>
    import HorizontalTopbar from "@/components/customer-topbar";
    import HorizontalNav from "@/components/customer-nav";
    import RightBar from "@/components/right-bar";
    import Footer from "@/components/footer";
    import factory from "@/services/factory";
    const cartRepository = factory.get('cart');
    const productRepository = factory.get('products');
    const shipmentRepository = factory.get('shipment');
    const orderRepository = factory.get('order');


    /**
     * Horizontal-layout
     */
    export default {
        components: {
            HorizontalTopbar,
            HorizontalNav,
            Footer,
            RightBar
        },
        data() {
            return {
                cartGridData: [],
                selectedShip: 'sea',
                optionsShip: [
                    { item: 'sea', name: 'Đường biển' },
                    { item: 'air', name: 'Đường bay' },
                ],
                selectShipInfor: '',
                shipInforGrid: [],
                checkFormAddress: false,
                checkShipMe: true,
                objectShipInfor: {
                    consignee: '',
                    tel: '',
                    address: ''
                },
                checkFormInputAddress: false
            };
        },
        created () {
            this.getList('');
            this.getShipInfor();
            document.body.setAttribute("data-layout", "horizontal");
            document.body.setAttribute("data-topbar", "dark");
            document.body.removeAttribute("data-sidebar", "dark");
            document.body.removeAttribute("data-layout-size", "boxed");
        },
        watch:{
        },
        computed: {
            addressState() {
                return this.objectShipInfor.address.length > 0 ? true : false;
            },
            consigneeState() {
                return this.objectShipInfor.consignee.length > 0 ? true : false;
            },
            telState() {
                return this.objectShipInfor.tel.length > 0 ? true : false;
            }
        },
        methods: {
            async getList(path){
                await cartRepository.all("search="+path).then((data)=>{
                    const result = data.data.data || [];
                    result.forEach((value,i, array) => {
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
                            value['img']=dataProduct.images;
                            if(i == array.length -1){
                                this.cartGridData = array;
                                // eslint-disable-next-line no-console
                                console.log("cartGridData  ", this.cartGridData);
                            }
                        });

                    });
                    // eslint-disable-next-line no-console
                    console.log("cartGridData  ", this.cartGridData);
                });
            },
            getShipInfor(){
                shipmentRepository.all().then((ship)=>{
                    const result = ship.data.data || [];
                    this.shipInforGrid = result;
                });
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
            createOrder(idAddress){
                var object = {
                    shipment_method_id: this.checkShipMe?'air':'sea',
                    shipment_infor_id: idAddress,
                    type: 'retail'
                };
                orderRepository.create(object).then((result)=>{
                    var ID = result.data.id;
                    this.$router.push({path: `/order-detail/${ID}`})
                });
            },
            step(){
                this.checkFormAddress = true;
                // eslint-disable-next-line no-console
                console.log(this.checkShipMe);
            },
            addAddress(){
                this.checkFormInputAddress = true;
            },
            cancelAddress(){
                this.checkFormInputAddress = false;
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
                    <div class="container-fluid">
                        <div class="row" v-if="!checkFormAddress && cartGridData.length">
                            <div class="col-8" >
                                <div class="card">
                                    <div class="card-body" >

                                        <div class="row">
                                            <div><h3>Giỏ hàng <span style="    font-weight: 100;
            font-size: 14px;">({{cartGridData.length}} sản phẩm)</span></h3></div>
                                        </div>
                                        <div class="row mt-2">


                                            <div class="row" v-for="(item) in cartGridData" :key="item.id">
                                                <div class="col-md-2 col-sm-2">
                                                    <b-img src="https://salt.tikicdn.com/cache/200x200/ts/product/2f/81/da/22663b6a8d47104571c17692331b17da.jpg" fluid></b-img>
                                                </div>
                                                <div class="col-md-7 col-sm-7">
                                                    <div class="">
                                                        <div class="">
                                                            <a class="" href="">{{item.name_product}}</a>
                                                            <p class="">
                                                                <span>Mã đơn: </span>
                                                                <a href="">{{item.id}}</a>
                                                            </p>

                                                            <span class="">Cung cấp bởi
                                                                    <a href="" class="cart-products__seller-name">null</a>
                                                                </span>
                                                            <p class="">
                                                                <span class="text-danger">Xóa</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-3">

                                                    <div class="d-flex">
                                                        <div class="float-right mt-2 mr-5"> <span>54.313đ</span></div>

                                                        <div class="float-right">
                                                            <b-form-input
                                                                    v-model="item.quantity"
                                                                    type="number"
                                                            ></b-form-input>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="card">
                                    <div class="card-body">

                                        <div class="col-12">
                                            <div class="inputGroup">
                                                <input id="radio1" name="radio" type="radio" v-model="checkShipMe" value="true"/>
                                                <label for="radio1">Vận chuyển đường bay</label>
                                            </div>
                                            <div class="inputGroup">
                                                <input id="radio2" name="radio" type="radio" v-model="checkShipMe" value="false"/>
                                                <label for="radio2">Vậy chuyển đường biển</label>
                                            </div>
                                        </div>
                                       <div class="col-12 mt-5">
                                           <b-button block  variant="danger" @click="step">Đặt hàng</b-button>
                                       </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                        <div v-if="checkFormAddress">
                            <div class="row">
                                <div class="col-md-4" v-for="item in shipInforGrid" :key="item.id">
                                    <b-card>
                                        <b-card-title>
                                            <h5 class="card-title">{{item.user_id}}</h5>
                                        </b-card-title>
                                        <b-card-text>Địa chỉ: {{item.address}}</b-card-text>
                                        <b-card-text>Điện thoại: {{item.tel}}</b-card-text>
                                        <b-button href="javascript: void(0);" variant="outline-info" class="mr-1" @click="createOrder(item.id)">Giao đến địa chỉ này</b-button>
                                        <b-button href="javascript: void(0);" variant="outline-danger" @click="removeAddress(item.id)">Xóa</b-button>
                                    </b-card>
                                </div>
                            </div>

                            <div class="row">
                                <b-button href="javascript: void(0);" variant="success" @click="addAddress"><i class="fa fa-plus"></i> Thêm địa chỉ</b-button>
                            </div>
                        </div>
                        <div class="row mt-2" v-if="checkFormAddress && checkFormInputAddress">
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
                                                <b-button class="outline-danger mr-2" @click="cancelAddress">Hủy</b-button>
                                                <b-button class="btn-success" :disabled="!consigneeState || !telState || !addressState" @click="saveAddress">Lưu</b-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="card-body" v-if="cartGridData.length<=0">
                            <h3 class="text-center">Chưa có sản phẩm nào</h3>
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
