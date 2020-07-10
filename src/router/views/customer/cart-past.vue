<script>
    import HorizontalTopbar from "@/components/customer-topbar";
    import HorizontalNav from "@/components/customer-nav";
    import RightBar from "@/components/right-bar";
    import Footer from "@/components/footer";
    import factory from "@/services/factory";
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
                objectShipInfor: {
                    consignee: '',
                    tel: '',
                    address: ''
                },
                selectedShip: 'sea',
                optionsShip: [
                    { item: 'sea', name: 'Đường biển' },
                    { item: 'air', name: 'Đường bay' },
                ],
                selectShipInfor: '',
                shipInforGrid: []
            };
        },
        created () {
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
            },
        },
        methods: {
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
                    this.selectShipInfor = result[0].id;
                });
            },
            openModalShip(){
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
            save(){
                orderRepository.create({
                    shipment_method_id: this.selectedShip,
                    shipment_infor_id: this.selectShipInfor,
                    type: 'retail'
                }).then(()=>{
                    this.$bvToast.toast('Thay đổi thành công', {
                        title: `Thông báo`,
                        variant: 'success',
                        solid: true
                    })
                });
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
                        <h3></h3>
                        <div class="card">
                            <div class="card-body">

                                <div class="row">
                                            <div class="col-auto">
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
                                <div class="row">
                                    <div class="col-auto" >
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
                                <div class="row">
                                    <div class="col-8">
                                        <b-button pill variant="success" class="mr-2" @click="save">Lưu</b-button>
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
                title="Thêm địa chỉ ship"
                title-class="font-18"
                hide-footer
        >
            <div>
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Tên</th>
                        <th scope="col">SĐT</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col" class="text-center">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">0</th>
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
                        <td><b-button class="btn-success" :disabled="!consigneeState || !telState || !addressState" @click="saveAddress">Lưu</b-button></td>
                    </tr>
                    <tr v-for="(item,index) in shipInforGrid" :key="item.value">
                        <td>
                            {{index +1}}
                        </td>
                        <td>
                            {{item.consignee}}
                        </td>
                        <td>
                            {{item.tel}}
                        </td>
                        <td>
                            {{item.address}}
                        </td>
                        <td>
                            <b-button class="btn-danger" @click="removeAddress(item.value)">Xóa</b-button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="d-flex justify-content-center mt-3">
                <!--                <b-button class="btn-success mr-3" style="color: black !important;" @click="configDelete(object.id)">Đồng ý</b-button>-->
                <!--                <b-button class="btn-danger" style="color: black !important;" @click="hideModal">Hủy</b-button>-->
            </div>

        </b-modal>
    </div>
</template>
