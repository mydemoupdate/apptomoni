<style>
    .trash-list:hover{
        cursor: pointer;
        color: red !important;
    }
    item:hover .show-item{
        display: block;
    }
    .remove-track{
        display: none;
    }
    .track:hover .remove-track{
        display: contents;
    }
</style>
<script>
    import Layout from "../../../layouts/main";
    import PageHeader from "@/components/page-header";
    import appConfig from "@/app.config";
    export default {
        page: {
            title: "Order Detail",
            meta: [{ name: "description", content: appConfig.description }]
        },
        components: {Layout, PageHeader },
        data() {
            return {
                title: "Đơn hàng"
            }
        },
        computed: {

        },
        created(){

        },
        methods: {

        }
    };
</script>

<template>
    <Layout>
        <PageHeader :title="title"  />
       <div class="row">
           Chi tiết hoa don
       </div>
    </Layout>

</template>


