<script>
    import HorizontalTopbar from "@/components/customer-topbar";
    import HorizontalNav from "@/components/customer-nav";
    import RightBar from "@/components/right-bar";
    import Footer from "@/components/footer";
    import factory from "@/services/factory";
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
                orderGridData: [],
                title: '',
                typeOrder: 'retail',
            };
        },
        created () {
            this.changeParam();
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
            async getList(path){
                await orderRepository.all("search="+path+"&searchFields=director.type.id").then((data)=>{
                    this.orderGridData = data.data.data;

                });
            },
            toggleRightSidebar() {
                document.body.classList.toggle("right-bar-enabled");
            },
            hideRightSidebar() {
                document.body.classList.remove("right-bar-enabled");
            },
            changeParam(){
                const path = this.$route.path.toString();
                if(path.includes('retail')){
                    this.title = "Đơn lẻ";
                    this.getList('Retail');
                    this.typeOrder='retail';
                }else if(path.includes('wholesale')){
                    this.title = "Đơn sỉ";
                    this.typeOrder = 'create-wholesale';
                    this.getList('Wholesale');
                }else if(path.includes('auction')){
                    this.title = "Đơn đấu giá";
                    this.typeOrder = 'create-auction';
                    this.getList('Auction');

                }else if(path.includes('paymentpartner')){
                    this.title = "Đơn thanh toán hộ";
                    this.typeOrder = 'create-payment';
                    this.getList('PaymentPartner');

                }else if(path.includes('shippingpartner')){
                    this.title = "Đơn thanh chuyển hộ";
                    this.typeOrder = 'create-shipping';
                    this.getList('ShippingPartner');

                }
            }
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
                        <div class="card">
                            <div class="card-body">
                              <div class="col">
                                  <div class="float-left"><h3>{{title}}</h3></div>
                                  <div class="float-right">
                                      <router-link v-if="typeOrder!='retail'" tag="button" :to="typeOrder" class="btn btn-success btn-rounded"><i class="mdi mdi-plus"></i>Tạo đơn</router-link>
                                  </div>
                              </div>
                                <div class="table-responsive pt-2">
                                    <table class="table mb-0">
                                        <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Mã đơn hàng</th>
                                            <th>Vận chuyển</th>
                                            <th>Khách hàng</th>
                                            <th>Trạng thái</th>
                                            <th>Chi tiết</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(item,index) in orderGridData" :key="item.id">
                                            <td>
                                                {{index + 1}}
                                            </td>
                                            <td>{{item.id}}</td>
                                            <td>
                                                <span class="badge badge-pill badge-info" v-if="item.shipment_method_id=='sea'">Đường biển</span>
                                                <span class="badge badge-pill badge-secondary" v-if="item.shipment_method_id=='air'">Đường bay</span>
                                            </td>
                                            <td>{{item.customer_id}}</td>
                                            <td>{{item.status.name.vi}}</td>
                                            <td>
                                                <router-link tag="a" :to="'/order-detail/' + item.id"><i style="font-size: 20px" class="fas fa-eye"></i>  </router-link>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
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
