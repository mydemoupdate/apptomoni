<script>
    import HorizontalTopbar from "@/components/customer-topbar";
    import HorizontalNav from "@/components/customer-nav";
    import RightBar from "@/components/right-bar";
    import Footer from "@/components/footer";
    import factory from "@/services/factory";
    const cartRepository = factory.get('cart');
    const productRepository = factory.get('products');


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
                shipInforGrid: []
            };
        },
        created () {
            this.getList('');
            document.body.setAttribute("data-layout", "horizontal");
            document.body.setAttribute("data-topbar", "dark");
            document.body.removeAttribute("data-sidebar", "dark");
            document.body.removeAttribute("data-layout-size", "boxed");
        },
        watch:{
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
                        <div class="card">

                            <div class="card-body" v-if="cartGridData.length">
                                <div class="row">
                                    <div class="float-left"><h3>Danh sách sản phẩm</h3></div>
<!--                                    <div class="float-right">-->
<!--                                        <router-link tag="button" to="past-cart" class="btn btn-success btn-rounded">Tạo đơn</router-link>-->
<!--                                    </div>-->
                                </div>
                                <div class="row">
                                    <div class="col-8">
                                        <div class="table-responsive pt-2">
                                            <table class="table mb-0">
                                                <thead>
                                                <tr>
                                                    <th>Mã đơn hàng</th>
                                                    <th>Sản phẩm</th>
                                                    <th>Hình</th>
                                                    <th>Số lượng</th>
                                                    <th>Giá</th>
                                                    <th>Nhà cc</th>
                                                </tr>
                                                </thead>
                                                <tbody v-if="cartGridData.length">
                                                <tr v-for="(item) in cartGridData" :key="item.id">
                                                    <td>{{item.id}}</td>
                                                    <td>{{item.name_product}}</td>
                                                    <td><b-img :src="item.img" fluid alt="Responsive image"></b-img></td>
                                                    <td>{{item.quantity}}</td>
                                                    <td>{{item.price}}</td>
                                                    <td>{{item.supplier_id}}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="col-4">

                                    </div>
                                </div>
                            </div>
                            <div class="card-body" v-else>
                                <h3 class="text-center">Chưa có sản phẩm nào</h3>
<!--                                <router-link tag="button" to="/create-retail" class="btn btn-success btn-rounded"><i class="mdi mdi-plus"></i>Tạo đơn</router-link>-->
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
