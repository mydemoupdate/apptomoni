

<script>
    export default {
            created() {
                    // eslint-disable-next-line no-unused-vars
                    const expires = this.$route.query.expires;
                    // eslint-disable-next-line no-unused-vars
                    const signature = this.$route.query.signature;

                    // eslint-disable-next-line no-console
                    console.log(expires,  "  OK2  ", signature);
            }
    }
</script>

<style scoped>

</style>


<template>
        <h1>OK</h1>
</template>

