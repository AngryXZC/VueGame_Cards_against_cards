//标头组件
Vue.component('top-bar', {
    template: `<div class="top-bar" :class="'player-' +currentPlayerIndex">
     <div class="player p0">{{players[0].name}}</div>
      <div class="turn-counter">
        <img class="arrow" src="svg/turn.svg" />
        <div class="turn">回合 {{ turn }}</div>
      </div>
     <div class="player p0">{{players[1].name}}</div>
    </div>`,
    props: ['players', 'currentPlayerIndex', 'turn'],
    created() {
        //输出从父组件传递过来的数据
        console.log(this.players, this.currentPlayerIndex, this.turn)
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
            console.log("def", this.def)
            this.$emit('play');

        },
    },
});
//手牌组件
Vue.component('hand', {
    template: `<div class="hand">
        <div class="wrapper">
        <transition-group name="card" tag="div" class="cards" @after-leave="handleLeaveTransitionEnd">
          <card v-for="card of cards" :key=card.uid :def="card.def" @play="handlePlay(card)"/>
        </transition-group>
        </div>
  </div>`,
    props: ['cards'],
    methods: {
        handlePlay(card) {
            this.$emit('card-play', card)
        },
        handleLeaveTransitionEnd() {
            this.$emit('card-leave-end')
        },
    },
})
//浮层(overlay)组件
Vue.component('overlay', {
    template: `<div class="overlay" @click="handleClick">
    <div class="content">
    <!--这里是插槽-->
    <slot/>
    </div>
    </div>`,
    methods: {
        handleClick() {
            this.$emit('close')
        },
    },
})
//第一个浮层将根据是否跳过回合，向当前玩家显示两条不同的信息。
Vue.component('overlay-content-player-turn', {
    template: `<div>
                <div class="big" v-if="player.skipTurn">{{ player.name }},
                    <br>你的回合已经被跳过了!</div>
                <div class="big" v-else>{{ player.name }},<br>你的回合开始了!</div>
                <div>单击以继续</div>
            </div>`,
    props: ['player'],
})
//last-play浮层
Vue.component('overlay-content-last-play', {
    template: `<div>
            <div v-if="opponent.skippedTurn">{{ opponent.name }}回合被跳过!</div>
                <template v-else>
                    <div>{{ opponent.name }} 刚才使用了:</div>
                    <card :def="lastPlayedCard" />
                </template>
             </div>`,
    props: ['opponent'],
    computed: {
        lastPlayedCard() {
            return getLastPlayedCard(this.opponent)
        },
    },
})
//game-over浮层
//play-result的组件，用来显示玩家是胜利还是失败
Vue.component('player-result', {
    template: `<div class="player-result" :class="result">
        <span class="name">{{ player.name }}</span>
        <span class="result">{{ result }}</span>
    </div>`,
    props: ['player'],
    computed: {
        result() {
            return this.player.dead ? '失败' : '成功'
        },
    },
})
Vue.component('overlay-content-game-over', {
    template: `<div>
        <div class="big">Game Over</div>
        <player-result v-for="player in players" :player="player" /> </div>`,
    props: ['players'],
})