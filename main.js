new Vue({
    name: 'game',
    el: '#app',

    template: `<div id="#app">
    <top-bar :turn="turn" :current-player-index="currentPlayerIndex" :players="players"/>
    <card :def=testCard @play="handlePlay" />
    <transition name="hand">
       <hand v-if="!activeOverlay" :cards="testHand" @card-play="testPlayCard" />
    </transition>
    </div>`,

    data: state,
    mounted() {
        console.log(this.$data === state);
    },

    computed: {
        testCard() {
            return cards.archers
        },

    },

    methods: {
        //处理卡牌点击
        handlePlay() {
            console.log("handlePlay");
        },
        //测试手中的牌
        createTestHand() {
            const cards = []
            // 遍历获取卡牌的id
            const ids = Object.keys(cards)
            // 抽取5张卡牌
            for (let i = 0; i < 5; i++) {
                cards.push(this.testDrawCard())
            }

            return cards
        },
        //模拟卡牌的随机抽取
        testDrawCard() {
            // 使用id随机选取一张卡牌
            let ids = Object.keys(cards)
            let randomId = ids[Math.floor(Math.random() * ids.length)]
            // 返回一张新的卡牌
            return {
                // 卡牌的唯一标识符
                uid: cardUid++,
                // 定义的id
                id: randomId,
                // 定义对象
                def: cards[randomId],
            }
        },

        //测试出牌
        testPlayCard(card) {
            // 将卡牌从玩家手牌中移除即可
            const index = this.testHand.indexOf(card)
            this.testHand.splice(index, 1)
        }
    },

    created() {
        // console.log("121")
        this.testHand = this.createTestHand()
    },
})
//窗口大小变化的处理
window.addEventListener('resize', () => {
    state.worldRatio = getWorldRatio();
})