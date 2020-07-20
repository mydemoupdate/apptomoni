<script>
import router from "@/router";

import NavBar from "@/components/nav-bar";
import SideBar from "@/components/side-bar";
import SideBarRight from "@/components/side-bar-right";
import RightBar from "@/components/right-bar";
import Footer from "@/components/footer";

export default {
  components: { NavBar, SideBar, RightBar, Footer,SideBarRight },
  data() {
    return {
      isMenuCondensed: false
    };
  },
  created: () => {
    document.body.removeAttribute("data-layout", "horizontal");
    document.body.removeAttribute("data-topbar", "dark");
    document.body.removeAttribute("data-layout-size", "boxed");
  },
  methods: {
    toggleMenu() {
      document.body.classList.toggle("sidebar-enable");

      if (window.screen.width >= 992) {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
          document.body.classList.remove("vertical-collpsed");
        });
        document.body.classList.toggle("vertical-collpsed");
      } else {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
        });
        document.body.classList.remove("vertical-collpsed");
      }
      this.isMenuCondensed = !this.isMenuCondensed;
    },
    toggleRightSidebar() {
      document.body.classList.toggle("right-bar-enabled");
    },
    hideRightSidebar() {
      document.body.classList.remove("right-bar-enabled");
    }
  }
};
</script>

<template>
  <div id="layout-wrapper">
    <NavBar />
    <SideBar :is-condensed="isMenuCondensed" />
    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->

    <div class="main-content">
      <div class="page-content" style="margin-left: 40px">
        <!-- Start Content-->
        <div class="container-fluid" style="padding-right: 300px">
          <slot />
        </div>
      </div>
      <Footer />
    </div>
    <SideBarRight/>
    <RightBar />
  </div>
</template>
