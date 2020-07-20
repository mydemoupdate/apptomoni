<style>
    input[type="file"] {
        position: absolute;
        opacity: 0;
        z-index: -1;
    }

    .align-center {
        text-align: center;
    }

    .helper {
        height: 100%;
        display: inline-block;
        vertical-align: middle;
        width: 0;
    }


    .display-inline {
        display: inline-block;
        vertical-align: middle;
    }

    .img {
        border: 1px solid #f6f6f6;
        display: inline-block;
        height: auto;
        max-height: 80%;
        max-width: 80%;
        width: auto;
    }

    .drop {
        background-color: #f2f2f2;
        border: 4px dashed #ccc;
        background-color: #f6f6f6;
        border-radius: 2px;
        width: 100%;
    }

</style>
<script>
    import Layout from "../layout/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    import factory from "@/services/factory";

    const unitRepository = factory.get('units');
    const supplierRepository = factory.get('supplier');
    const originRepository = factory.get('origins');
    const taxesRepository = factory.get('taxes');
    const ingredientsRepository = factory.get('ingredients');
    const productRepository = factory.get('products');
    const packageRepository = factory.get('package');

    export default {
        page: {
            title: "Contact User List",
            meta: [{name: "description", content: appConfig.description}]
        },
        components: {Layout, PageHeader},
        data() {
            return {
                filter: null,
                unitsGridData: [],
                originGridData: [],
                supplierGridData: [],
                taxesGridData: [],
                ingredientsGridData: [],
                jancode: '',
                name: '',
                price: 0,
                ingredientsSelect: '',
                taxesSelect: '',
                originSelect: '',
                unitSelect: '',
                supplierSelect: '',
                images: '',
                resultImage: '',
                resultFile: File,
                quantity: 0,
                weight: 0,
                height: 0,
                length: 0,
                width: 0,
                selectTypeImg: 0,
                title: "Chi tiết sản phẩm",
                options: ['Apple', 'Orange', 'Banana', 'Lime', 'Peach', 'Chocolate', 'Strawberry'],
                value: [],
                search: '',
                checkUpdateDetail: false,
                supplierObject: {},
            };
        },
        created() {
            this.getSupplierList();
            this.getUnitList();
            this.getOriginList();
            this.getTaxesList();
            this.getIngredientsList();
            const id = this.$route.params.id;
            if(id){
                this.checkUpdateDetail = true;
                productRepository.get(id,"with=ingredients").then((data)=>{
                    // eslint-disable-next-line no-console
                    console.log("  dataProduct  ", data);
                    const dataObject = data.data;
                    this.jancode = dataObject.id;
                    if(dataObject.name.ja){
                        this.name= dataObject.name.ja;
                    }else if(dataObject.name.en){
                        this.name=dataObject.name.en;
                    }else if(dataObject.name.vi){
                        this.name = dataObject.name.vi;
                    }
                    this.price = dataObject.price;
                    if(dataObject.origin_id){
                        this.originSelect = dataObject.origin_id;
                    }
                    if(dataObject.supplier_id){
                        this.supplierSelect = dataObject.supplier_id;
                        this.getSupplierDetail(dataObject.supplier_id);
                    }
                    if(dataObject.unit_id){
                        this.unitSelect = dataObject.unit_id;
                    }
                    if(dataObject.tax_id){
                        this.taxesSelect = dataObject.tax_id;
                    }
                    if(dataObject.ingredients.length>0){
                        for(var i=0;i<dataObject.ingredients.length;i++){
                            this.value.push(dataObject.ingredients[i].id);
                        }
                    }
                });
            }
        },
        computed: {
            availableOptions() {
                // eslint-disable-next-line no-console
                console.log(this.value);
                return this.options.filter(opt => this.value.indexOf(opt) === -1)
            },
            janCodeState() {
                return this.jancode.length > 5 && this.jancode.length < 14 ? true : false
            },
            nameState() {
                // eslint-disable-next-line no-console
                console.log(this.name.length);
                return this.name.length > 2 ? true : false;
            },

        },
        methods: {
            onDrop: function (e) {
                e.stopPropagation();
                e.preventDefault();
                var files = e.dataTransfer.files;
                this.createFile(files[0]);
            },
            onChange(e) {
                var files = e.target.files;
                // eslint-disable-next-line no-console
                console.log(files);
                this.resultFile = files[0];
                this.createFile(files[0]);
            },
            createFile(file) {
                // if (!file.type.match('image.*')) {
                //     alert('Select an image');
                //     return;
                // }
                // var img = new Image();
                var reader = new FileReader();
                var vm = this;
                reader.onload = function (e) {
                    vm.images = e.target.result;
                    this.resultFile = file;
                    // eslint-disable-next-line no-console
                    console.log(this.resultFile);
                };
                reader.readAsDataURL(file);
            },
            removeFile() {
                this.images = '';
            },
            async getUnitList() {
                unitRepository.all()
                    .then((data) => {
                        // eslint-disable-next-line no-console
                        this.unitsGridData = data.data;
                        this.unitSelect = this.unitsGridData[0].id;
                    })
            },
            async getOriginList() {
                originRepository.all().then((data) => {
                    // eslint-disable-next-line no-console
                    this.originGridData = data.data;
                })
            },
            async getSupplierList() {
                supplierRepository.all().then((data) => {
                    this.supplierGridData = data.data.data;
                    // eslint-disable-next-line no-console
                    console.log("Go   ",this.supplierGridData);
                    this.supplierSelect = this.supplierGridData[0].id;
                    this.getSupplierDetail(this.supplierSelect);
                });
            },
            getSupplierDetail(id){
              supplierRepository.get(id).then((data)=>{
                  this.supplierObject = data.data || {};
              });
            },
            async getTaxesList() {
                taxesRepository.all().then((data) => {
                    // eslint-disable-next-line no-console
                    this.taxesGridData = data.data;
                    // eslint-disable-next-line no-console
                    console.log(this.taxesGridData);
                });
            },
            async getIngredientsList() {
                ingredientsRepository.all().then((data) => {
                    // eslint-disable-next-line no-console
                    this.ingredientsGridData = data.data.data;
                    this.options = [];
                    for (var i = 0; i < this.ingredientsGridData.length; i++) {
                        this.options.push(this.ingredientsGridData[i].id);
                    }
                });
            },
            saveProduct() {

                var dataObject = {
                    id: this.jancode,
                    name: this.name,
                    price: this.price,
                    // images: this.resultFile
                };
                // var formData = new FormData();
                // formData.append('images', this.resultFile);
                // formData.append('id', this.jancode);
                // formData.append('price', this.price);
                // formData.append('name', this.name);
                // dataObject['images']=formData;
                // eslint-disable-next-line no-console
                console.log('file:  ',dataObject);
                if (this.originSelect) {
                    dataObject['origin_id'] = this.originSelect;
                    // formData.append('origin_id', this.originSelect);
                }
                if (this.supplierSelect) {
                    dataObject['supplier_id'] = this.supplierSelect;
                    // formData.append('supplier_id', this.supplierSelect);

                }
                if (this.unitSelect) {
                    dataObject['unit_id'] = this.unitSelect;
                    // formData.append('unit_id', this.unitSelect);

                }
                if (this.taxesSelect) {
                    dataObject['tax_id'] = this.taxesSelect;
                    // formData.append('tax_id', this.taxesSelect);

                }

                // if(this.value.length>0){
                //     for(var i=0;i<this.value.length;i++){
                //         dataObject['ingredients['+i+']']=this.value[i];
                //     }
                // }
                if(this.value.length>0){
                    dataObject['ingredients']=this.value;
                    // formData.append('ingredients', this.value);
                }
                // eslint-disable-next-line no-console
                console.log('after:  ',dataObject);
                if(this.checkUpdateDetail){
                    productRepository.update(dataObject,this.jancode).then(() => {
                        if (this.unitSelect == "box") {
                            var objectBox = {
                                id_product: this.jancode,
                                quantity: this.quantity,
                                weight: this.weight,
                                height: this.height,
                                length: this.length,
                                width: this.width
                            };
                            packageRepository.create(objectBox);
                        }
                        this.showToast("success", "Cập nhật  thành công");
                    }).catch((error) => {
                        // eslint-disable-next-line no-console
                        if (error.response.status == 422) {
                            this.showToast("danger", "Cập nhật thất bại");
                        }
                    });
                }else{
                    productRepository.create(dataObject)
                        .then(() => {
                            if (this.unitSelect == "box") {
                                var objectBox = {
                                    id_product: this.jancode,
                                    quantity: this.quantity,
                                    weight: this.weight,
                                    height: this.height,
                                    length: this.length,
                                    width: this.width
                                };
                                packageRepository.create(objectBox);
                            }
                            this.checkUpdateDetail = true;
                            this.showToast("success", "Thêm mới thành công");
                        }).catch((error) => {
                        // eslint-disable-next-line no-console
                        if (error.response.status == 422) {
                            this.showToast("danger", "Thêm mới thất bại");
                        }
                    });
                }
            },
            onOptionClick({option, addTag}) {
                addTag(option);
                this.search = '';
                this.value.push(option);
                // eslint-disable-next-line no-console
                console.log(this.value);
                // productRepository.product_ingredients({
                //     product_id
                // })
            },

            showToast(val, mes) {
                this.$bvToast.toast(mes, {
                    title: `Thông báo`,
                    variant: val,
                    solid: true
                })
            },
            supplierChange(){
                this.getSupplierDetail(this.supplierSelect);
            },
            newProduct() {
                this.jancode = '';
                this.name = '';
                this.price = 0;
                this.ingredientsSelect = '';
                this.taxesSelect = '';
                this.originSelect = '';
                this.unitSelect = this.unitsGridData[0].id;
                this.supplierSelect = '';
                this.file = '';
                this.resultImage = '';
                this.quantity = 0;
                this.weight = 0;
                this.height = 0;
                this.length = 0;
                this.width = 0;
                this.value = [];
                this.checkUpdateDetail = false;
            },
            unitChange(){
                // eslint-disable-next-line no-console
                console.log(this.unitSelect);
            }
        },
    };
