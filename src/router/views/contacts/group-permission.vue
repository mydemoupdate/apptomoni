<script>
    import Layout from "../../layouts/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import authFactory from "@/services/factory";

    // import { userGridData } from "./data-user";

    const userRepository = authFactory.get('users');
    // eslint-disable-next-line no-unused-vars
    const groupRepository = authFactory.get('group');
    // eslint-disable-next-line no-unused-vars
    const permissionsRepository = authFactory.get('permissions');

    /**
     * Contacts-list component
     */
    export default {
        page: {
            title: "Contact User List",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: { Layout, PageHeader },
        data() {
            return {
                userGridData: [],
                groupGridData: [],
                permissionsGridData: [],
                groupName : '',
                object: {},
                permissionName: '',
                objectPermissions: {},
                checkGroup: true,
                title: "Group/Permisson",
                items: [
                    {
                        text: "Contacts",
                        href: "/"
                    },
                    {
                        text: "Group-Permisson",
                        active: true
                    }
                ]
            };
        },
        created(){
            this.fetch();
            this.getGroup();
            this.getPermissions();
        },
        methods: {
            newGroup: function () {
                 groupRepository.create({
                    name: this.groupName,
                    id: Math.random()
                }).then(()=>{
                    this.showToast('success','Thêm mới thành công');
                    this.getGroup();
                }).catch((error)=>{
                    // eslint-disable-next-line no-console
                    if (error.response.status == 422) {
                        this.showToast('danger','Tên đã tồn tại');
                    }
                });
                this.groupName = '';
            },
            newPermissions: function () {
                permissionsRepository.create({
                    name: this.permissionName,
                    id: Math.random()
                }).then(()=>{
                    this.showToast('success','Thêm mới thành công');
                    this.getPermissions();
                }).catch((error)=>{
                    // eslint-disable-next-line no-console
                    if (error.response.status == 422) {
                        this.showToast('danger','Tên đã tồn tại');
                    }
                });
                this.permissionName = '';
            },
            async fetch(){
                const data = await userRepository.all();
                // eslint-disable-next-line no-console
                console.log("role1  ", data);
                this.userGridData = data.data.data;
            },
            async getGroup(){
                const roles  =await groupRepository.all();
                this.groupGridData = roles.data.data;
                // eslint-disable-next-line no-console
            },
            async getPermissions(){
                const permissions  = await permissionsRepository.all();
                this.permissionsGridData = permissions.data.data;
                // eslint-disable-next-line no-console
                console.log("permissionsGridData  ", this.permissionsGridData);
            },
            showToast(val, mes){
                this.$bvToast.toast(mes, {
                    title: `Thông báo`,
                    variant: val,
                    solid: true
                })
            },
            openModalTrash(obj, checkGroup){
                this.object = obj;
                // eslint-disable-next-line no-console
                // console.log(this.objectGroup);
                this.$refs['modal-sm-trash'].show();
                this.checkGroup = checkGroup;
            },
            hideModal() {
                this.$refs['modal-sm-trash'].hide()
            },
            configDelete(id){
                if(this.checkGroup){
                    groupRepository.delete(id).then(()=>{
                        this.hideModal();
                        this.showToast('success','Xóa thành công');
                        this.getGroup();
                    });
                }else {
                    permissionsRepository.delete(id).then(()=>{
                        this.hideModal();
                        this.showToast('success','Xóa thành công');
                        this.getPermissions();
                    });
                }

            }
        }
    };
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />
        <div class="row">
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-centered table-nowrap table-hover">
                                <thead class="thead-light">
                                <tr>
                                    <th scope="col" style="width: 10px;">#</th>
                                    <th scope="col">Group Name</th>
                                    <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
<!--                                    <td></td>-->
                                    <td colspan="2">
                                        <input type="text" class="form-control" v-model="groupName">
                                    </td>
                                    <td>

                                        <button type="button" class="btn btn-info" v-on:click="newGroup">New</button>
                                    </td>
                                </tr>

                                <tr v-for="(list,index) in groupGridData" :key="list.id">
                                    <td>
                                        {{index + 1}}
                                    </td>
                                    <td>
                                        <h5 class="font-size-14 mb-1">
                                            <a href="#" class="text-dark">{{list.name}}</a>
                                        </h5>
<!--                                        <p class="text-muted mb-0">{{list.name}}</p>-->
                                    </td>
                                    <td>
                                        <ul class="list-inline font-size-20 contact-links mb-0">
                                            <li class="list-inline-item px-2">
                                                <a v-b-tooltip.hover title="DELETE" class="trash-list" v-on:click="openModalTrash(list, true)">
                                                    <i class="bx bx bx-trash-alt"></i>
                                                </a>
                                                <a v-b-tooltip.hover title="Group" class="trash-list" v-b-modal.modal-lg>
                                                    <i class="bx bx bx-group"></i>
                                                </a>


                                            </li>

                                        </ul>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <ul class="pagination pagination-rounded justify-content-center mt-4">
                                    <li class="page-item disabled">
                                        <a href="#" class="page-link">
                                            <i class="mdi mdi-chevron-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item active">
                                        <a href="#" class="page-link">1</a>
                                    </li>
                                    <li class="page-item">
                                        <a href="#" class="page-link">2</a>
                                    </li>
                                    <li class="page-item">
                                        <a href="#" class="page-link">3</a>
                                    </li>
                                    <li class="page-item">
                                        <a href="#" class="page-link">4</a>
                                    </li>
                                    <li class="page-item">
                                        <a href="#" class="page-link">5</a>
                                    </li>
                                    <li class="page-item">
                                        <a href="#" class="page-link">
                                            <i class="mdi mdi-chevron-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-centered table-nowrap table-hover">
                                <thead class="thead-light">
                                <tr>
                                    <th scope="col" style="width: 10px;">#</th>
                                    <th scope="col">Permisson Name</th>
                                    <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td colspan="2">
                                        <input type="text" class="form-control" v-model="permissionName">
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-info" @click="newPermissions">New</button>
                                    </td>
                                </tr>
                                <tr v-for="(list,index) in permissionsGridData" :key="list.id">
                                    <td>
                                        {{index + 1}}
                                    </td>
                                    <td>
                                        <h5 class="font-size-14 mb-1">
                                            <a href="#" class="text-dark">{{list.name}}</a>
                                        </h5>
<!--                                        <p class="text-muted mb-0">{{list.name}}</p>-->
                                    </td>
                                    <td>
                                        <ul class="list-inline font-size-20 contact-links mb-0">
                                            <li class="list-inline-item px-2">
                                                <a v-b-tooltip.hover title="DELETE" class="trash-list" v-on:click="openModalTrash(list, false)">
                                                    <i class="bx bx bx-trash-alt"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <ul class="pagination pagination-rounded justify-content-center mt-4">
                                    <li class="page-item disabled">
                                        <a href="#" class="page-link">
                                            <i class="mdi mdi-chevron-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item active">
                                        <a href="#" class="page-link">1</a>
                                    </li>
                                    <li class="page-item">
                                        <a href="#" class="page-link">2</a>
                                    </li>
                                    <li class="page-item">
                                        <a href="#" class="page-link">3</a>
                                    </li>
                                    <li class="page-item">
                                        <a href="#" class="page-link">4</a>
                                    </li>
                                    <li class="page-item">
                                        <a href="#" class="page-link">5</a>
                                    </li>
                                    <li class="page-item">
                                        <a href="#" class="page-link">
                                            <i class="mdi mdi-chevron-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-modal
                id="modal-lg"
                size="lg"
                title="Phần quyền"
                title-class="font-18"
                hide-footer
        >
            <div>
                <b-card no-body>
                    <b-tabs pills card>
                        <b-tab title="Người sử dụng" active><b-card-text>
                           <div class="row">
                               <div class="col">
                                   <h4>Không thuộc nhóm</h4>
                               <table class="table table-bordered">
                                   <thead>
                                   <tr>
                                       <th style="width: 5px"></th>
                                       <th scope="col">Tên đăng ký</th>
                                       <th scope="col">Tên đầy đủ</th>
                                   </tr>
                                   </thead>
                                   <tbody>
                                   <tr>
                                       <td>   <b-form-checkbox
                                               id="checkbox-1"
                                               name="checkbox-1"
                                               value="accepted"
                                               unchecked-value="not_accepted">
                                       </b-form-checkbox></td>
                                       <td>Otto</td>
                                       <td>@mdo</td>
                                   </tr>
                                   </tbody>
                               </table>
                           </div>
                               <div class="col-auto align-self-center mt-3">
                                   <i class='bx bx-left-arrow'></i>
                                   <i class='bx bx-right-arrow'></i>
                               </div>
                               <div class="col">
                                   <h4>Thuộc nhóm</h4>
                                   <table class="table table-bordered">
                                       <thead>
                                       <tr>
                                           <th scope="col">Tên đăng ký</th>
                                           <th scope="col">Tên đầy đủ</th>
                                       </tr>
                                       </thead>
                                       <tbody>
                                       <tr>
                                           <td>Otto</td>
                                           <td>@mdo</td>
                                       </tr>
                                       </tbody>
                                   </table>
                               </div>
                           </div>
                        </b-card-text></b-tab>
                        <b-tab title="Quyền sử dụng"><b-card-text>Tab contents 2</b-card-text></b-tab>
                    </b-tabs>
                </b-card>
            </div>
            <b-button class="mt-3 float-right btn-success">Save</b-button>
        </b-modal>
        <b-modal
                ref="modal-sm-trash"
                size="sm"
                title="Thông báo"
                title-class="font-18"
                hide-footer
        >
            <div>
                <h3>Bạn có muốn xóa:  {{object.name}}</h3>
            </div>
            <div class="d-flex justify-content-center mt-3" >
                <b-button class="btn-success mr-3" style="color: black !important;" @click="configDelete(object.id)">Đồng ý</b-button>
                <b-button class="btn-danger" style="color: black !important;" @click="hideModal">Hủy</b-button>
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

