new Vue({
    name: 'game',
    el: '#app',
    template: `<div id="#app" :class="cssClass">
<!--标头部分-->
    <top-bar :turn="turn" :current-player-index="currentPlayerIndex" :players="players"/>
<!--背景世界-->
    <div class="world">
        <castle v-for="(player, index) in players" :player="player"
                :index="index" />
        <div class="land" />
        <div class="clouds">
            <cloud v-for="index in 10" :type="(index - 1) % 5 + 1" />
        </div>
    </div>
<!--浮层背景-->
    <transition name="fade">
        <div class="overlay-background" v-if="activeOverlay" />
    </transition>
<!--浮层-->
    <transition name="zoom">
        <overlay v-if="activeOverlay" :key="activeOverlay" @close="handleOverlayClose">
            <component 
            :is="'overlay-content-' + activeOverlay"
            :player="currentPlayer" :opponent="currentOpponent"
            :players="players" 
            />
        </overlay>
    </transition>
<!--手中的牌-->
    <transition name="hand">
       <hand v-if="!activeOverlay" :cards="currentHand" @card-play="handlePlayCard" @card-leave-end="handleCardLeaveEnd" />
    </transition>
    </div>`,

    data: state,//将state对象作为data属性，这里this.$data就是state对象

    computed: {
        // testCard() {
        //     return cards.archers
        // },
        cssClass() {
            return {
                'can-play': this.canPlay,
            }
        },

    },

    methods: {
        //处理卡牌点击
        handlePlayCard(card) {
            playCard(card)
        },
        handleCardLeaveEnd() {
            applyCard()
        },
        handleOverlayClose() {
            overlayCloseHandlers[this.activeOverlay]()
        },
        // //测试手中的牌
        // createTestHand() {
        //     const cards = []
        //     // 遍历获取卡牌的id
        //     const ids = Object.keys(cards)
        //     // 抽取5张卡牌
        //     for (let i = 0; i < 5; i++) {
        //         cards.push(this.testDrawCard())
        //     }

        //     return cards
        // },
        // //模拟卡牌的随机抽取
        // testDrawCard() {
        //     // 使用id随机选取一张卡牌
        //     let ids = Object.keys(cards)
        //     let randomId = ids[Math.floor(Math.random() * ids.length)]
        //     // 返回一张新的卡牌
        //     return {
        //         // 卡牌的唯一标识符
        //         uid: cardUid++,
        //         // 定义的id
        //         id: randomId,
        //         // 定义对象
        //         def: cards[randomId],
        //     }
        // },

        // //测试出牌
        // testPlayCard(card) {
        //     // 将卡牌从玩家手牌中移除即可
        //     const index = this.testHand.indexOf(card)
        //     this.testHand.splice(index, 1)
        // }

    },
    //测试Hook移除
    // created() {
    //     // console.log("121")
    //     this.testHand = this.createTestHand()
    // },
    mounted() {
        beginGame()
    },
})



//创建一个映射，键是浮层的类型，值则是操作触发时调用的函数。
var overlayCloseHandlers = {
    'player-turn'() {
        if (state.turn > 1) {
            state.activeOverlay = 'last-play'
        } else {
            newTurn()
        }
    },
    'last-play'() {
        newTurn()
    },
    'game-over'() {
        // 重新加载游戏
        document.location.reload()
    },
}

//窗口大小变化的处理
window.addEventListener('resize', () => {
    state.worldRatio = getWorldRatio();
})

// Tween.js
requestAnimationFrame(animate);

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}

//Gameplay
state.activeOverlay = 'player-turn'
function beginGame() {
    state.players.forEach(drawInitialHand)
}
//从手牌中移除卡牌
function playCard(card) {
    if (state.canPlay) {
        state.canPlay = false
        currentPlayingCard = card

        // 将卡牌从玩家手牌中移除
        const index = state.currentPlayer.hand.indexOf(card)
        state.currentPlayer.hand.splice(index, 1)

        // 将卡牌放到弃牌堆中
        addCardToPile(state.discardPile, card.id)
    }
}
//应用卡牌效果
function applyCard() {
    const card = currentPlayingCard

    applyCardEffect(card)
    // 稍等一会，让玩家观察到发生了什么
    setTimeout(() => {
        // 检查玩家是否“死亡”
        state.players.forEach(checkPlayerLost)

        if (isOnePlayerDead()) {
            endGame()
        } else {
            nextTurn()
        }
    }, 700)
}
function nextTurn() {
    state.turn++
    state.currentPlayerIndex = state.currentOpponentId
    state.activeOverlay = 'player-turn'
}

function newTurn() {
    state.activeOverlay = null
    if (state.currentPlayer.skipTurn) {
        skipTurn()
    } else {
        startTurn()
    }
}

function skipTurn() {
    state.currentPlayer.skippedTurn = true
    state.currentPlayer.skipTurn = false
    nextTurn()
}
function startTurn() {
    state.currentPlayer.skippedTurn = false
    // 如果两名玩家都已经玩过一个回合
    if (state.turn > 2) {
        // 抽一张新的卡牌
        setTimeout(() => {
            state.currentPlayer.hand.push(drawCard())
            state.canPlay = true
        }, 800)
    } else {
        state.canPlay = true
    }
}

function endGame() {

    state.activeOverlay = 'game-over'
}



