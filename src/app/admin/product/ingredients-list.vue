<script>
    import Layout from "../../layouts/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";
    const ingredientsRepository = factory.get('ingredients');


    export default {
        page: {
            title: "Taxes List",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader },
        data() {
            return {
                gridData: [],
                object: {
                    id: '',
                    name: ''

                },
                filter: null,
                title: "Danh sách xuất xứ",
            };
        },
        created(){
            this.getList('');
        },
        computed: {
            idState(){
                return   (this.object.id !== '')?true:false;
            },
            nameState() {
                return (this.object.name !== '') ? true : false;
            },
        },
        methods: {
            async getList(key){
                const data = await ingredientsRepository.all('search='+key);
                this.gridData = data.data;
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
                ingredientsRepository.delete(id).then(() => {
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
            },
            save(){
                ingredientsRepository.create({
                    id: this.object.id,
                    name: this.object.name
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
                                    <th>ID</th>
                                    <th>Tên</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th scope="row">0</th>
                                    <td>
                                        <b-form-input
                                                v-model="object.id"
                                                :state="idState"
                                        ></b-form-input>
                                    </td>
                                    <td >
                                        <b-form-input
                                                v-model="object.name"
                                                :state="nameState"
                                                trim
                                        ></b-form-input>
                                    </td>
                                    <td class="text-center">
                                        <b-button class="btn-success mr-2" :disabled="!nameState || !idState" @click="save">Lưu</b-button>
                                        <b-button class="btn-danger" @click="refreshForm">Hủy</b-button>
                                    </td>
                                </tr>
                                <tr v-for="(item,index) in gridData" :key="item.id">
                                    <td>
                                        {{index + 1}}
                                    </td>
                                    <td>{{item.id}}</td>
                                    <td>{{item.name}}</td>
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

