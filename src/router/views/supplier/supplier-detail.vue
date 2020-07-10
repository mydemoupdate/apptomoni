<script>
    import Layout from "../../layouts/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";
    const supplierRepository = factory.get('supplier');
    export default {
        page: {
            title: "Supplier List",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader  },
        data() {
            return {
                title: 'Nhà cung cấp',
                name: '',
                email: '',
                address: '',
                link: '',
                note: '',
                ID: '',
                IDreadonly: false
            };
        },
        created(){
            const id = this.$route.params.id;

            // eslint-disable-next-line no-console
            console.log("  OK2  ", id);
            if(id){
                supplierRepository.get(id).then((data)=>{
                    // eslint-disable-next-line no-console
                    console.log("  dtaa  ", data);
                    const dataObject = data.data;
                    this.ID= dataObject.id;
                    this.name = dataObject.name;
                    this.address = dataObject.address;
                    this.email = dataObject.email;
                    this.link  = dataObject.link;
                    this.note = dataObject.note;
                    this.IDreadonly = true;
                });
            }
        },
        computed: {
            nameState() {
                return this.name.length > 1 ? true : false;
            },
            IDState(){
                if(this.ID.length>1 && this.ID.length<30){
                    return true;
                }else {
                    return false;
                }
            }
        },
        methods: {
            showToast(val, mes){
                this.$bvToast.toast(mes, {
                    title: `Thông báo`,
                    variant: val,
                    solid: true
                })
            },
            newSupplier(){
                this.name='';
                this.link='';
                this.address='';
                this.note='';
                this.email='';
                this.ID='';
                this.IDreadonly = false
            },
            saveSupplier(){
                var dataObject ={
                    id: this.ID,
                    name: this.name,
                    link: this.link,
                    address: this.address,
                    email: this.email,
                    note: this.note
                };
                if(this.IDreadonly){
                    supplierRepository.update(dataObject,this.ID)
                        .then(()=>{
                            this.showToast("success","Cập nhật thành công");
                        }).catch((error)=> {
                        // eslint-disable-next-line no-console
                        if (error.response.status == 422) {
                            this.showToast("danger", "Cập nhật thất bại")
                        }
                    });
                }else {
                    supplierRepository.create(dataObject)
                        .then(()=>{
                            this.showToast("success","Thêm thành công");
                            this.newSupplier();
                        }).catch((error)=> {
                        // eslint-disable-next-line no-console
                        if (error.response.status == 422) {
                            this.showToast("danger", "Thêm thất bại")
                        }
                    });
                }

            }
        },
    };
</script>

<template>
    <Layout>
        <router-link tag="a" to="/supplier/list" class="float-right">Danh sách nhà cung cấp</router-link>
        <PageHeader :title="title" />
        <div class="row">
            <div class="col-lg-12">


                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Thông tin nhà cung cấp</h4>
                        <p class="card-title-desc"></p>
                        <div class="row">
                            <div class="form-group col">
                                <label>ID nhà cung cấp</label>
                                <b-form-input
                                        v-model="ID"
                                        :state="IDState"
                                        aria-describedby="input-live-help"
                                        trim
                                        :readonly="IDreadonly"
                                ></b-form-input>

                                <!-- This will only be shown if the preceding input has an invalid state -->
                                <b-form-invalid-feedback>
                                    Nhập thông tin
                                </b-form-invalid-feedback>
                            </div>
                            <div class="form-group col">
                                <label>Tên nhà cung cấp</label>
                                <b-form-input
                                        v-model="name"
                                        :state="nameState"
                                        aria-describedby="input-live-help"
                                ></b-form-input>
                                <!-- This will only be shown if the preceding input has an invalid state -->
                                <b-form-invalid-feedback>
                                    Nhập thông tin
                                </b-form-invalid-feedback>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col">
                                <label>Địa chỉ</label>
                                <b-form-input
                                        v-model="address"
                                ></b-form-input>
                            </div>
                            <div class="form-group col">
                                <label>Email</label>
                                <b-form-input
                                        v-model="email"
                                ></b-form-input>
                            </div>

                        </div>
                        <div class="row">
                            <div class="form-group col">
                                <label>Đường dẫn</label>
                                <b-form-input
                                        v-model="link"
                                ></b-form-input>
                            </div>
                            <div class="form-group col">
                                <label>Ghi chú</label>
                                <b-form-textarea
                                        v-model="note"
                                        rows="3"
                                ></b-form-textarea>
                            </div>
                        </div>
                        <button  class="btn btn-primary mr-1" :disabled="!nameState || !IDState" @click="saveSupplier">Lưu</button>
                        <button class="btn btn-secondary" @click="newSupplier">Thêm mới </button>
                    </div>
                </div>
            </div>
        </div>

    </Layout>

</template>


