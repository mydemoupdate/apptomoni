<script>
    import Layout from "../layout/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";
    import Pagination from "@/components/Pagination";
    const supplierRepository = factory.get('supplier');

    export default {
        page: {
            title: "Supplier List",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader, pagination: Pagination, },
        data() {
            return {
                supplierGridData: [],
                object: {},
                filter: '',
                title: "Nhà cung cấp",
                selectSearch: 'name',
                optiopSearch: [
                    { value: 'name', text: 'Tên' },
                    { value: 'email', text: 'Email' },
                    { value: 'address', text: 'Địa chỉ' },
                    { value: 'link', text: 'Link'}
                ],
                paginations: {
                    total: 0,
                    perPage: 15,
                    toTalPage: 0,
                    currentPage: 1,
                }
            };
        },
        created(){
            this.getList('name','',1);
        },
        methods: {
            async getList(type,key,page){
                const data = await supplierRepository.all('search='+type+':'+key+"&page="+page);
                this.supplierGridData = data.data.data;
                const result = data.data;
                this.paginations.toTalPage = Math.ceil(result.total/this.paginations.perPage);
                this.paginations.total = result.total;
                // eslint-disable-next-line no-console
                console.log(this.paginations.toTalPage)
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
                // eslint-disable-next-line no-console
                console.log("supplier  ", this.object);
                this.$refs['modal-sm-trash'].show();
            },
            hideModal() {
                this.$refs['modal-sm-trash'].hide()
            },
            configDelete(id){
                supplierRepository.delete(id).then(()=>{
                    this.hideModal();
                    this.showToast('success','Xóa thành công');
                    this.getList();
                }).catch((error)=>{
                    // eslint-disable-next-line no-console
                    if (error.response.status == 422) {
                        this.showToast('danger','Đang sử dụng không thể xóa');
                        this.hideModal();
                    }
                });
            },
            searchKey(){
                this.getList(this.selectSearch, this.filter);
            },
            onPageChange(page) {
                this.pagination.currentPage = page;
                this.getList(this.selectSearch, this.filter, this.pagination.currentPage);
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
                                        <b-form-group>
                                            <b-input-group>
                                                <template v-slot:append>
                                                    <b-form-select v-model="selectSearch" :options="optiopSearch"></b-form-select>
                                                </template>
                                                <b-form-input v-model="filter" v-on:keyup.enter="searchKey"></b-form-input>
                                                <i class="bx bx-search-alt search-icon"></i>
                                            </b-input-group>
                                        </b-form-group>


                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-8">
                                <div class="text-sm-right">
                                    <router-link tag="button" to="create" class="btn btn-success btn-rounded mb-2 mr-2"><i class="mdi mdi-plus mr-1"></i>Thêm mới</router-link>
                                </div>
                            </div>
                            <!-- end col-->
                        </div>

                        <div class="table-responsive">
                            <table class="table mb-0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tên nhà CC</th>
                                    <th>Email</th>
                                    <th>Địa chỉ</th>
                                    <th>Link</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in supplierGridData" :key="item.id">
                                    <td>
                                        {{index + 1}}
                                    </td>
                                    <td>{{item.name}}</td>
                                    <td>{{item.email}}</td>
                                    <td>{{item.address}}</td>
                                    <td><b-link :href="item.link">{{item.link}}</b-link></td>
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

                            <pagination
                                    :total-pages="paginations.toTalPage"
                                    :total="paginations.total"
                                    :per-page="paginations.perPage"
                                    :current-page="paginations.currentPage"
                                    @pagechanged="onPageChange"
                            />
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

