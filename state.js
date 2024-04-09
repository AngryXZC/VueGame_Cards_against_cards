
// Some usefull variables
var maxHealth = 10
var maxFood = 10
var handSize = 5
var cardUid = 0
var currentPlayingCard = null

// The consolidated state of our app
var state = {
  // 用户界面
  activeOverlay: null,
  // World
  worldRatio: getWorldRatio(),
  // Game
  //当前回合数,从1开始计数
  turn: 1,
  //玩家对象数组
  players: [
    {
      //游戏开始时的状态
      name: '阿卡丽',
      food: 10,
      health: 10,
      //是否跳过下个回合
      skipTurn: false,
      //跳过了个上个回合
      skippedTurn: false,
      hand: [],
      lastPlayedCardId: null,
      dead: false,
    },
    {
      name: '卡特琳娜',
      food: 10,
      health: 10,
      skipTurn: false,
      skippedTurn: false,
      hand: [],
      lastPlayedCardId: null,
      dead: false,
    },
  ],
  //当前玩家在players数组中的索引
  currentPlayerIndex: Math.round(Math.random()),
  // //测试hand属性
  // testHand: [],
  //用户界面
  activeOverlay: null,
  //根据currentPlayerIndex属性返回player对象：
  get currentPlayer() {
    return state.players[state.currentPlayerIndex]
  },
  //返回对手player的索引
  get currentOpponentId() {
    return state.currentPlayerIndex === 0 ? 1 : 0
  },
  //返回相应的player对象
  get currentOpponent() {
    return state.players[state.currentOpponentId]
  },
  //玩家可以抽牌的牌堆
  drawPile: pile,

  discardPile: {},

  get currentHand() {
    return state.currentPlayer.hand
  },
  //防止玩家在回合中重复出牌
  canPlay: false,
}
