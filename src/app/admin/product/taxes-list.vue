<script>
    import Layout from "../layout/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";
    const taxesRepository = factory.get('taxes');
    export default {
        page: {
            title: "Taxes List",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader },
        data() {
            return {
                taxesGridData: [],
                object: {
                    id: '',
                    name: '',
                    percent: 0

                },
                filter: null,
                title: "Danh sách thuế",
            };
        },
        created(){
            this.getList('');
        },
        computed: {
            nameState(){
                return   this.object.name.length > 0?true:false;
            },
            percentState() {
                return (this.object.percent !== '') ? true : false;
            },
        },
        methods: {
            async getList(key){
                const data = await taxesRepository.all('search='+key);
                this.taxesGridData = data.data;
                // eslint-disable-next-line no-console
                console.log(data.data);
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
            configDelete(id) {
                taxesRepository.delete(id).then(() => {
                    this.refreshForm();
                    this.hideModal();
                    this.showToast('success', 'Xóa thành công');
                    this.getList('');
                }).catch((error) => {
                    if (error.response.status == 422) {
                        this.showToast("danger", "Xóa thất bại")
                        this.hideModal();
                    }
                })
            },
                searchKey(){
                this.getList(this.filter);
                this.filter = '';
            },
            refreshForm(){
                this.object.id = '';
                this.object.name = '';
                this.object.percent = 0;
            },
            save(){
                taxesRepository.create({
                    name: this.object.name,
                    percent: this.object.percent
                }).then(()=>{
                    this.showToast('success', 'Thêm thành công');
                    this.refreshForm();
                   this.getList('');
                });
            }
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
                                        <input type="text" class="form-control" placeholder="Search..." v-model="filter" v-on:keyup.enter="searchKey"/>
                                        <i class="bx bx-search-alt search-icon"></i>
                                    </div>
                                </div>
                            </div>
                            <!-- end col-->
                        </div>



                        <div class="table-responsive">
                            <table class="table mb-0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tên</th>
                                    <th>Phần trăm</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th scope="row">0</th>
                                    <td>
                                        <b-form-input
                                                v-model="object.name"
                                                :state="nameState"
                                        ></b-form-input>
                                    </td>
                                    <td >
                                        <b-form-input
                                                v-model="object.percent"
                                                :state="percentState"
                                                type="number"
                                                trim
                                        ></b-form-input>
                                    </td>
                                    <td class="text-center">
                                                        <b-button class="btn-success mr-2" :disabled="!nameState || !percentState" @click="save">Lưu</b-button>
                                                        <b-button class="btn-danger" @click="refreshForm">Hủy</b-button>
                                    </td>
                                </tr>
                                <tr v-for="(item,index) in taxesGridData" :key="item.id">
                                    <td>
                                        {{index + 1}}
                                    </td>
                                    <td>{{item.name}}</td>
                                    <td>{{item.percent}}</td>
                                    <td class="text-center">
                                        <b-button class="btn-danger" v-on:click="openModalTrash(item)">Xóa</b-button>

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
                <h3>Bạn có muốn xóa:  {{object.name}}</h3>
            </div>
            <div class="d-flex justify-content-center mt-3" >
                <b-button class="btn-success mr-3"  @click="configDelete(object.id)">Đồng ý</b-button>
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

