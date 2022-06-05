<template>
  <div class="login-container">
    <div class="login">
    <div class="login-title">
      <span>Đăng nhập</span>
      <!-- <i class="fa-solid fa-arrow-right-to-bracket login-icon"></i> -->
    </div>
    <div class="form-login">
      <form @submit.prevent='login'>
        <div class="form__control">
          <label for="email">Email*</label>
          <div class="login-input-wrap">
            <input id="email" v-model='email' class="input-field" placeholder="Nhập email của bạn ..." required>
            <i class="fa-solid fa-envelope input-icon"></i>
          </div>
          <div :class="{ errorDisplay: errorEmail }" class="errorMessage">
            <span>{{ errorEmail }}</span>
            <i class="fa-solid fa-circle-exclamation"></i>
          </div>
        </div>
        <div class="form__control">
          <label for="password">Mật khẩu*</label>
          <div class="login-input-wrap">
            <input v-if="showPassword" id="password" type="text" v-model='password' class="input-field password" placeholder="Nhập mật khẩu của bạn ..." required>
            <input v-else id="password" type="password" v-model='password' class="input-field password" placeholder="Nhập mật khẩu của bạn ..." required>            
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
        <div  class="login-button">
          <button type="submit">Đăng nhập</button>
        </div>
      </form>
      <div class="register-button">
        <p>Bạn chưa có tài khoản?</p>
        <router-link :to="{ name: 'Register'}">Đăng ký</router-link>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: '',
      errorEmail: '',
      errorPassword: '',
      showPassword: false
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
      }, 200)      
    })
  },

  methods: {
    ...mapActions({
      fetchUserProfile: 'fetchUserProfile',
    }),

    async login() {      
      this.errorEmail = ''
      this.errorPassword = ''

      try {
        const response = await axios.post(process.env.VUE_APP_API_HOST + '/login', {
          email: this.email,
          password: this.password
        })

        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)

        await this.fetchUserProfile()

        this.$router.push({name: 'Home'})
      } catch(error) {
        const errorData = error.response.data

        switch( errorData.message ) {
          case 'email is required in request body':
            this.errorEmail = 'Email là bắt buộc'
            break
          case 'email format wrong':
            this.errorEmail = 'Email có định dạng sai'
            break
          case `User with email '${this.email}' not found`:
            this.errorEmail = 'Email chưa được đăng ký tài khoản'
            break
          case 'password is required in request body':
            this.errorPassword = 'Mật khẩu là bắt buộc'
            break
          case 'password must be at least 6 characters':
            this.errorPassword = 'Mật khẩu cần tối thiểu 6 ký tự'
            break
          case 'Wrong password':
            this.errorPassword = 'Mật khẩu sai'
            break
          default:
            this.errorEmail = 'Không thể đăng nhập tài khoản'
            break
        }
      }
    },
  },

  watch: {
    email: function(){
      this.errorEmail = '';
    }, 
    password: function(){
      this.errorPassword = '';
    }
  },
}
</script>

<style scoped>
.login-container {
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
.login {
  width: 480px;
  padding: 60px;
  background-color: #fff;
  border-radius: 12px;
}
.login-title {
  width: 100%;
  text-align: center;
  font-size: 32px;
  /*color: #1da1f2;*/
  color: #333;
}
.login-title span {
  font-weight: 500;
}
.form-login {
  width: 100%;
  height: 440px;
  position: relative;
  display: flex;
  flex-direction: column;
}
.form__control {
  display: flex;
  flex-direction: column;
  margin: 12px 0;
}
.form__control label {
  font-size: 14px;
  padding: 12px 0;
  color: #333;
  font-weight: 500;
  margin: 8px 0;
}
.login-input-wrap {
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
.login-button {
  width: 100%;
  height: 48px; 
  margin-top: 48px;
}
.login-button button {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #00dbde, #fc00ff);
  background-color: #6bbeff;
  border-radius: 24px;
  border: none;
  cursor: pointer;
  color: #fff;
}
.login-button button:hover {
  background: linear-gradient(235deg, #00dbde, #fc00ff);
}
.register-button {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0;
}
.register-button a {
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