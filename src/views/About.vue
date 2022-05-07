<template>
  <div id="about-tism">
    <div class="tism-information">
      <div class="title">
        Về chúng tôi
      </div>
      <div class="content">
        <router-link to="/" class='home-link'>Tism </router-link>
        <p class="intro">là sản phẩm được phát triển dựa trên ý tưởng về một công cụ tuyệt vời trong quản lý công việc cá nhân cũng như trong môi trường doanh nghiệp. Các nhà sáng lập của công ty đã dành nhiều thời gian và tâm huyết để xây dưng lên một nền tảng mạnh mẽ cung cấp giải pháp hữu ích cho những khách hàng tiềm năng của chúng tôi.</p>
        <p class="founder">
          <a href="https://www.facebook.com/frank.khiem" target="_blank">KHyM</a>
          - 
          <a href="https://www.facebook.com/manh.nh03" target="_blank">Doãn Đại Hiệp</a>
          - 
          <a href="https://www.facebook.com/khanh.nguyen.09052000" target="_blank">Bescam</a> 
          đồng hành cùng nhau trong dự án cuối cùng tại UET!
        </p>
      </div>
      <div class="learn-more" @click="$router.push('/about/learn-more')">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
        Tìm hiểu thêm
      </div>
    </div>
    <div class="tism-image">
      <img src="@/assets/img/team.png" alt="Ảnh minh họa của Tism">
    </div>
  </div>
</template>

<script>
  
</script>

<style lang="scss" scoped>
#about-tism {
  display: flex;
  align-items: center;
  min-height: inherit;

  .tism-information {
    margin-left: 6rem;

    .title {
      margin-bottom: .5rem;
      font-size: 2.5rem;
      text-transform: uppercase;
      font-weight: 700;
    }

    .content {
      text-align: justify;

      .home-link {
        font-size: 18px;
        font-weight: 600;
        color: #6b77bf;
      }

      .intro {
        display: inline;
      }

      .founder {
        margin-top: .5rem;

        a {
          font-weight: 600;
          color: #6b77bf; 
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .learn-more {
      width: fit-content;
      margin-top: 2rem;
      padding: 10px 20px;
      background-color: #6b77bf;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color .2s linear;

      i {
        margin-right: 4px;
      }

      &:hover {
        background-color: #026aa7;
      }
    }
  }
}
</style>
