//标头组件
Vue.component('top-bar', {
    template: `<div class="top-bar" :class="'player-' +currentPlayerIndex">
     <div class="player p0">{{players[0].name}}</div>
      <div class="turn-counter">
        <img class="arrow" src="svg/turn.svg" />
        <div class="turn">Turn {{ turn }}</div>
      </div>
     <div class="player p0">{{players[1].name}}</div>
    </div>`,
    props: ['players', 'currentPlayerIndex', 'turn'],
    created() {
        //该组件是data中的state定义的我们可以看到这处的data是在state中定义的state对象而不是使用函数返回的对象
        //this.player是从父组件传来的
        //该处还有待加深理解
        console.log(this.players);
    },
})
//卡片组件
Vue.component('card', {
    template: `<div class="card" :class="'type-' + def.type" @click="play">
    <div class="title">{{ def.title }}</div>
    <img class="separator" src="svg/card-separator.svg" />
    <div class="description"><div v-html="def.description"></div></div>
    <div class="note" v-if="def.note"><div v-html="def.note"></div></div>
    </div>`,
    props: ['def'],
    methods: {
        //点击卡片
        play() {
            this.$emit('play');
        },
    },
});
//手牌组件
Vue.component('hand', {
    template: `<div class="hand">
        <div class="wrapper">
             <card v-for="card of cards" :key=card.id :def="card.def" @play="handlePlay(card)"/>
        </div>
  </div>`,
    props: ['cards'],
    methods: {
        handlePlay(card) {
            this.$emit('card-play', card)
        },
    },
})