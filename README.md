# 介绍使用到的Vue技术
## 游戏玩法介绍
+ 两名玩家轮流出牌；
+ 游戏开始时每名玩家有10点生命值、10份食物和5张手牌；
+ 玩家最高生命值为10点，食物最多10份；
+ 当玩家的食物或生命值为0时就失败了；
+ 两名玩家都可能在平局中失败；
+ 在每个回合中，玩家能做的操作就是打出一张牌，将其放到弃牌堆中；
+ 在每个回合开始，玩家从抽牌堆中摸一张牌（第一回合除外）；
+ 根据前面两条规则，玩家在每个回合开始的时候都有5张牌；
+ 当玩家摸牌时，如果抽牌堆空了，将会把弃牌堆中的牌重新放进抽牌堆；
+ 卡牌可以改变玩家自己或对手的生命值和食物点数；
+ 有些卡牌还可以让玩家跳过当前回合。
## 目录介绍
    ├── README.md               ---介绍文件
    ├── banner-template.svg     ---Vue定义组件的另一种方法
    ├── cards.js                ---准备使用的所有卡牌信息
    ├── components              ---Vue组件
    │   ├── ui.js 
    │   └── world.js
    ├── index.html              ---wdb页面
    ├── main.js                 ---主Vue文件
    ├── state.js                ---游戏的主要属性
    ├── style.css               ---CSS文件
    ├── svg                     ---游戏中所有的SVG图像
    ├── transitions.css         ---动画CSS文件
    └── utils.js                ---一些函数封装
## 具体记录
### 组件相关
![Vue组件树](/imgs/image.png)
1. 父组件到子组件通信——>使用prop
    1. 子组件中:
    ```vue
            Vue.component('top-bar', {
            // ...
            props: ['players', 'currentPlayerIndex', 'turn'],
            })
    ```
    2. 父组件中：
    ```vue
        <top-bar 
        :turn="turn"
        :current-player-index="currentPlayerInde"
        :players="players" />
    ```
2. 在组件上监听原生事件
    ```Vue
        <card :def="testCard" @click.native="handlePlay" />
    ```
    这是因为Vue针对组件有自己的事件系统，叫作“自定义事件”，一会我们将介绍。这套系统有别于浏览器事件，在这里Vue期望的是一个自定义的click事件，而不是浏览器事件。因此，handler方法不会被调用。

3. 使用自定义事件进行子组件——>父组件的通信
    1. 在组件内部，使用 $emit这个特殊方法触发的事件可以被父组件捕获到。该方法接收一个固
    定的参数，即事件类型:`this.$emit('play')`
        1. 在同一个Vue实例中，可以使用名为$on的特殊方法监听自定义事件：
            ``` vue
                this.$on('play', () => {
                console.log('Caught a play event!')
                })
            ```
    2. `$emit`方法还会触发一个play事件到父组件中。可以在父组件模板里使用v-on指令监听该事件：`<card v-on:play="handlePlay" />`
4. 过渡效果组件：`<transition>`

    1. 当元素被添加到DOM时（进入阶段），`<transition>`组件会自动将下列CSS类应用到元中:
        - v-enter-active：当进入过渡状态被激活时，会应用该类。在元素插入DOM之前，添加该类到元素中，并在动画结束时移除它。应该在这个类中添加一些transition CSS属性并定义其过渡时长。
        - v-enter：元素进入过渡的开始状态。在元素插入DOM之前，添加该类到元素中，并在元素被插入的下一帧移除。例如，你可以在这个类中设置透明度为0。
        - v-enter-to：元素进入过渡的结束状态。在元素插入DOM后的下一帧添加，同时v-enter被移除。当动画完成后，v-enter-to会被移除。
    2. 当元素从DOM中移除时（离开阶段），`<transition>`组件会自动将下列CSS类应用到元素中:
        - v-leave-active：当离开过渡状态被激活时，会应用该类。当离开过渡触发时，添加该类到元素中，并在从DOM中移除元素时移除它。应该在这个类中添加一些transition CSS属性并定义其过渡时长。
        - v-leave：元素被移除时的开始状态。当离开过渡触发时，添加该类到元素中，并在下一帧移除。
        - v-leave-to：元素离开过渡的结束状态。在离开过渡触发后的下一帧添加，同时v-leave被移除。当从DOM中移除元素时，该类也会被移除。
        - 在离开阶段，并不会立即从DOM中移除元素。当过渡结束后，才会将其移除，这样用户可以看到动画效果。
    3. 下图总结了元素的进入和离开这两种过渡阶段，标明了相应的CSS类:
    ![<transition>](/imgs/transition_img.png)
        <B>` <transition>`组件会自动检测应用在元素上的CSS过渡效果的持续时间。</B>
    4. 为元素列表添加动画效果，需要使用另外一个特殊的组件`<transition-group>`。当元素被添加、移除和移动时，该组件将对它的子元素做出动画效果。在模板中，看起来是这样的：
        ```vue
        <transition-group>
        <div v-for="item of items" />
        </transition-group>
        ```
    5. 这些组件可以触发事件
### 插槽相关
1. 创建插槽
    ```Vue
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
    ```
2. 动态组件
    1. 三条件语句（凌乱版）
    ```vue
        <overlay v-if="activeOverlay">
        <overlay-content-player-turn
            v-if="activeOverlay === 'player-turn'"
            :player="currentPlayer" />
        <overlay-content-last-play
            v-else-if="activeOverlay === 'last-play'"
            :opponent="currentOpponent" />
        <overlay-content-game-over
            v-else-if="activeOverlay === 'game-over'"
            :players="players" />
        </overlay>
    ```
    2. vue提供的特殊组件：component组件-只需要将它的is prop设置为一个组件名或组件定义对象，甚至是一个HTML标签，component组件就会变为相应的内容：
        ```vue
        <component is="h1">Title</component>
        <component is="overlay-content-player-turn" />
        ```
    3. 所以最终的版本：
        ```vue
            <transition name="zoom">
                <overlay v-if="activeOverlay" :key="activeOverlay" @close="handleOverlayClose">
                <component 
                :is="'overlay-content-' + activeOverlay"
                :player="currentPlayer" :opponent="currentOpponent"
                :players="players" 
                />
            </overlay>
            </transition>
        ```
