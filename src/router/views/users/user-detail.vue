<style>
    .hover{
        cursor: pointer;
    }
</style>
<script>
    import Layout from "../../layouts/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";
    const userRepository = factory.get('users');
    const roleRepository = factory.get('role');
    const permissonRepository = factory.get('permisson');
    const accountepository = factory.get('account');

    export default {
        page: {
            title: "User Detail",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader },
        data() {
            return {
                objectUser : {},
                title: "Chi tiết",
                titleModal: '',
                rolesUser: [],
                permissonsUser: [],
                roleGrid: [],
                permissonGrid: [],
                gridModal: [],
                finance: []
            };
        },
        computed: {

        },
        created(){
            const id = this.$route.params.id;
            if(id){
                userRepository.get(id).then((data)=>{
                    var roles = id+'/roles';
                    var permisson = id+'/permissions/direct';
                   this.getRoleUser(roles);
                   this.getPermissonUser(permisson);
                   this.getListRole();
                   this.getListPermisson();
                    this.objectUser = data.data || {};
                });
            }
            this.getListFinance();
        },
        methods: {
            getRoleUser(param){
                userRepository.get(param).then((data)=>{
                    this.rolesUser = data.data|| [];
                    // eslint-disable-next-line no-console
                    console.log("  role  ", data.data);
                });
            },
            getPermissonUser(param){
                userRepository.get(param).then((data)=>{
                    this.permissonsUser = data.data|| [];
                });
            },
            getListRole(){
                roleRepository.all().then((data)=>{
                    this.roleGrid = data.data.data;
                    // eslint-disable-next-line no-console
                    console.log("  getListRole  ", data.data.data);
                });
            },
            getListPermisson(){
              permissonRepository.all().then((data)=>{
                  this.permissonGrid = data.data.data;
                  // eslint-disable-next-line no-console
                  console.log("  getListPermisson  ", data.data.data);
              });
            },
            getListFinance(){
              accountepository.all().then((data)=>{
                  // eslint-disable-next-line no-console
                  console.log("  getListFinance  ", data.data.data);
                  this.finance = data.data.data || [];
              });
            },
            hideModal() {
                this.$refs['modal-form'].hide()
            },
            showModalForm(val){
                this.gridModal = [];
                if(val=='role'){
                    this.titleModal = "Danh sách role";
                    this.gridModal = this.roleGrid;
                    this.rolesUser.forEach(value => {
                       this.gridModal.forEach(value1 => {
                           if(value.id == value1.id){
                               value1['state'] = true;
                           }else {
                               value1['state'] = false;
                           }
                           // eslint-disable-next-line no-console
                           console.log(value.id, " check  ", value1.id);
                       })
                    });
                    this.$refs['modal-form'].show();
                }else if(val=='permisson'){
                    this.titleModal = "Danh sách permisson";
                    this.gridModal = this.permissonGrid;
                    this.$refs['modal-form'].show();
                }else if(val=='manager'){
                    this.titleModal = "Danh sách manager";
                    this.$refs['modal-form'].show();
                }
            }
        }
    };
</script>

<template>
    <Layout>
        <PageHeader :title="title"  />

        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Thông tin tài khoản</h5>
                        <div class="card-body">
                            <p><span class="font-weight-bold">Tên:</span> {{objectUser.id}}</p>
                            <p><span class="font-weight-bold">Email:</span> {{objectUser.email}}</p>
                            <p><span class="font-weight-bold">Trạng thái:</span> {{objectUser.status_id}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Tài chính</h5>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table mb-0" >
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên</th>
                                        <th>Loại tiền</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(fi,index) in finance" :key="fi.id">
                                        <td>{{index + 1}}</td>
                                        <td>{{fi.user_id}}</td>
                                        <td>{{fi.currency_id}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><span>Role</span><span class="float-right hover" @click="showModalForm('role')"><i class="fa fa-plus text-success"></i></span></h5>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table mb-0" >
                                    <tbody>
                                        <tr v-for="(role,index) in rolesUser" :key="role.id">
                                            <td>{{index + 1}}</td>
                                            <td>{{role.name}}</td>
                                            <td><span class="hover"><i class="fa fa-minus text-danger"></i></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><span>Permisson</span><span class="float-right hover" @click="showModalForm('permisson')"><i class="fa fa-plus text-success"></i></span></h5>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table mb-0">
                                    <tbody>
                                    <tr v-for="(per,index) in permissonsUser" :key="per.id">
                                        <td>{{index + 1}}</td>
                                        <td>{{per.name}}</td>
                                        <td><span class="hover"><i class="fa fa-minus text-danger"></i></span></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><span>Manager User</span><span class="float-right hover" @click="showModalForm('manager')"><i class="fa fa-plus text-success"></i></span></h5>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table mb-0">
                                    <tbody>
                                    <tr>
                                        <td>Grand Total :</td>
                                        <td><span><i class="fa fa-minus text-danger"></i></span></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>


        <b-modal
                ref="modal-form"
                size="sm"
                :title="titleModal"
                title-class="font-18"
                hide-footer
                scrollable
        >
            <div>
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">STT</th>
                        <th scope="col">Tên</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in gridModal" :key="item.id">
                        <td width="10%">
                            <b-form-checkbox
                                    :id="`customCheck${item.id}`"
                                    v-model="item.state">
                            </b-form-checkbox>
                        </td>
                        <th width="10%">{{index + 1}}</th>
                        <td>
                          {{item.name}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="d-flex justify-content-end mt-3">
                                <b-button class="btn-success mr-1" style="color: black !important;">Đồng ý</b-button>
                                <b-button class="btn-danger" style="color: black !important;" @click="hideModal">Hủy</b-button>
            </div>
        </b-modal>
    </Layout>

</template>


