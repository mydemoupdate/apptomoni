<script>

    import SideNav from "./side-nav-right";

    export default {
        components: {  SideNav },
        props: {
        },
        data() {
            return {
                settings: {
                    minScrollbarLength: 60
                }
            };
        },

        methods: {}
    };
</script>

<template>
    <!-- ========== Left Sidebar Start ========== -->
    <div class="vertical-menu" style="right: 0%;width: 280px">
        <SideNav />
    </div>
    <!-- Left Sidebar End -->
</template>