</script>

<template>
    <Layout>
        <router-link tag="a" to="/product/list" class="float-right">Danh sách sản phẩm</router-link>
        <PageHeader :title="title"/>

        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                       <div class="row">
                           <div class="col-sm-4">
                               <div style="height: 300px" class="drop display-inline align-center mt-5" @dragover.prevent @drop="onDrop">
                                   <div class="helper"></div>
                                   <label v-if="!images" class="btn display-inline">
                                       Chọn hình
                                       <input type="file" name="image" @change="onChange">
                                   </label>
                                   <div class=" display-inline align-center" v-else v-bind:class="{ 'images': true }">
                                       <img :src="images" alt="" class="img"/>
                                       <br>
                                       <button class="btn" @click="removeFile">Xóa</button>
                                   </div>
                               </div>
                           </div>
                           <div class="col-sm-8">
                               <div class="card">
                                   <div class="card-body">
                                   <h4 class="card-title">Thông tin sản phẩm</h4>
                                   <div class="card-body">
                                       <div class="row">
                                           <div class="col">
                                               <b-form-group label-cols="4" label-cols-lg="3" label="Jancode">
                                                   <b-form-input  v-model="jancode"
                                                                  :state="janCodeState"
                                                                  aria-describedby="input-live-help"
                                                                  trim
                                                                  :style="[checkUpdateDetail ? {'background' : 'darkgrey'} : {'background' : '#fff'}]"
                                                                  :readonly="checkUpdateDetail"></b-form-input>
                                                   <b-form-invalid-feedback>
                                                       Ít nhất 5 ký tự hoặc thấp hơn
                                                   </b-form-invalid-feedback>
                                               </b-form-group>
                                           </div>
                                       </div>

                                       <div class="row">
                                           <div class="col">
                                               <b-form-group label-cols="4" label-cols-lg="3" label="Tên sản phẩm">
                                                   <b-form-input
                                                           v-model="name"
                                                           :state="nameState"
                                                           aria-describedby="input-live-help"
                                                           trim
                                                   ></b-form-input>
                                                   <b-form-invalid-feedback>
                                                       Ít nhất 3 ký tự
                                                   </b-form-invalid-feedback>
                                               </b-form-group>
                                           </div>
                                       </div>

                                       <div class="row">
                                           <div class="col">
                                               <b-form-group label-cols="3" label-cols-lg="6" label="Giá">
                                                   <b-form-input
                                                           type="number"

                                                           v-model="price"
                                                           aria-describedby="input-live-help"
                                                           trim
                                                   ></b-form-input>
                                                   <b-form-invalid-feedback>
                                                       Nhập tiền
                                                   </b-form-invalid-feedback>
                                               </b-form-group>
                                           </div>
                                           <div class="col">
                                               <b-form-group label-cols="4" label-cols-lg="3" label="Thuế">
                                                   <b-input-group>
                                                       <template v-slot:append>
                                                           <b-input-group-text>
                                                               <router-link tag="a" to=""><strong class="text-primary"><i class="fa fa-plus"></i></strong>
                                                               </router-link>
                                                           </b-input-group-text>
                                                       </template>
                                                       <select class="custom-select" v-model="taxesSelect">
                                                           <option v-for="unitTax in taxesGridData" :key="unitTax.id"
                                                                   v-bind:value="unitTax.id">{{unitTax.name}}
                                                           </option>
                                                       </select>
                                                   </b-input-group>
                                               </b-form-group>
                                           </div>
                                       </div>
                                       <div class="row">
                                           <div class="col">
                                               <b-form-group label-cols="3" label-cols-lg="3" label="Xuất xứ">
                                                   <b-input-group>
                                                       <template v-slot:append>
                                                           <b-input-group-text>
                                                               <router-link tag="a" to=""><strong class="text-primary"><i class="fa fa-plus"></i></strong>
                                                               </router-link>
                                                           </b-input-group-text>
                                                       </template>
                                                       <select class="custom-select" v-model="originSelect">
                                                           <option v-for="originItem in originGridData" :key="originItem.id"
                                                                   v-bind:value="originItem.id">{{originItem.name}}
                                                           </option>
                                                       </select>
                                                   </b-input-group>
                                               </b-form-group>
                                           </div>

                                       </div>
                                       <div class="row">
                                           <div class="col">
                                               <b-form-group label-cols="3" label-cols-lg="3" label="Nhà cc">
                                                   <b-input-group>
                                                       <template v-slot:append>
                                                           <b-input-group-text>
                                                               <router-link tag="a" to=""><strong class="text-primary"><i class="fa fa-plus"></i></strong>
                                                               </router-link>
                                                           </b-input-group-text>
                                                       </template>
                                                       <select class="custom-select" v-model="supplierSelect" @change="supplierChange">
                                                           <option v-for="supplierItem in supplierGridData" :key="supplierItem.id"
                                                                   v-bind:value="supplierItem.id">{{supplierItem.name}}
                                                           </option>
                                                       </select>
                                                   </b-input-group>
                                               </b-form-group>
                                           </div>
                                       </div>
                                       <div class="row">
                                           <div class="col">
                                               <b-form-group label-cols="3" label-cols-lg="3" label="Đơn vị tính">
                                                   <b-input-group>
                                                       <template v-slot:append>
                                                           <b-input-group-text>
                                                               <router-link tag="a" to=""><strong class="text-primary"><i class="fa fa-plus"></i></strong>
                                                               </router-link>
                                                           </b-input-group-text>
                                                       </template>
                                                       <select class="custom-select" v-model="unitSelect" @change="unitChange">
                                                           <option v-for="unitItem in unitsGridData" :key="unitItem.id"
                                                                   v-bind:value="unitItem.id">{{unitItem.name}}
                                                           </option>
                                                       </select>
                                                   </b-input-group>
                                               </b-form-group>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                               </div>
                           </div>
                       </div>

                       <div class="row">
                            <div class="col-md-12">

                                <label>Thành phần
                                    <b-button variant="primary">Thêm</b-button>
                                </label>
                                <b-form-group>
                                    <!-- prop `add-on-change` is needed to enable adding tags vie the `change` event -->
                                    <b-form-tags v-model="value" size="lg" add-on-change no-outer-focus class="mb-2">
                                        <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                                            <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
                                                <li v-for="tag in tags" :key="tag" class="list-inline-item">
                                                    <b-form-tag
                                                            @remove="removeTag(tag)"
                                                            :title="tag"
                                                            :disabled="disabled"
                                                            variant="info"
                                                    >{{ tag }}</b-form-tag>
                                                </li>
                                            </ul>
                                            <b-form-select
                                                    v-bind="inputAttrs"
                                                    v-on="inputHandlers"
                                                    :disabled="disabled || availableOptions.length === 0"
                                                    :options="availableOptions">
                                                <template v-slot:first>
                                                    <!-- This is required to prevent bugs with Safari -->
                                                    <option disabled value="">Chọn thành phần</option>
                                                </template>
                                            </b-form-select>
                                        </template>
                                    </b-form-tags>
                                </b-form-group>
                            </div>
                        </div>
                        <div class="row ">
                            <div class="col">
                                <button :disabled='!nameState || !janCodeState' class="btn btn-primary mr-1"
                                        @click="saveProduct()">Lưu
                                </button>
                                <button class="btn btn-secondary" @click="newProduct">Thêm mới</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" v-if="supplierObject.name">
            <div class="col-md-5">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Thông tin nhà cung cấp</h4>
                        <div class="card-body">
                            <p><span class="font-weight-bold">Tên:</span> {{supplierObject.name}}</p>
                            <p><span class="font-weight-bold">Email:</span> {{supplierObject.email}}</p>
                            <p><span class="font-weight-bold">Địa chỉ:</span> {{supplierObject.address}}</p>
                            <p><span class="font-weight-bold">Link:</span> <b-link :href="supplierObject.link">{{supplierObject.link}}</b-link></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-7">
                <div class="card">
                    <div class="card-body" v-if="unitSelect=='box'">
                        <h4 class="card-title">Thông tin thùng hàng</h4>
                        <div class="card-body">
                            <div class="row" >
                                <div class="form-group col">
                                    <label>Số lượng</label>
                                    <input type="number" class="form-control" v-model="quantity"/>
                                </div>
                                <div class="form-group col">
                                    <label>Cân nặng</label>
                                    <input type="number" class="form-control" v-model="weight"/>
                                </div>
                                <div class="form-group col">
                                    <label>Chiểu cao</label>
                                    <input type="number" class="form-control" v-model="height"/>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col">
                                    <label>Chiều dài</label>
                                    <input type="number" class="form-control" v-model="length"/>
                                </div>
                                <div class="form-group col">
                                    <label>Chiều rộng</label>
                                    <input type="number" class="form-control" v-model="width"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    </Layout>

</template>
<style>
    .trash-list {
        cursor: pointer;
        color: red !important;
    }

    trash-list > i {
        font-size: 16px;
    }
    .img{
        width: 100% !important;
        height: 200px;
    }
</style>

