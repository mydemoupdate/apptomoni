<script>
    export default {
        props: {
            maxVisibleButtons: {
                type: Number,
                required: false,
                default: 3
            },
            totalPages: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            },
            perPage: {
                type: Number,
                required: true
            },
            currentPage: {
                type: Number,
                required: true
            },
        },
        computed: {
            startPage() {
                if (this.currentPage === 1) {
                    return 1;
                }

                if (this.currentPage === this.totalPages) {
                    return this.totalPages - this.maxVisibleButtons + 1;
                }

                return this.currentPage - 1;

            },
            endPage() {

                return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);

            },
            pages() {
                const range = [];

                for (let i = this.startPage; i <= this.endPage; i+= 1 ) {
                    if(i==0){
                        continue;
                    }
                    range.push({
                        name: i,
                        isDisabled: i === this.currentPage
                    });
                    // eslint-disable-next-line no-console
                    console.log("range  ", range);
                }

                return range;
            },
            isInFirstPage() {
                // eslint-disable-next-line no-console
                console.log("this.currentPage  ", this.currentPage);
                return this.currentPage === 1;
            },
            isInLastPage() {
                return this.currentPage === this.totalPages;
            },
        },
        methods: {
            onClickFirstPage() {
                this.$emit('pagechanged', 1);
            },
            onClickPreviousPage() {
                this.$emit('pagechanged', this.currentPage - 1);
            },
            onClickPage(page) {
                this.$emit('pagechanged', page);
            },
            onClickNextPage() {
                this.$emit('pagechanged', this.currentPage + 1);
            },
            onClickLastPage() {
                this.$emit('pagechanged', this.totalPages);
            },
            isPageActive(page) {
                return this.currentPage === page;
            },
        }
    };
</script>
<template>
<!--    <ul class="pagination">-->
<!--        <li class="pagination-item">-->
<!--            <button type="button" @click="onClickFirstPage" :disabled="isInFirstPage">-->
<!--                First-->
<!--            </button>-->
<!--        </li>-->

<!--        <li class="pagination-item">-->
<!--            <button type="button" @click="onClickPreviousPage" :disabled="isInFirstPage">-->
<!--                Previous-->
<!--            </button>-->
<!--        </li>-->

<!--        <li v-for="page in pages" :key="page.name" class="pagination-item">-->
<!--            <button type="button" @click="onClickPage(page.name)" :disabled="page.isDisabled" :class="{ active: isPageActive(page.name) }">-->
<!--                {{ page.name }}-->
<!--            </button>-->
<!--        </li>-->

<!--        <li class="pagination-item">-->
<!--            <button type="button" @click="onClickNextPage" :disabled="isInLastPage">-->
<!--                Next-->
<!--            </button>-->
<!--        </li>-->

<!--        <li class="pagination-item">-->
<!--            <button type="button" @click="onClickLastPage" :disabled="isInLastPage">-->
<!--                Last-->
<!--            </button>-->
<!--        </li>-->
<!--    </ul>-->

    <ul class="pagination pagination-rounded justify-content-end mb-2" v-if="pages.length">
        <li class="page-item" :class="{ disabled: isInFirstPage}">
            <a class="page-link" href="javascript: void(0);" aria-label="Previous" @click="onClickPreviousPage" >
                <i class="mdi mdi-chevron-left"></i>
            </a>
        </li>
        <li class="page-item" v-for="page in pages" :key="page.name" :class="{ active: isPageActive(page.name) }">
            <a class="page-link" href="javascript: void(0);" @click="onClickPage(page.name)" :disabled="page.isDisabled" > {{ page.name }}</a>
        </li>
        <li class="page-item"  :class="{ disabled: isInLastPage}">
            <a class="page-link" href="javascript: void(0);" aria-label="Next" @click="onClickNextPage" >
                <i class="mdi mdi-chevron-right"></i>
            </a>
        </li>
    </ul>


</template>

<style>


/*    .active {*/
/*        background-color: #4AAE9B;*/
/*        color: #ffffff;*/
/*    }*/
</style>
