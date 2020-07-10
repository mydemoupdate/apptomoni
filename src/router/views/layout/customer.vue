<script>
    import HorizontalTopbar from "@/components/customer-topbar";
    import HorizontalNav from "@/components/customer-nav";
    import RightBar from "@/components/right-bar";
    import Footer from "@/components/footer";
    import factory from "@/services/factory";
    const userRepository = factory.get('users');
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
                objectUser : {},
                orderGridData: []
            };
        },
        created(){
            userRepository.me("with=roles&with=myManagers;fullMyManagers").then((data)=>{
                this.objectUser = data.data || {};

                // eslint-disable-next-line no-console
                console.log(this.objectUser ,"userRepository  ", data);
            });
            this.getOrder();
            document.body.setAttribute("data-layout", "horizontal");
            document.body.setAttribute("data-topbar", "dark");
            document.body.removeAttribute("data-sidebar", "dark");
            document.body.removeAttribute("data-layout-size", "boxed");
        },
        methods: {
            toggleRightSidebar() {
                document.body.classList.toggle("right-bar-enabled");
            },
            hideRightSidebar() {
                document.body.classList.remove("right-bar-enabled");
            },
            async getOrder(){
                await orderRepository.all("search=retail&searchFields=director.type.id").then((data)=>{
                    this.orderGridData = data.data.data;
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
                        <div class="row">
                            <div class="col-md-5">
                               <div class="card">
                                   <div class="card-body">
                                       <h5 class="card-title mb-4">Thông tin</h5>
                                       <div class="card-body">
                                           <p><span class="font-weight-bold">ID:</span> {{objectUser.id}}</p>
                                           <p><span class="font-weight-bold">Email:</span> {{objectUser.email}}</p>
                                       </div>
                                   </div>
                               </div>
                                <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title mb-4">Mật khẩu</h5>
                                            <div class="card-body">

                                                <div class="row">
                                                    <b-col sm="4">
                                                        <label class="mt-2">Mật khẩu mới:</label>
                                                    </b-col>
                                                    <b-col sm="8">
                                                        <b-form-input type="password" placeholder="Nhập mật khẩu mới"></b-form-input>
                                                    </b-col>
                                                </div>

                                                <div class="row mt-3">
                                                   <div class="col d-flex justify-content-center">
                                                       <b-button pill variant="success">Lưu</b-button>
                                                   </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div class="col-md-7">
                                <div class="card">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-xl-4 col-sm-6">
                                                    <div class="text-center text-md-left">
                                                                        <h5 class="mb-3 text-truncate">
                                                                            <a href="javascript: void(0);" class="text-dark">Đơn hàng</a>
                                                                        </h5>
                                                                        <h5>
                                                                            <b>14</b>
                                                                        </h5>
                                                                    </div>
                                                </div>
                                                <div class="col-xl-4 col-sm-6">
                                                    <div class="text-center text-md-left">
                                                        <h5 class="mb-3 text-truncate">
                                                            <a href="javascript: void(0);" class="text-dark">Tiền Việt</a>
                                                        </h5>
                                                        <h5>
                                                            <b>234</b>
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div class="col-xl-4 col-sm-6">
                                                    <div class="text-center text-md-left">
                                                        <h5 class="mb-3 text-truncate">
                                                            <a href="javascript: void(0);" class="text-dark">Tiền Nhật</a>
                                                        </h5>
                                                        <h5>
                                                            <b>23 yen</b>
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title mb-4">Đơn hàng</h5>
                                            <div class="card-body">
                                                <div class="table-responsive">
                                                    <table class="table mb-0">
                                                        <thead>
                                                        <tr>
                                                            <th>STT</th>
                                                            <th>Mã đơn hàng</th>
                                                            <th>Vận chuyển</th>
                                                            <th>Khách hàng</th>
                                                            <th>Trạng thái</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr v-for="(item,index) in orderGridData" :key="item.id" >
                                                                <td >
                                                                    {{index + 1}}
                                                                </td>
                                                                <td>{{item.id}}</td>
                                                                <td>
                                                                    <span class="badge badge-pill badge-info" v-if="item.shipment_method_id=='sea'">Đường biển</span>
                                                                    <span class="badge badge-pill badge-secondary" v-if="item.shipment_method_id=='air'">Đường bay</span>
                                                                </td>
                                                                <td>{{item.customer_id}}</td>
                                                                <td>{{item.status.name.vi}}</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
<!--                                <div class="card">-->
<!--                                        <div class="card-body">-->
<!--                                            <h5 class="card-title mb-4">Giao dịch</h5>-->
<!--                                            <div class="card-body">-->
<!--                                                <p><span class="font-weight-bold">Số dư:</span> 500</p>-->
<!--                                            </div>-->
<!--                                        </div>-->
<!--                                    </div>-->
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
