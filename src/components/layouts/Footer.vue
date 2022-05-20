<template>
  <div class="footer">
    <div class="top-footer">
    </div>
    <div class="bottom-footer">
      <div class="footer-copyright">
        <div class="permission">
          &copy;2022 
          <a class="company" href="#">Tism. </a>
          All right reserved
        </div>
        <div class="developer">
          Developed by Us Company with love for Tism's customer
        </div>
      </div>
      <div class="footer-payment"> 
        <a href="#">
          <img src="@/assets/img/paypal5.png">
        </a>
        <a href="#">
          <img src="@/assets/img/paypal4.png">
        </a>
        <a href="#">
          <img src="@/assets/img/paypal3.png">
        </a>
        <a href="#">
          <img src="@/assets/img/paypal2.png">
        </a>
        <a href="#">
          <img src="@/assets/img/paypal1.png">
        </a>
        <a href="#">
          <img src="@/assets/img/paypal.png">
        </a>
        <div class="donate">        
          Our Power, Donate Us!
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  padding: 0;
  margin: 0; 
}
.top-footer {
  height: 20px;
  background-color: #ebeeee;
  border-bottom: 1px solid #fff
}
.bottom-footer {
  /*position: absolute;*/
  /*bottom: 0;*/
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  background-color: #ebeeee;
  color: #707070;
  align-items: center;
}
.footer-copyright {
  margin-left: 80px;
}
.footer-copyright .permission {
  font-size: 16px;
  margin-bottom: 2px;
}
.footer-copyright .developer {
  font-size: 14px;
}
.footer-copyright .company {
  text-decoration: none;
  margin: 0 2px;
  color: #2c2c2c;
  font-weight: 600;
}
.footer-copyright .company:hover {
  color: #46b04a;
}
.footer-payment {
  margin-right: 80px;
}
.footer-payment a {
  text-decoration: none;
  margin-left: 12px;
}
.footer-payment a:hover img {
  filter: brightness(68%) contrast(100%) saturate(100%) blur(0px) hue-rotate(0deg);
}
.footer-payment .donate {
  font-size: 14px;
  padding-left: 12px;
}
</style>
