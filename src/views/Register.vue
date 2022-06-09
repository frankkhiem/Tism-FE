<template>
  <div class="register-container">
    <div class="register">
      <div class="register-title">
        <span>Đăng ký</span>
      </div>
      <div v-show="loading" class="loading-register">
        <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
      </div>
      <div v-show="!loading" class="form-register">
      <form @submit.prevent='register'>
        <div class="form__control">
          <label for="username">Họ tên*</label>
          <div class="register-input-wrap">
            <input id="username" type="text" v-model='fullName' class="input-field" placeholder="Nhập họ tên của bạn ..." >
            <i class="fa-solid fa-user input-icon"></i>
          </div>
          <div :class="{ errorDisplay: errorFullName }" class="errorMessage">
            <span>{{ errorFullName }}</span>
            <i class="fa-solid fa-circle-exclamation"></i>
          </div>
        </div>
        <div class="form__control">
          <label for="email">Email*</label>
          <div class="register-input-wrap">
            <input id="email" v-model='email' type="" class="input-field" placeholder="Nhập email của bạn ..." >
            <i class="fa-solid fa-envelope input-icon"></i>
          </div>
          <div :class="{ errorDisplay: errorEmail }" class="errorMessage">
            <span>{{ errorEmail }}</span>
            <i class="fa-solid fa-circle-exclamation"></i>
          </div>
        </div>
        <div class="form__control">
          <label for="password">Mật khẩu*</label>
          <div class="register-input-wrap">
            <input v-if="showPassword" id="password" type="text" v-model='password' class="input-field password" placeholder="Nhập mật khẩu của bạn ..." >
            <input v-else id="password" type="password" v-model='password' class="input-field password" placeholder="Nhập mật khẩu của bạn ..." >
            <i class="fa-solid fa-lock input-icon"></i>
            <div @click="showPassword = !showPassword" class="password-btns">
              <i v-if="showPassword" class="fa-solid fa-eye-slash"></i>
              <i v-else class="fa-solid fa-eye"></i>
            </div>
          </div>
          <div :class="{ errorDisplay: errorPassword }" class="errorMessage">
            <span>{{ errorPassword }}</span>
            <i class="fa-solid fa-circle-exclamation"></i>
          </div>
        </div>
        <div class="form__control">
          <label for="password-confirm">Nhập lại mật khẩu*</label>
          <div class="register-input-wrap">
            <input v-if="showPasswordConfirm" id="password-confirm" type="text" v-model='passwordConfirm' class="input-field password" placeholder="Nhập lại mật khẩu của bạn ..." >
            <input v-else id="password-confirm" type="password" v-model='passwordConfirm' class="input-field password" placeholder="Nhập lại mật khẩu của bạn ..." >
            <i class="fa-solid fa-lock input-icon"></i>
            <div @click="showPasswordConfirm = !showPasswordConfirm" class="password-btns">
              <i v-if="showPasswordConfirm" class="fa-solid fa-eye-slash"></i>
              <i v-else class="fa-solid fa-eye"></i>
            </div>
          </div>
          <div :class="{ errorDisplay: errorPasswordConfirm }" class="errorMessage">
            <span>{{ errorPasswordConfirm }}</span>
            <i class="fa-solid fa-circle-exclamation"></i>
          </div>
        </div>
        <div  class="register-button">
          <button type="submit">Đăng ký</button>
        </div>
      </form>
      <div class="login-button">
        <p>Bạn đã có tài khoản?</p>
        <router-link :to="{ name: 'Login'}"> Đăng nhập</router-link>
      </div>
      </div>
    </div>
  </div>
  
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
export default {
  data() {
    return {
      email: '',
      fullName: '',
      password: '',
      passwordConfirm: '',
      errorFullName: '',
      errorPassword: '',
      errorEmail: '',
      errorPasswordConfirm: '',
      showPassword: false,
      showPasswordConfirm: false,
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      isAuth: 'userAuthenticated'
    })
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      setTimeout( () => {
      if( vm.isAuth ) next({ name: 'Home' })
      else next()
      }, 50)
    })
  },

  methods: {
    ...mapActions({
      fetchUserProfile: 'fetchUserProfile',
    }),

    async register() {
      this.errorEmail = ''
      this.errorFullName = ''
      this.errorPassword = ''
      this.errorPasswordConfirm = ''

      if( this.password !== this.passwordConfirm ) {
        this.errorPasswordConfirm = 'Mật khẩu nhập lại không đúng'
        return
      }
      this.loading = true

      try {
        const response = await axios.post(process.env.VUE_APP_API_HOST + '/register', {
          fullname: this.fullName,
          email: this.email,
          password: this.password
        })

        // console.log(response.data)

        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)

        await this.fetchUserProfile();

        this.$router.push({name: 'Home'});
      } catch(error) {
        const errorData = error.response.data;
        
        // console.log(errorData)

        switch( errorData.message ) {
          case 'fullname is required in request body':
            this.errorFullName = 'Họ tên là bắt buộc'
            break
          case 'email is required in request body':
            this.errorEmail = 'Email là bắt buộc'
            break
          case 'email format wrong':
            this.errorEmail = 'Email có định dạng sai'
            break
          case `Email '${this.email}' already exists`:
            this.errorEmail = 'Email đã tồn tại trong hệ thống'
            break
          case 'password is required in request body':
            this.errorPassword = 'Mật khẩu là bắt buộc'
            break
          case 'password must be at least 6 characters':
            this.errorPassword = 'Mật khẩu cần tối thiểu 6 ký tự'
            break
          default:
            this.errorEmail = 'Không thể đăng ký tài khoản'
            break
        }
      } finally {
        this.loading = false
      }
    },
  },

  watch: {
    fullName: function(){
      this.errorFullName = '';
    }, 
    email: function(){
      this.errorEmail = '';
    }, 
    password: function(){
      this.errorPassword = '';
    },
    passwordConfirm: function(){
      this.errorPasswordConfirm = '';
    }
  },
}
</script>

