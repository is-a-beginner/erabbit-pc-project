import { createStore } from 'vuex'

const moduleA = {
  state:[username:'zs'],
}

const moduleB = {
  state:[username:'zs'],
}

export default createStore({
  modules: {
    moduleA,
    moduleB
  }
})

