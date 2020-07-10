<script>
    import HorizontalTopbar from "@/components/customer-topbar";
    import HorizontalNav from "@/components/customer-nav";
    import RightBar from "@/components/right-bar";
    import Footer from "@/components/footer";
    import factory from "@/services/factory";
    const accountRepository = factory.get('account');
    const userRepository = factory.get('users');
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
                finance: {}
            };
        },
        created() {
            this.getFinance();
            document.body.setAttribute("data-layout", "horizontal");
            document.body.setAttribute("data-topbar", "dark");
            document.body.removeAttribute("data-sidebar", "dark");
            document.body.removeAttribute("data-layout-size", "boxed");
        },
        methods: {
            getFinance(){
              userRepository.me(null).then((data)=>{
                  const user = data.data;
                  accountRepository.all('search='+user.id+'&searchFields=user_id').then((data) => {

                      const result = data.data.data || [];
                      this.finance = result[0];
                      // eslint-disable-next-line no-console
                      console.log("  getListFinance  ",  this.finance);
                  });
              });
            },
            toggleRightSidebar() {
                document.body.classList.toggle("right-bar-enabled");
            },
            hideRightSidebar() {
                document.body.classList.remove("right-bar-enabled");
            },
        }
    }
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
                        <div class="col-md-4 m-auto">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h2 class="card-title">Tài chính</h2>
                                    <div class="card-body">
                                        <p><span class="font-weight-bold">Tên:</span> {{finance.user_id}}</p>
                                        <p><span class="font-weight-bold">Loại tiền:</span> {{finance.currency_id}}</p>
                                        <p><span class="font-weight-bold">Số dư:</span> {{finance.balance}}</p>
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