<style scoped>
.register-container {
  background-image: url('.././assets/img/login-background-1.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
}
.register {
  width: 480px;
  padding:  25px 60px;
  background-color: #fff;
  border-radius: 12px;
}
.register-title {
  width: 100%;
  text-align: center;
  font-size: 32px;
  /*color: #1da1f2;*/
  color: #333;
}
.register-title span {
  font-weight: 500;
}
.loading-register {
  width:  100%;
  min-height: 560px;
  display: flex;
  justify-content: center;
  align-items:  center;
}
.loading-register img {
  width: 80px;
  height: 80px;
}
.form-register {
  width: 100%;
  min-height: 560px;
  position: relative;
  display: flex;
  flex-direction: column;
}
.form__control {
  display: flex;
  flex-direction: column;
  margin: 2px 0 0 0;
}
.form__control label {
  font-size: 14px;
  padding: 12px 0;
  color: #333;
  font-weight: 500;
  margin: 8px 0 0 0;
}
.register-input-wrap {
  position: relative;
  font-size: 24px;
  height: 36px;
}   
.input-field {
  display: inline-block;
  position: absolute;
  width: 100%;
  height: 100%;
  padding-left: 38px;
  font-size: 16px;
  border: none;
  outline: none;
  border-bottom: 2px solid #e2dbdb;  
}
.input-field:focus {
  border-bottom: 2px solid #b4aeae;
}
.input-field:focus::placeholder {
  color: transparent;
}
.input-field:focus + .input-icon {
  color: #b4aeae;
}
.input-field.password {
  padding-right: 38px;
}
.input-icon {
  position: absolute;
  top: 4px;
  display: inline-block;
  text-align: center;
  height: 100%;
  color: #cecdcd;
  padding-left: 8px;
}
.register-button {
  width: 100%;
  height: 48px; 
  margin-top: 40px;
}
.register-button button {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #00dbde, #fc00ff);
  background-color: #6bbeff;
  border-radius: 24px;
  border: none;
  cursor: pointer;
  color: #fff;
}
.register-button button:hover {
  background: linear-gradient(235deg, #00dbde, #fc00ff);
}
.login-button {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0;
}
.login-button p {
  margin: 0 0 10px;
}
.login-button a {
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  color: #a64bf4;
  margin-top: 4px;
}
.errorMessage {
  color: red;
  margin-top: 8px;
  display: none;
}
.errorDisplay {
  display: block;
}
.errorMessage span {
  margin-right: 4px;
}
.password-btns {
  position: absolute;
  right: 0;
  margin-right: .5rem;
}
.password-btns i {
  font-size: 16px;
  color: #666;
}
</style>