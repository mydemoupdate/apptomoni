
<script>
    import Layout from "../../layouts/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";
    const transactionRepository = factory.get('transaction');
    const receiptRepository = factory.get('receipt');
    export default {
        page: {
            title: "Order Detail",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader },
        data() {
            return {
                title: "Chi tiết giao dịch",
                objectTransition: {amount: 0},
                receiptGrid: []
            };
        },
        computed: {

        },
        created(){
            const id = this.$route.params.id;
            if(id){
                transactionRepository.get(id).then((data)=>{
                    // eslint-disable-next-line no-console
                    console.log("transactionRepository  ", data);
                    this.objectTransition = data.data;
                });
                receiptRepository.all('search='+id+'&searchFields=transaction_id').then((data)=>{
                    // eslint-disable-next-line no-console
                    console.log("receiptRepository  ", data);
                    this.receiptGrid = data.data.data || [];
                });
            }
        },
        methods: {

        }
    };
</script>

<template>
    <Layout>
        <PageHeader :title="title"  />
        <div class="row">
            <div class="col-lg-7">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title mb-1">Thông tin giao dịch</h5>
                        <div class="card-body">
                            <p><span class="font-weight-bold">Mã:</span> {{objectTransition.id}}</p>
                            <p><span class="font-weight-bold">Số tiền:</span> {{objectTransition.amount.toLocaleString()}}</p>
                            <p><span class="font-weight-bold">Mô tả:</span> {{objectTransition.description}}</p>
                            <p><span class="font-weight-bold">Người dùng:</span> {{objectTransition.user_id}}</p>
                            <p><span class="font-weight-bold">Người thực hiện:</span> {{objectTransition.prepared_by_id}}</p>
                            <p><span class="font-weight-bold">Loại giao dịch:</span> {{objectTransition.type_id}}</p>
<!--                            <p><span class="font-weight-bold">Tài khoản:</span> sfsfs</p>-->
<!--                            <p><span class="font-weight-bold">Phương thức:</span> sfsfs</p>-->
<!--                            <p><span class="font-weight-bold">Tạo lúc:</span> sfsfs</p>-->
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title mb-1">Chứng từ</h5>

                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table mb-0">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>File</th>
                                        <th>Mã</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(item,index) in receiptGrid" :key="item.id">
                                        <td>
                                            {{index + 1}}
                                        </td>
                                        <td><b-link :href="item.path_file">{{item.path_file}}</b-link></td>
                                        <td>{{item.receiptable_id}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>

</template>


