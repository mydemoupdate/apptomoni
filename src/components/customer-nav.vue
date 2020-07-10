<script>
    export default {
        methods: {
            /**
             * Menu clicked show the submenu
             */
            onMenuClick(event) {

                event.preventDefault();
                const nextEl = event.target.nextSibling;
                if (nextEl && !nextEl.classList.contains("show")) {
                    const parentEl = event.target.parentNode;
                    if (parentEl) {
                        parentEl.classList.remove("show");
                    }
                    nextEl.classList.add("show");
                } else if (nextEl) {
                    nextEl.classList.remove("show");
                }
                return false;
            },
            topbarLight() {
                document.body.setAttribute("data-topbar", "light");
                document.body.removeAttribute("data-layout-size", "boxed");
            },
            boxedWidth() {
                document.body.setAttribute("data-layout-size", "boxed");
                document.body.removeAttribute("data-topbar", "light");
                document.body.setAttribute("data-topbar", "dark");
            },
            coloredHeader() {
                document.body.setAttribute("data-topbar", "colored");
                document.body.removeAttribute("data-layout-size", "boxed");
            }
        }
    };
</script>
<template>
    <div class="topnav">
        <div class="container-fluid">
            <nav class="navbar navbar-light navbar-expand-lg topnav-menu">
                <div id="topnav-menu-content" class="collapse navbar-collapse">
                    <ul class="navbar-nav">

                        <li class="nav-item dropdown">
                            <a
                                    id="topnav-pages"
                                    class="nav-link dropdown-toggle arrow-none"
                                    href="#"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    @click="onMenuClick"
                            >
                                <i class="bx bx-customize mr-2"></i>Đơn hàng
                                <div class="arrow-down"></div>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="topnav-pages">
<!--                                <router-link tag="a" to="/create-order" class="dropdown-item">Tạo đơn</router-link>-->
                                <router-link tag="a" to="/order-retail" class="dropdown-item">Đơn lẻ</router-link>
                                <router-link tag="a" to="/order-wholesale" class="dropdown-item">Đơn sỉ</router-link>
                                <router-link tag="a" to="/order-auction" class="dropdown-item">Đơn đấu giá</router-link>
                                <router-link tag="a" to="/order-shippingpartner" class="dropdown-item">Đơn thanh toán hộ</router-link>
                                <router-link tag="a" to="/order-paymentpartner" class="dropdown-item">Đơn chuyển hộ</router-link>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a
                                    class="nav-link dropdown-toggle arrow-none"
                                    href="#"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    @click="onMenuClick"
                            >
                                <i class="bx bx-customize mr-2"></i>Vận đơn
                                <div class="arrow-down"></div>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="topnav-pages">
                                <router-link tag="a" to="/order-retail" class="dropdown-item">Đơn lẻ</router-link>
                                <router-link tag="a" to="/order-wholesale" class="dropdown-item">Đơn sỉ</router-link>
                            </div>
                        </li>
                        <li class="nav-item">
                            <router-link tag="a" class="nav-link" to="/finance">
                                <i class="bx bx-home-circle mr-2"></i>Tài chính
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link tag="a" class="nav-link" to="/">
                                <i class="bx bx-home-circle mr-2"></i>Thông tin nhận hàng
                            </router-link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </div>
</template>
