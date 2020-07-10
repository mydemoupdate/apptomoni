<script>
    import Layout from "../../layouts/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import authFactory from "@/services/factory";
    const userRepository = authFactory.get('users');

    export default {
        page: {
            title: "User List",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader },
        data() {
            return {
                userGridData: [],
                object: {name: {ja: null}},
                perPage: 10,
                pageOptions: [10, 25, 50, 100],
                filter: null,
                title: "Danh sách người dùng",
            };
        },
        created(){
            this.getList();
        },
        methods: {
            async getList(){
                const data = await userRepository.all();
                this.userGridData = data.data.data;
            },
            showToast(val, mes){
                this.$bvToast.toast(mes, {
                    title: `Thông báo`,
                    variant: val,
                    solid: true
                })
            },
            openModalTrash(obj){
                this.object = obj;
                this.$refs['modal-sm-trash'].show();
            },
            hideModal() {
                this.$refs['modal-sm-trash'].hide()
            },
            // configDelete(id){
            //     transactionRepository.delete(id).then(()=>{
            //         this.hideModal();
            //         this.showToast('success','Xóa thành công');
            //         this.getList();
            //     });
            // }
        }
    };
</script>

<template>
    <Layout>
        <PageHeader :title="title"  />
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">

                        <div class="row mb-2">
                            <div class="col-sm-4">
                                <div class="search-box mr-2 mb-2 d-inline-block">
                                    <div class="position-relative">
                                        <input type="text" class="form-control" placeholder="Search..." />
                                        <i class="bx bx-search-alt search-icon"></i>
                                    </div>
                                </div>
                            </div>
                            <!--                            <div class="col-sm-8">-->
                            <!--                                <div class="text-sm-right">-->
                            <!--                                    <router-link tag="button" to="create" class="btn btn-success btn-rounded mb-2 mr-2"><i class="mdi mdi-plus mr-1"></i>Thêm mới</router-link>-->

                            <!--                                </div>-->
                            <!--                            </div>-->
                            <!-- end col-->
                        </div>

                        <div class="table-responsive">
                            <table class="table mb-0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tên</th>
                                    <th>Email</th>
                                    <th>Trạng thái</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in userGridData" :key="item.id">
                                    <td>
                                        {{index + 1}}
                                    </td>
                                    <td>{{item.id}}</td>
                                    <td>{{item.email}}</td>
                                    <td>{{item.status_id}}</td>
                                    <td>
                                        <ul class="list-inline">
                                            <li>
                                                <router-link tag="a" :to="'detail/' + item.id"><i class="fas fa-pencil-alt text-success mr-1"></i>  </router-link>
                                                <a href="javascript:;" v-on:click="openModalTrash(item)"><i class="fas fa-trash-alt text-danger mr-1"></i> </a>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <b-modal
                ref="modal-sm-trash"
                size="sm"
                title="Thông báo"
                title-class="font-18"
                hide-footer
        >
            <div>
                <h3>Bạn có muốn xóa:  </h3>
            </div>
            <div class="d-flex justify-content-center mt-3" >
<!--                <b-button class="btn-success mr-3"  @click="configDelete(object.id)">Đồng ý</b-button>-->
                <b-button class="btn-danger" @click="hideModal">Hủy</b-button>
            </div>

        </b-modal>
    </Layout>

</template>
<style>
    .trash-list:hover{
        cursor: pointer;
        color: red !important;
    }
</style>

