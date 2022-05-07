<template>
  <div id="home-page" class="row">
    <div class="col-12 col-lg-6 home-card">
      <div class="card-container" @click="$router.push('/teams')">
        <div class="card__image">
          <img src="@/assets/img/team.png" alt="">
        </div>
        <div class="card__title">
          Quản lý nhóm và nhiệm vụ
        </div>
        <div class="card__description">
          Tạo nhóm, mời mọi người vào nhóm và thẻ, để lại nhận xét, thêm ngày hết hạn và chúng tôi sẽ hiển thị hoạt động quan trọng nhất ở đây.
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-6 home-card">
      <div class="card-container" @click="$router.push('/friends')">
        <div class="card__image">
          <img src="@/assets/img/friend-connections.jpg" alt="">
        </div>
        <div class="card__title">
          Bạn bè và kết nối toàn cầu
        </div>
        <div class="card__description">
          Tìm kiếm, kết bạn và trò chuyện với nhau qua hệ thống nhắn tin thời gian thực được chúng tôi cung cấp.
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-6 home-card">
      <div class="card-container" @click="$router.push('/contacts')">
        <div class="card__image">
          <img src="@/assets/img/task.png" alt="">
        </div>
        <div class="card__title">
          Đồng bộ danh bạ cá nhân
        </div>
        <div class="card__description">
          Kết nối với Google và Outlook của bạn. Tism sẽ đồng bộ tất cả liên hệ giúp cho bạn luôn sẵn sàng liên lạc mọi lúc, mọi nơi.
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-6 home-card">
      <div class="card-container" @click="$router.push('/about')">
        <div class="card__image card__image--gif">
          <img src="@/assets/img/loader-full-page.gif" alt="">
        </div>
        <div class="card__title">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          Thông tin về Tism
        </div>
        <div class="card__description">
          Giới thiệu về chúng tôi, xem thông tin về bản quyền và giấy phép phát hành của Tism. Thông tin về những nhà sáng lập của dự án này!
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  
}
</script>

<style lang="scss" scoped>
#home-page {
  padding: 3rem 4rem 0;

  .home-card {
    margin-bottom: 3rem;
  }

  .card-container {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    box-shadow: 0 1px 4px rgba(9, 30, 66, .25), 0 0 8px 1px rgba(9, 30, 66, .08);
    border-radius: 5px;
    padding-bottom: 24px;
    cursor: pointer;

    &:hover {
      box-shadow: 0 1px 8px 2px rgba(9, 30, 66, .25), 0 0 16px 3px rgba(9, 30, 66, .08);
    }

    .card__image {
      img {
        width: 100%;
        height: 150px;
        object-fit: contain;
      }

      &.card__image--gif {
        img {
          background-color: #f4b558;
        }
      }
    }

    .card__title {
      margin-top: .5rem;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      color: #172b4d;
    }

    .card__description {
      margin-top: .5rem;
      padding: 0 2rem;
      text-align: center;
    }
  }
}
</style>
